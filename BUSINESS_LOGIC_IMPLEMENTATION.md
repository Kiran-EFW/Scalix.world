# 🎯 Scalix Business Logic Implementation Guide

## Executive Summary

This document outlines the implementation of business logic for Scalix's free/pro user system across the Electron desktop app and Google Cloud-hosted web interface. The implementation transforms the current API-key based Pro activation into a comprehensive authentication, subscription, and usage management system.

---

## 🏗️ Architecture Overview

### Current vs. Target Architecture

**Current (Desktop-Only):**
```
Desktop App (Electron)
├── Local SQLite DB
├── API Key Activation
├── Local Settings
└── No User Management
```

**Target (Cloud + Desktop):**
```
Google Cloud Platform
├── Cloud SQL (PostgreSQL)
├── Cloud Run (API Services)
├── Identity Platform (Auth)
└── Desktop App (Electron)

Shared Business Logic Layer:
├── User Authentication
├── Subscription Management
├── Usage Tracking
├── Feature Gating
└── Cross-Platform Sync
```

---

## 🔐 Authentication System Design

### 1. User Model

```typescript
// Database Schema (Cloud SQL)
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
}

interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  deviceType: 'desktop' | 'web';
  deviceId: string;
  ipAddress: string;
  userAgent: string;
}
```

### 2. Authentication Flow

**Desktop App:**
```typescript
// src/lib/auth/desktop-auth.ts
class DesktopAuth {
  async authenticate(email: string, password: string): Promise<UserSession> {
    // Call cloud API
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceType: 'desktop' })
    });

    const { user, session } = await response.json();

    // Store session locally
    await this.storeSession(session);

    return { user, session };
  }

  async validateSession(): Promise<boolean> {
    const session = await this.getStoredSession();
    if (!session) return false;

    try {
      const response = await fetch(`${API_BASE}/auth/validate`, {
        headers: { 'Authorization': `Bearer ${session.token}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

**Web Interface:**
```typescript
// Leverages existing useAuth hook but connects to real API
// hooks/useAuth.ts - Update production mode
const signIn = async (email: string, password: string) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, deviceType: 'web' })
  });

  if (!response.ok) throw new Error('Authentication failed');

  const { user, token } = await response.json();
  localStorage.setItem('scalix_auth_token', token);
  setUser(user);
};
```

---

## 💰 Subscription Management System

### 1. Subscription Model

```typescript
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Plan {
  id: string;
  name: string;
  displayName: string;
  price: number; // Monthly price in cents
  currency: 'usd';
  features: PlanFeature[];
  limits: PlanLimits;
  stripePriceId?: string;
}

interface PlanLimits {
  maxProjects: number;
  maxAiTokens: number; // Per month
  maxStorage: number; // In bytes
  maxTeamMembers: number;
  maxApiCalls: number; // Per hour
  advancedFeatures: boolean;
  prioritySupport: boolean;
}

interface PlanFeature {
  name: string;
  description: string;
  enabled: boolean;
}
```

### 2. Plan Definitions

```json
{
  "free": {
    "name": "free",
    "displayName": "Free",
    "price": 0,
    "limits": {
      "maxProjects": 3,
      "maxAiTokens": 10000,
      "maxStorage": 1073741824, // 1GB
      "maxTeamMembers": 1,
      "maxApiCalls": 100,
      "advancedFeatures": false,
      "prioritySupport": false
    }
  },
  "pro": {
    "name": "pro",
    "displayName": "Pro",
    "price": 4999, // $49.99
    "limits": {
      "maxProjects": 50,
      "maxAiTokens": 200000,
      "maxStorage": 10737418240, // 10GB
      "maxTeamMembers": 5,
      "maxApiCalls": 1000,
      "advancedFeatures": true,
      "prioritySupport": true
    }
  }
}
```

### 3. Subscription Service

