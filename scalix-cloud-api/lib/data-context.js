// ============================================================================
// DATA CONTEXT & USER FILTERING SYSTEM
// ============================================================================
// This module provides consistent data filtering and user context across all
// Scalix applications (web, internal-admin, electron, api-server)
// ============================================================================

const admin = require('firebase-admin');

// ============================================================================
// USER CONTEXT SYSTEM
// ============================================================================

class DataContext {
  constructor(user, application, request) {
    this.user = user;
    this.application = application;
    this.request = request;
    this.db = admin.firestore();
    this.timestamp = new Date();
  }

  // Get user context for data filtering
  async getUserContext() {
    return {
      userId: this.user?.id,
      userRole: this.user?.role || 'user',
      userPermissions: this.user?.permissions || [],
      userPlan: this.user?.plan || 'free',
      application: this.application,
      sessionId: this.request?.sessionId,
      ipAddress: this.request?.ip,
      timestamp: this.timestamp,
      featureFlags: await this.getFeatureFlags(),
      dataFilters: await this.getDataFilters()
    };
  }

  // Get feature flags for user
  async getFeatureFlags() {
    const flags = {
      // Base features for all users
      basic_ai: true,
      basic_chat: true,
      basic_storage: true,

      // Role-based features
      admin_features: this.hasRole('admin'),
      super_admin_features: this.hasRole('super_admin'),

      // Plan-based features
      advanced_ai_models: this.hasPlan('pro'),
      team_collaboration: this.hasPlan('pro'),
      priority_support: this.hasPlan('pro'),
      unlimited_projects: this.hasPlan('pro'),
      enterprise_sso: this.hasPlan('enterprise'),
      advanced_analytics: this.hasPlan('enterprise'),

      // Application-specific features
      web_app_features: this.application === 'web',
      internal_admin_features: this.application === 'internal-admin',
      electron_app_features: this.application === 'electron'
    };

    return flags;
  }

  // Get data filters for user
  async getDataFilters() {
    const filters = {
      // Base filters
      userId: this.user?.id,
      userRole: this.user?.role || 'user',

      // Data visibility filters
      canViewAllUsers: this.hasPermission('manage_users'),
      canViewAllPlans: this.hasPermission('manage_plans'),
      canViewAnalytics: this.hasPermission('view_analytics'),
      canViewSystemData: this.hasPermission('manage_system'),
      canViewSecurityData: this.hasPermission('view_security'),

      // Application-specific filters
      applicationContext: this.application,

      // Data scope limitations
      maxRecords: this.getMaxRecords(),
      allowedFields: this.getAllowedFields(),
      dataProjection: this.getDataProjection()
    };

    return filters;
  }

  // ============================================================================
  // PERMISSION & ROLE CHECKS
  // ============================================================================

  hasRole(role) {
    if (!this.user) return false;
    if (this.user.role === 'super_admin') return true;
    if (role === 'admin' && this.user.role === 'admin') return true;
    return this.user.role === role;
  }

  hasPermission(permission) {
    if (!this.user) return false;
    return this.user.permissions?.includes(permission) ||
           this.getRolePermissions(this.user.role).includes(permission);
  }

  hasPlan(plan) {
    if (!this.user) return false;
    const userPlan = this.user.plan || 'free';
    const planHierarchy = { free: 0, pro: 1, team: 2, enterprise: 3 };
    return planHierarchy[userPlan] >= planHierarchy[plan];
  }

  getRolePermissions(role) {
    const permissions = {
      user: [],
      admin: [
        'view_admin_dashboard',
        'view_analytics',
        'view_security',
        'view_api_keys',
        'manage_api_keys',
        'view_team_settings',
        'manage_team_settings'
      ],
      super_admin: [
        'view_admin_dashboard',
        'manage_users',
        'manage_plans',
        'view_analytics',
        'manage_system',
        'view_security',
        'manage_billing',
        'view_api_keys',
        'manage_api_keys',
        'view_team_settings',
        'manage_team_settings',
        'view_internal_data',
        'manage_internal_data'
      ]
    };
    return permissions[role] || [];
  }

  // ============================================================================
  // DATA FILTERING METHODS
  // ============================================================================

  getMaxRecords() {
    const limits = {
      user: 100,
      admin: 1000,
      super_admin: 10000
    };
    return limits[this.user?.role] || 100;
  }

  getAllowedFields() {
    const baseFields = ['id', 'name', 'email', 'createdAt', 'updatedAt'];

    if (this.hasRole('admin')) {
      return [...baseFields, 'plan', 'role', 'permissions', 'lastLoginAt'];
    }

    if (this.hasRole('super_admin')) {
      return [...baseFields, 'plan', 'role', 'permissions', 'lastLoginAt', 'metadata', 'stripeCustomerId'];
    }

    return baseFields;
  }

  getDataProjection() {
    return {
      include: this.getAllowedFields(),
      exclude: ['password', 'privateKey', 'sensitiveData'],
      transform: {
        createdAt: (value) => value?.toDate?.() || value,
        updatedAt: (value) => value?.toDate?.() || value,
        lastLoginAt: (value) => value?.toDate?.() || value
      }
    };
  }

