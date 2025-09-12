# 🚀 Phase 3: Subscription Automation - Integration Guide

## Overview

Phase 3 connects the web billing system to automatic desktop app synchronization. When users subscribe on scalix.world, their desktop app automatically gets Pro features without manual API key entry.

## 🏗️ Architecture

```
Web App (scalix.world) → Stripe Webhooks → Cloud API → Desktop Sync
     ↓                              ↓              ↓            ↓
User subscribes → Webhook fired → API key created → Desktop updates settings
```

## 📋 Web App Integration (scalix.world)

### 1. Stripe Webhook Configuration

Set up Stripe webhooks to point to your Cloud API:

```javascript
// In your Stripe dashboard or webhook setup
const webhookEndpoint = 'https://your-cloud-api.com/webhooks/stripe';

// Events to listen for:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

### 2. Post-Subscription Desktop Sync

After successful subscription, trigger desktop sync:

```typescript
// In your subscription success handler
const handleSubscriptionSuccess = async (subscriptionId: string) => {
  // 1. Get user auth token
  const token = localStorage.getItem('scalix_auth_token');

  // 2. Call desktop sync (if desktop app is open)
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.handleWebLoginSync(token);
      if (result.success) {
        console.log('Desktop synced successfully!');
        // Show success message
      }
    } catch (error) {
      console.log('Desktop not available or sync failed');
      // This is OK - desktop will sync when opened
    }
  }

  // 3. Show instructions for desktop users
  showDesktopInstructions();
};
```

### 3. API Key Display

Show generated API key to users (for backup/manual entry):

```typescript
// In your dashboard
const [apiKeys, setApiKeys] = useState([]);

useEffect(() => {
  const loadApiKeys = async () => {
    const response = await fetch('/api/keys', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const keys = await response.json();
      setApiKeys(keys);
    }
  };
  loadApiKeys();
}, []);

return (
  <div>
    <h3>Your API Keys</h3>
    {apiKeys.map(key => (
      <div key={key.id}>
        <code>{key.key}</code>
        <span>Plan: {key.plan}</span>
        <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
      </div>
    ))}
    <p>💡 These keys are automatically synced to your desktop app!</p>
  </div>
);
```

## 🖥️ Desktop App Integration

### 1. Web Login Detection

Add web login detection to automatically sync:

```typescript
// In your main app component or router
useEffect(() => {
  // Listen for web login events (you'll need to implement this)
  const handleWebLogin = async (token: string) => {
    const ipcClient = IpcClient.getInstance();
    const result = await ipcClient.handleWebLoginSync(token);

    if (result.success) {
      // Refresh settings and show success message
      window.location.reload(); // Or update state properly
    }
  };

  // This could be triggered by:
  // - Deep links from web app
  // - IPC messages from web app
  // - Polling for auth status
}, []);
```

### 2. Sync Status Display

Show sync status in the Pro Mode Selector:

```typescript
// Already implemented in ProModeSelector.tsx
const { cloudStatus } = useCloudStatus();

return (
  <div>
    {/* Cloud status indicators already added */}
    <CloudStatusIcon status={cloudStatus} />

    {/* Usage display already added */}
    {usageSummary && <UsageDashboard data={usageSummary} />}
  </div>
);
```

### 3. Manual Sync Option

Add manual sync button in settings:

```typescript
// In your settings page
const handleManualSync = async () => {
  const ipcClient = IpcClient.getInstance();
  const result = await ipcClient.triggerCloudSync();

  if (result.success) {
    showToast('Sync successful!');
  } else {
    showToast('Sync failed: ' + result.error);
  }
};

return (
  <button onClick={handleManualSync}>
    🔄 Sync with Cloud
  </button>
);
```

## ☁️ Cloud API Setup

### 1. Environment Variables

```bash
# GCP Project
GCP_PROJECT_ID=your-project-id

# Firebase/Firestore
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_CLIENT_X509_CERT_URL=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# JWT (for future use)
JWT_SECRET=your-jwt-secret
```

### 2. Stripe Webhook Setup

```bash
# Install Stripe CLI for testing
stripe listen --forward-to localhost:8080/webhooks/stripe

# Or configure in Stripe Dashboard:
# Endpoint URL: https://your-api.com/webhooks/stripe
# Events: customer.subscription.*, invoice.payment_*
```

### 3. Database Initialization

```bash
cd scalix-cloud-api
npm run init-db
```

## 🔄 Sync Flow

### Automatic Sync (Ideal User Experience)

1. **User visits scalix.world** → Signs up/logs in
2. **User subscribes to Pro** → Stripe processes payment
3. **Stripe sends webhook** → Cloud API creates API key
4. **User opens desktop app** → Auto-detects web login → Syncs settings
5. **Desktop gets Pro features** → No manual configuration needed!

### Manual Sync (Fallback)

1. **User subscribes on web** → Gets API key in dashboard
2. **User copies API key** → Pastes in desktop settings
3. **Desktop validates key** → Enables Pro features

### Offline Support

- **Desktop works offline** → Uses cached API key validation
- **Sync happens when online** → Automatic background sync
- **Graceful degradation** → Shows "offline mode" indicators

## 🧪 Testing

### 1. Webhook Testing

```bash
# Use Stripe CLI to test webhooks
stripe trigger customer.subscription.created

# Check Cloud API logs for webhook processing
```

### 2. Desktop Sync Testing

```javascript
// In desktop console
const ipcClient = IpcClient.getInstance();
await ipcClient.triggerCloudSync();
```

### 3. End-to-End Testing

1. Subscribe on web app
2. Open desktop app
3. Check if Pro features are enabled
4. Verify usage tracking works

## 📊 Monitoring

### Key Metrics to Track

- **Webhook success rate** (Stripe → Cloud API)
- **Desktop sync success rate** (Cloud API → Desktop)
- **Subscription conversion** (Web payment → Desktop Pro activation)
- **Sync latency** (Time from webhook to desktop update)

### Error Handling

- **Webhook failures** → Alert on Stripe dashboard
- **Sync failures** → Retry logic with exponential backoff
- **Token expiration** → Automatic refresh from web app

## 🚀 Deployment

### 1. Cloud API Deployment

```bash
cd scalix-cloud-api
npm run build  # If you add build step
gcloud run deploy scalix-cloud-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars "NODE_ENV=production"
```

### 2. Web App Updates

- Deploy updated subscription flow
- Add desktop sync calls
- Update dashboard with API key display

### 3. Desktop App Updates

- Deploy with cloud sync features
- Test backward compatibility
- Monitor for sync issues

## 🎯 Success Criteria

- ✅ **90%+ webhook success rate**
- ✅ **95%+ desktop sync success rate**
- ✅ **Zero manual API key entry** for new subscribers
- ✅ **Seamless cross-platform experience**

## 🔧 Troubleshooting

### Common Issues

1. **Webhooks not firing**
   - Check Stripe webhook URL
   - Verify webhook secret
   - Test with Stripe CLI

2. **Desktop sync failing**
   - Check internet connectivity
   - Verify JWT token validity
   - Check Cloud API logs

3. **API key not created**
   - Check Firestore permissions
   - Verify Stripe price IDs match
   - Check user creation in database

---

**Phase 3 completes the SaaS transformation!** 🎉

Users can now subscribe on the web and automatically get Pro features on desktop. The hybrid architecture is complete and cost-optimized.