```typescript
// Cloud API: src/services/subscription-service.ts
class SubscriptionService {
  async createSubscription(userId: string, planId: string, paymentMethodId: string) {
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: userId,
      items: [{ price: plan.stripePriceId }],
      payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent']
    });

    // Store in database
    await db.subscription.create({
      data: {
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    return subscription;
  }

  async getUserPlan(userId: string): Promise<Plan> {
    const subscription = await db.subscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true }
    });

    return subscription?.plan || this.getDefaultPlan('free');
  }

  async checkLimit(userId: string, limitType: keyof PlanLimits): Promise<LimitCheck> {
    const plan = await this.getUserPlan(userId);
    const currentUsage = await this.getCurrentUsage(userId, limitType);

    return {
      allowed: currentUsage < plan.limits[limitType],
      current: currentUsage,
      limit: plan.limits[limitType],
      remaining: Math.max(0, plan.limits[limitType] - currentUsage)
    };
  }
}
```

---

## 📊 Usage Tracking System

### 1. Usage Metrics Model

```typescript
interface UsageRecord {
  id: string;
  userId: string;
  metric: UsageMetric;
  amount: number;
  timestamp: Date;
  resourceId?: string; // e.g., projectId, chatId
  metadata?: Record<string, any>;
}

type UsageMetric =
  | 'ai_tokens'
  | 'api_calls'
  | 'storage_bytes'
  | 'projects_created'
  | 'chats_created'
  | 'messages_sent'
  | 'file_uploads'
  | 'feature_usage';

interface UsageAggregate {
  userId: string;
  metric: UsageMetric;
  period: 'hour' | 'day' | 'month' | 'year';
  periodStart: Date;
  periodEnd: Date;
  total: number;
  lastUpdated: Date;
}
```

### 2. Usage Tracking Service

```typescript
// Cloud API: src/services/usage-service.ts
class UsageService {
  async trackUsage(userId: string, metric: UsageMetric, amount: number, metadata?: any) {
    // Record individual usage
    await db.usageRecord.create({
      data: {
        userId,
        metric,
        amount,
        timestamp: new Date(),
        metadata
      }
    });

    // Update aggregate counters
    await this.updateAggregates(userId, metric, amount);
  }

  async getUsage(userId: string, metric: UsageMetric, period: UsagePeriod) {
    const { start, end } = this.getPeriodRange(period);

    const result = await db.usageAggregate.findFirst({
      where: {
        userId,
        metric,
        period,
        periodStart: start,
        periodEnd: end
      }
    });

    return result?.total || 0;
  }

  async checkRateLimit(userId: string, action: string): Promise<boolean> {
    const plan = await subscriptionService.getUserPlan(userId);
    const hourlyLimit = plan.limits.maxApiCalls;

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentUsage = await db.usageRecord.count({
      where: {
        userId,
        metric: 'api_calls',
        timestamp: { gte: hourAgo }
      }
    });

    return recentUsage < hourlyLimit;
  }
}
```

### 3. Rate Limiting Middleware

```typescript
// Cloud API: src/middleware/rate-limit.ts
export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next();

  const action = req.path;
  const allowed = await usageService.checkRateLimit(userId, action);

  if (!allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: 3600 // seconds
    });
  }

  // Track the API call
  await usageService.trackUsage(userId, 'api_calls', 1, {
    endpoint: req.path,
    method: req.method
  });

  next();
};
```

---

## 🚪 Feature Gating System

### 1. Feature Gate Model

```typescript
interface FeatureGate {
  name: string;
  description: string;
  requiredPlan: 'free' | 'pro' | 'enterprise';
  enabled: boolean;
  rolloutPercentage?: number; // For gradual rollouts
  conditions?: FeatureCondition[];
}

interface FeatureCondition {
  type: 'user_id' | 'email_domain' | 'subscription_age';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

interface FeatureCheck {
  allowed: boolean;
  reason?: string;
  upgradeUrl?: string;
}
```

### 2. Feature Gate Service