  // ============================================================================
  // DATA QUERY METHODS
  // ============================================================================

  // Apply user context filters to database queries
  async applyFilters(query, collection) {
    const filters = await this.getDataFilters();

    // Apply user-specific filters
    if (!filters.canViewAllUsers && collection === 'users') {
      query = query.where('id', '==', this.user?.id);
    }

    if (!filters.canViewAllPlans && collection === 'plans') {
      query = query.where('isActive', '==', true);
    }

    // Apply record limits
    query = query.limit(filters.maxRecords);

    return query;
  }

  // Filter data based on user permissions
  async filterData(data, collection) {
    if (!Array.isArray(data)) {
      return this.filterSingleRecord(data, collection);
    }

    const filters = await this.getDataFilters();
    const projection = filters.dataProjection;

    return data.map(record => this.applyProjection(record, projection));
  }

  filterSingleRecord(record, collection) {
    const filters = this.getDataFilters();
    const projection = filters.dataProjection;

    return this.applyProjection(record, projection);
  }

  applyProjection(record, projection) {
    if (!record) return record;

    const filtered = {};

    // Include allowed fields
    projection.include.forEach(field => {
      if (record[field] !== undefined) {
        filtered[field] = record[field];
      }
    });

    // Exclude sensitive fields
    projection.exclude.forEach(field => {
      delete filtered[field];
    });

    // Apply transformations
    Object.entries(projection.transform).forEach(([field, transformer]) => {
      if (filtered[field]) {
        filtered[field] = transformer(filtered[field]);
      }
    });

    return filtered;
  }

  // ============================================================================
  // AUDIT & LOGGING
  // ============================================================================

  async logDataAccess(action, resource, details = {}) {
    const logEntry = {
      userId: this.user?.id,
      userRole: this.user?.role,
      application: this.application,
      action,
      resource,
      details,
      timestamp: this.timestamp,
      ipAddress: this.request?.ip,
      userAgent: this.request?.get?.('User-Agent'),
      sessionId: this.request?.sessionId
    };

    try {
      await this.db.collection('auditLogs').add(logEntry);
    } catch (error) {
      console.error('Failed to log data access:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Get user-specific limits
  getUserLimits() {
    const baseLimits = {
      free: {
        aiTokens: 50000,
        apiCalls: 500,
        storage: 5368709120, // 5GB
        teamMembers: 1
      },
      pro: {
        aiTokens: 500000,
        apiCalls: 5000,
        storage: 10737418240, // 10GB
        teamMembers: 10
      },
      enterprise: {
        aiTokens: 2000000,
        apiCalls: 50000,
        storage: 107374182400, // 100GB
        teamMembers: 100
      }
    };

    return baseLimits[this.user?.plan] || baseLimits.free;
  }

  // Check if user can perform action
  async canPerformAction(action, resource, context = {}) {
    // Check permissions
    if (!this.hasPermission(action)) {
      return false;
    }

    // Check resource-specific rules
    switch (resource) {
      case 'users':
        return this.checkUserResourceAccess(action, context);
      case 'plans':
        return this.checkPlanResourceAccess(action, context);
      case 'analytics':
        return this.checkAnalyticsResourceAccess(action, context);
      default:
        return true;
    }
  }

  checkUserResourceAccess(action, context) {
    if (action === 'manage_users' && !this.hasRole('admin')) {
      return false;
    }

    // Users can only modify their own data unless they have admin permissions
    if (context.userId && context.userId !== this.user?.id && !this.hasRole('admin')) {
      return false;
    }

    return true;
  }

  checkPlanResourceAccess(action, context) {
    if (action === 'manage_plans' && !this.hasRole('super_admin')) {
      return false;
    }
    return true;
  }

  checkAnalyticsResourceAccess(action, context) {
    if (action === 'view_analytics' && !this.hasRole('admin')) {
      return false;
    }
    return true;
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

// Create data context from request
async function createDataContext(user, application, req) {
  return new DataContext(user, application, req);
}

// Middleware to create data context for requests
function withDataContext(application) {
  return async (req, res, next) => {
    try {
      // Get user from request (this would be set by authentication middleware)
      const user = req.user;

      // Create data context
      req.dataContext = new DataContext(user, application, req);

      // Log access
      await req.dataContext.logDataAccess('api_access', req.path, {
        method: req.method,
        query: req.query,
        body: req.method !== 'GET' ? '[REDACTED]' : undefined
      });

      next();
    } catch (error) {
      console.error('Failed to create data context:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Filter response data based on user context
async function filterResponseData(data, dataContext, collection) {
  if (!dataContext) return data;

  try {
    return await dataContext.filterData(data, collection);
  } catch (error) {
    console.error('Failed to filter response data:', error);
    return data;
  }
}

module.exports = {
  DataContext,
  createDataContext,
  withDataContext,
  filterResponseData
};