```typescript
// Cloud API: src/services/feature-gate-service.ts
class FeatureGateService {
  private gates: Map<string, FeatureGate> = new Map();

  constructor() {
    this.initializeGates();
  }

  private initializeGates() {
    this.gates.set('advanced_ai_models', {
      name: 'Advanced AI Models',
      description: 'Access to premium AI models like GPT-4, Claude 3 Opus',
      requiredPlan: 'pro',
      enabled: true
    });

    this.gates.set('team_collaboration', {
      name: 'Team Collaboration',
      description: 'Share projects with team members',
      requiredPlan: 'pro',
      enabled: true
    });

    this.gates.set('priority_support', {
      name: 'Priority Support',
      description: '24/7 priority customer support',
      requiredPlan: 'pro',
      enabled: true
    });
  }

  async checkFeature(userId: string, featureName: string): Promise<FeatureCheck> {
    const gate = this.gates.get(featureName);
    if (!gate || !gate.enabled) {
      return { allowed: false, reason: 'Feature not available' };
    }

    const user = await userService.getUser(userId);
    const subscription = await subscriptionService.getUserPlan(userId);

    // Check plan requirement
    const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
    const userPlanLevel = planHierarchy[subscription.name as keyof typeof planHierarchy];
    const requiredPlanLevel = planHierarchy[gate.requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return {
        allowed: false,
        reason: `This feature requires ${gate.requiredPlan} plan`,
        upgradeUrl: '/pricing'
      };
    }

    // Check rollout percentage
    if (gate.rolloutPercentage && gate.rolloutPercentage < 100) {
      const userRolloutHash = this.getUserRolloutHash(userId);
      if (userRolloutHash > gate.rolloutPercentage) {
        return { allowed: false, reason: 'Feature not yet available' };
      }
    }

    // Check additional conditions
    if (gate.conditions) {
      for (const condition of gate.conditions) {
        if (!this.evaluateCondition(user, condition)) {
          return { allowed: false, reason: 'Feature access denied' };
        }
      }
    }

    return { allowed: true };
  }

  private getUserRolloutHash(userId: string): number {
    // Simple hash function for rollout percentage
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) % 100;
  }
}
```

### 3. Feature Gate Integration

**Desktop App:**
```typescript
// src/lib/features/feature-gate.ts
class DesktopFeatureGate {
  async checkFeature(featureName: string): Promise<FeatureCheck> {
    const session = await auth.getCurrentSession();
    if (!session) {
      return { allowed: false, reason: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE}/features/check/${featureName}`, {
        headers: { 'Authorization': `Bearer ${session.token}` }
      });

      return await response.json();
    } catch (error) {
      // Fallback to local checks for offline mode
      return this.checkFeatureLocally(featureName);
    }
  }

  private checkFeatureLocally(featureName: string): FeatureCheck {
    // Fallback logic for offline scenarios
    const settings = getUserSettings();
    const hasProKey = !!settings.providerSettings?.auto?.apiKey?.value;

    switch (featureName) {
      case 'advanced_ai_models':
        return {
          allowed: hasProKey,
          reason: hasProKey ? undefined : 'Pro subscription required'
        };
      default:
        return { allowed: false, reason: 'Feature check failed' };
    }
  }
}
```

---

## 🔄 Data Synchronization

### 1. Sync Architecture

```typescript
interface SyncEntity {
  id: string;
  type: 'project' | 'chat' | 'message' | 'settings';
  userId: string;
  localId: string; // Desktop-specific ID
  cloudId?: string; // Cloud-specific ID
  data: any;
  version: number;
  lastModified: Date;
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
}

interface SyncOperation {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  localData: any;
  cloudData?: any;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}
```

### 2. Synchronization Service

```typescript
// Desktop: src/services/sync-service.ts
class SyncService {
  async syncEntity(entity: SyncEntity): Promise<void> {
    const session = await auth.getCurrentSession();
    if (!session) return;

    try {
      const response = await fetch(`${API_BASE}/sync/${entity.type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entity)
      });

      if (response.ok) {
        await this.markEntitySynced(entity.id);
      } else {
        await this.markEntityError(entity.id);
      }
    } catch (error) {
      await this.markEntityError(entity.id);
    }
  }

  async pullCloudData(): Promise<void> {
    const session = await auth.getCurrentSession();
    if (!session) return;

    const lastSync = await this.getLastSyncTime();

    const response = await fetch(`${API_BASE}/sync/pull?since=${lastSync.toISOString()}`, {
      headers: { 'Authorization': `Bearer ${session.token}` }
    });

    const { entities } = await response.json();

    for (const entity of entities) {
      await this.mergeEntity(entity);
    }
  }

  private async mergeEntity(cloudEntity: any): Promise<void> {
    const localEntity = await this.findLocalEntity(cloudEntity.type, cloudEntity.id);

    if (!localEntity) {
      // New entity from cloud
      await this.createLocalEntity(cloudEntity);
    } else if (cloudEntity.version > localEntity.version) {
      // Cloud version is newer
      await this.updateLocalEntity(cloudEntity);
    } else if (cloudEntity.version < localEntity.version) {
      // Local version is newer, push to cloud
      await this.syncEntity(localEntity);
    }
    // Versions equal = already in sync
  }
}
```

---

## 📡 API Architecture

### 1. API Routes Structure

```
Cloud API (Cloud Run)
├── /api/v1/
│   ├── auth/
│   │   ├── login
│   │   ├── logout
│   │   ├── refresh
│   │   ├── validate
│   │   └── me
│   ├── users/
│   │   ├── profile
│   │   └── preferences
│   ├── subscriptions/
│   │   ├── plans
│   │   ├── current
│   │   ├── create
│   │   └── cancel
│   ├── billing/
│   │   ├── invoices
│   │   ├── payment-methods
│   │   └── usage
│   ├── features/
│   │   └── check/:feature
│   ├── usage/
│   │   ├── track
│   │   ├── summary
│   │   └── limits
│   ├── sync/
│   │   ├── push
│   │   ├── pull
│   │   └── conflicts
│   └── projects/
│       ├── list
│       ├── create
│       └── :id/sync
```

### 2. API Middleware Stack

```typescript
// src/middleware/index.ts
export const middleware = [
  corsMiddleware,
  helmetMiddleware,
  rateLimitMiddleware,
  authMiddleware,
  tenantMiddleware,
  usageTrackingMiddleware,
  featureGateMiddleware
];
```

### 3. Error Handling

```typescript
// src/lib/errors.ts
export class BusinessLogicError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'BusinessLogicError';
  }
}

export const ErrorCodes = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // Subscription
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  PLAN_LIMIT_EXCEEDED: 'PLAN_LIMIT_EXCEEDED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',

  // Usage
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Features
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
  FEATURE_DISABLED: 'FEATURE_DISABLED'
} as const;
```

---

## 🔧 Implementation Phases

### Phase 1: Foundation (Week 1-2)
1. ✅ Set up Google Cloud infrastructure
2. ✅ Create user authentication system
3. ✅ Implement basic subscription management
4. ✅ Deploy API to Cloud Run

### Phase 2: Core Business Logic (Week 3-4)
1. ⏳ Implement usage tracking system
2. ⏳ Create feature gating service
3. ⏳ Add rate limiting and quotas
4. ⏳ Integrate Stripe for payments

### Phase 3: Desktop Integration (Week 5-6)
1. ⏳ Update Electron app authentication
2. ⏳ Implement data synchronization
3. ⏳ Migrate from API key to user accounts
4. ⏳ Add offline support with sync

### Phase 4: Web Interface Enhancement (Week 7-8)
1. ⏳ Update web interface with real authentication
2. ⏳ Implement subscription management UI
3. ⏳ Add usage dashboard
4. ⏳ Create billing and payment flows

### Phase 5: Production Ready (Week 9-10)
1. ⏳ Add comprehensive testing
2. ⏳ Implement monitoring and alerting
3. ⏳ Security hardening
4. ⏳ Performance optimization

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// src/__tests__/services/subscription-service.test.ts
describe('SubscriptionService', () => {
  it('should create subscription successfully', async () => {
    const userId = 'user-123';
    const planId = 'pro';

    const subscription = await subscriptionService.createSubscription(
      userId,
      planId,
      'pm_test_payment_method'
    );

    expect(subscription.status).toBe('active');
    expect(subscription.planId).toBe(planId);
  });

  it('should enforce plan limits', async () => {
    const userId = 'user-456'; // Free plan user

    const limitCheck = await subscriptionService.checkLimit(userId, 'maxProjects');

    expect(limitCheck.allowed).toBe(true);
    expect(limitCheck.limit).toBe(3); // Free plan limit
  });
});
```

### Integration Tests
```typescript
// Desktop integration test
describe('Desktop Authentication Flow', () => {
  it('should authenticate user and store session', async () => {
    const auth = new DesktopAuth();

    const session = await auth.authenticate('user@example.com', 'password');

    expect(session.user.email).toBe('user@example.com');
    expect(session.token).toBeDefined();

    // Verify session is stored
    const stored = await auth.getStoredSession();
    expect(stored?.token).toBe(session.token);
  });
});
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
1. **User Acquisition**: Sign-ups, conversion rates
2. **Subscription Metrics**: Churn rate, MRR, ARR
3. **Usage Metrics**: Feature adoption, quota utilization
4. **Performance**: API response times, error rates
5. **Business Metrics**: Revenue per user, lifetime value

### Monitoring Setup
```typescript
// src/services/monitoring.ts
class MonitoringService {
  async trackEvent(event: string, properties: any) {
    // Send to analytics service (e.g., Mixpanel, Google Analytics)
    await analytics.track(event, properties);
  }

  async trackUsage(userId: string, metric: string, value: number) {
    // Store in time-series database for dashboards
    await metricsDB.insert({
      userId,
      metric,
      value,
      timestamp: new Date()
    });
  }

  async alert(condition: string, message: string) {
    // Send alerts to monitoring system
    await alerting.send({
      condition,
      message,
      severity: 'warning'
    });
  }
}
```

---

## 🚀 Deployment Strategy

### Environment Setup
```bash
# Development
export NODE_ENV=development
export DATABASE_URL="postgresql://localhost:5432/scalix_dev"
export STRIPE_SECRET_KEY="sk_test_..."

# Staging
export NODE_ENV=staging
export DATABASE_URL="postgresql://cloud-sql/scalix_staging"
export STRIPE_SECRET_KEY="sk_test_..."

# Production
export NODE_ENV=production
export DATABASE_URL="postgresql://cloud-sql/scalix_prod"
export STRIPE_SECRET_KEY="sk_live_..."
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Business Logic API

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: scalix-api-staging
          image: gcr.io/scalix-saas/scalix-api:${{ github.sha }}

  deploy-prod:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: scalix-api
          image: gcr.io/scalix-saas/scalix-api:${{ github.sha }}
```

---

## 🎯 Success Metrics

### Business Metrics
- **User Growth**: 1000+ active users within 6 months
- **Conversion Rate**: 15% free to pro conversion
- **Revenue**: $10K MRR within 12 months
- **Retention**: 85% monthly retention rate

### Technical Metrics
- **API Availability**: 99.9% uptime
- **Response Time**: <200ms average API response
- **Error Rate**: <0.1% API error rate
- **Sync Success**: >95% data synchronization success rate

---

This implementation provides a comprehensive business logic system that scales from desktop-only to cloud-based SaaS while maintaining backward compatibility and providing a seamless user experience across platforms.
