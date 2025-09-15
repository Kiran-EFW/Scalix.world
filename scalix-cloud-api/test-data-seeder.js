// ============================================================================
// TEST DATA SEEDER
// ============================================================================
// Populates the Scalix Cloud API with dummy data for testing
// connections, data consistency, and user context filtering
// ============================================================================

const admin = require('firebase-admin');

// Test data for different user types
const testUsers = [
  {
    id: 'user_regular_001',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    plan: 'free',
    permissions: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: {
      company: 'Example Corp',
      jobTitle: 'Developer',
      location: 'San Francisco, CA'
    }
  },
  {
    id: 'user_pro_001',
    email: 'pro@example.com',
    name: 'Pro User',
    role: 'user',
    plan: 'pro',
    permissions: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: {
      company: 'Tech Startup',
      jobTitle: 'Senior Developer',
      location: 'New York, NY'
    }
  },
  {
    id: 'admin_team_001',
    email: 'admin@scalix.world',
    name: 'Team Admin',
    role: 'admin',
    plan: 'enterprise',
    permissions: [
      'view_admin_dashboard',
      'view_analytics',
      'view_security',
      'view_api_keys',
      'manage_api_keys',
      'view_team_settings',
      'manage_team_settings'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: {
      company: 'Scalix Inc',
      jobTitle: 'Team Lead',
      location: 'Austin, TX'
    }
  },
  {
    id: 'admin_super_001',
    email: 'superadmin@scalix.world',
    name: 'Super Admin',
    role: 'super_admin',
    plan: 'enterprise',
    permissions: [
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
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: {
      company: 'Scalix Inc',
      jobTitle: 'CTO',
      location: 'San Francisco, CA'
    }
  }
];

const testPlans = [
  {
    id: 'plan_free',
    name: 'free',
    displayName: 'Free Plan',
    description: 'Perfect for getting started with AI development',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: ['basic_ai', 'chat', 'basic_storage'],
    maxAiTokens: 50000,
    maxApiCalls: 500,
    maxStorage: 5368709120, // 5GB
    maxTeamMembers: 1,
    maxProjects: 50,
    maxChats: 500,
    maxMessages: 5000,
    maxFileUploads: 500,
    maxFileSize: 52428800, // 50MB
    requestsPerHour: 500,
    requestsPerDay: 2000,
    tokensPerHour: 25000,
    tokensPerDay: 100000,
    advancedFeatures: false,
    prioritySupport: false,
    isActive: true,
    isPublic: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'plan_pro',
    name: 'pro',
    displayName: 'Pro Plan',
    description: 'Advanced features for growing teams',
    price: 4900, // $49.00
    currency: 'usd',
    interval: 'month',
    features: [
      'advanced_ai_models',
      'team_collaboration',
      'priority_support',
      'unlimited_projects',
      'advanced_context',
      'api_access',
      'webhooks'
    ],
    maxAiTokens: 500000,
    maxApiCalls: 5000,
    maxStorage: 10737418240, // 10GB
    maxTeamMembers: 10,
    maxProjects: 1000,
    maxChats: 5000,
    maxMessages: 50000,
    maxFileUploads: 5000,
    maxFileSize: 104857600, // 100MB
    requestsPerHour: 5000,
    requestsPerDay: 20000,
    tokensPerHour: 250000,
    tokensPerDay: 1000000,
    advancedFeatures: true,
    prioritySupport: true,
    isActive: true,
    isPublic: true,
    popular: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    id: 'plan_enterprise',
    name: 'enterprise',
    displayName: 'Enterprise Plan',
    description: 'Complete solution for large organizations',
    price: 19900, // $199.00
    currency: 'usd',
    interval: 'month',
    features: [
      'advanced_ai_models',
      'team_collaboration',
      'priority_support',
      'unlimited_projects',
      'advanced_context',
      'api_access',
      'webhooks',
      'enterprise_sso',
      'advanced_analytics',
      'custom_models',
      'dedicated_support',
      'sla_guarantee'
    ],
    maxAiTokens: 2000000,
    maxApiCalls: 50000,
    maxStorage: 107374182400, // 100GB
    maxTeamMembers: 100,
    maxProjects: -1, // unlimited
    maxChats: -1, // unlimited
    maxMessages: -1, // unlimited
    maxFileUploads: -1, // unlimited
    maxFileSize: 536870912, // 512MB
    requestsPerHour: 50000,
    requestsPerDay: 200000,
    tokensPerHour: 1000000,
    tokensPerDay: 5000000,
    advancedFeatures: true,
    prioritySupport: true,
    isActive: true,
    isPublic: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

const testApiKeys = [
  {
    id: 'api_key_regular',
    key: 'scalix_test_regular_' + generateRandomString(32),
    userId: 'user_regular_001',
    email: 'user@example.com',
    plan: 'free',
    isActive: true,
    features: ['basic_ai', 'chat', 'basic_storage'],
    name: 'Development API Key',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null,
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    usage: {
      totalRequests: 1250,
      totalTokens: 45600,
      requestsToday: 45,
      tokensToday: 1200
    }
  },
  {
    id: 'api_key_pro',
    key: 'scalix_test_pro_' + generateRandomString(32),
    userId: 'user_pro_001',
    email: 'pro@example.com',
    plan: 'pro',
    isActive: true,
    features: [
      'advanced_ai_models',
      'team_collaboration',
      'priority_support',
      'unlimited_projects',
      'advanced_context',
      'api_access'
    ],
    name: 'Production API Key',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null,
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    usage: {
      totalRequests: 15600,
      totalTokens: 890000,
      requestsToday: 234,
      tokensToday: 15600
    }
  },
  {
    id: 'api_key_admin',
    key: 'scalix_test_admin_' + generateRandomString(32),
    userId: 'admin_team_001',
    email: 'admin@scalix.world',
    plan: 'enterprise',
    isActive: true,
    features: [
      'advanced_ai_models',
      'team_collaboration',
      'priority_support',
      'unlimited_projects',
      'advanced_context',
      'api_access',
      'admin_features'
    ],
    name: 'Admin API Key',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null,
    lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    usage: {
      totalRequests: 45600,
      totalTokens: 2340000,
      requestsToday: 1200,
      tokensToday: 45600
    }
  }
];

const testUsage = [
  {
    id: 'usage_regular_001',
    userId: 'user_regular_001',
    apiKeyId: 'api_key_regular',
    metric: 'ai_tokens',
    amount: 1200,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    period: 'day',
    periodStart: getPeriodStart(new Date(), 'day'),
    metadata: {
      model: 'gpt-3.5-turbo',
      endpoint: '/api/chat/completions',
      tokens_prompt: 200,
      tokens_completion: 1000
    }
  },
  {
    id: 'usage_pro_001',
    userId: 'user_pro_001',
    apiKeyId: 'api_key_pro',
    metric: 'api_calls',
    amount: 45,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    period: 'day',
    periodStart: getPeriodStart(new Date(), 'day'),
    metadata: {
      endpoint: '/api/chat/completions',
      status_code: 200,
      response_time: 1200
    }
  },
  {
    id: 'usage_admin_001',
    userId: 'admin_team_001',
    apiKeyId: 'api_key_admin',
    metric: 'ai_tokens',
    amount: 15600,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    period: 'day',
    periodStart: getPeriodStart(new Date(), 'day'),
    metadata: {
      model: 'gpt-4',
      endpoint: '/api/chat/completions',
      tokens_prompt: 1200,
      tokens_completion: 14400
    }
  }
];

const testNotifications = [
  {
    id: 'notification_regular_001',
    userId: 'user_regular_001',
    type: 'info',
    title: 'Welcome to Scalix!',
    message: 'Your account has been successfully created. Start exploring our AI features.',
    priority: 'low',
    category: 'account',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null
  },
  {
    id: 'notification_pro_001',
    userId: 'user_pro_001',
    type: 'success',
    title: 'Pro Plan Activated',
    message: 'Welcome to Scalix Pro! You now have access to advanced AI models and team collaboration features.',
    priority: 'medium',
    category: 'billing',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null,
    actions: [
      {
        id: 'explore_features',
        label: 'Explore Features',
        type: 'primary',
        url: '/features'
      }
    ]
  },
  {
    id: 'notification_admin_001',
    userId: 'admin_team_001',
    type: 'warning',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM PST. Some services may be temporarily unavailable.',
    priority: 'high',
    category: 'system',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: null
  }
];

const testProjects = [
  {
    id: 'project_regular_001',
    userId: 'user_regular_001',
    name: 'My First AI App',
    description: 'A simple chatbot application for customer support',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
    settings: {
      framework: 'nextjs',
      language: 'typescript',
      database: 'firestore',
      aiModels: ['gpt-3.5-turbo'],
      contextPaths: ['/api/chat', '/api/prompts']
    }
  },
  {
    id: 'project_pro_001',
    userId: 'user_pro_001',
    name: 'Team Collaboration Platform',
    description: 'Advanced platform for team collaboration with AI assistance',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
    settings: {
      framework: 'react',
      language: 'typescript',
      database: 'postgresql',
      aiModels: ['gpt-4', 'claude-2'],
      contextPaths: ['/api/chat', '/api/documents', '/api/analytics']
    }
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getPeriodStart(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'month':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;
    case 'day':
      d.setHours(0, 0, 0, 0);
      break;
    case 'hour':
      d.setMinutes(0, 0, 0);
      break;
  }
  return d;
}

// ============================================================================
// SEEDER FUNCTIONS
// ============================================================================

async function seedUsers() {
  console.log('🌱 Seeding users...');
  const batch = admin.firestore().batch();

  testUsers.forEach(user => {
    const userRef = admin.firestore().collection('users').doc(user.id);
    batch.set(userRef, user);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testUsers.length} users`);
}

async function seedPlans() {
  console.log('🌱 Seeding plans...');
  const batch = admin.firestore().batch();

  testPlans.forEach(plan => {
    const planRef = admin.firestore().collection('plans').doc(plan.id);
    batch.set(planRef, plan);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testPlans.length} plans`);
}

async function seedApiKeys() {
  console.log('🌱 Seeding API keys...');
  const batch = admin.firestore().batch();

  testApiKeys.forEach(apiKey => {
    const keyRef = admin.firestore().collection('apiKeys').doc(apiKey.id);
    batch.set(keyRef, apiKey);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testApiKeys.length} API keys`);
}

async function seedUsage() {
  console.log('🌱 Seeding usage data...');
  const batch = admin.firestore().batch();

  testUsage.forEach(usage => {
    const usageRef = admin.firestore().collection('usage').doc(usage.id);
    batch.set(usageRef, usage);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testUsage.length} usage records`);
}

async function seedNotifications() {
  console.log('🌱 Seeding notifications...');
  const batch = admin.firestore().batch();

  testNotifications.forEach(notification => {
    const notificationRef = admin.firestore().collection('notifications').doc(notification.id);
    batch.set(notificationRef, notification);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testNotifications.length} notifications`);
}

async function seedProjects() {
  console.log('🌱 Seeding projects...');
  const batch = admin.firestore().batch();

  testProjects.forEach(project => {
    const projectRef = admin.firestore().collection('projects').doc(project.id);
    batch.set(projectRef, project);
  });

  await batch.commit();
  console.log(`✅ Seeded ${testProjects.length} projects`);
}

async function clearAllData() {
  console.log('🗑️  Clearing existing data...');

  const collections = ['users', 'plans', 'apiKeys', 'usage', 'notifications', 'projects'];

  for (const collection of collections) {
    const snapshot = await admin.firestore().collection(collection).get();
    const batch = admin.firestore().batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`   Cleared ${snapshot.size} documents from ${collection}`);
  }

  console.log('✅ All data cleared');
}

// ============================================================================
// MAIN SEEDER FUNCTION
// ============================================================================

async function seedAllData() {
  try {
    console.log('🚀 Starting test data seeding...\n');

    // Clear existing data first
    await clearAllData();
    console.log('');

    // Seed new data
    await seedUsers();
    await seedPlans();
    await seedApiKeys();
    await seedUsage();
    await seedNotifications();
    await seedProjects();

    console.log('\n🎉 Test data seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   • ${testUsers.length} Users (regular, pro, admin, super_admin)`);
    console.log(`   • ${testPlans.length} Plans (free, pro, enterprise)`);
    console.log(`   • ${testApiKeys.length} API Keys (with usage data)`);
    console.log(`   • ${testUsage.length} Usage Records`);
    console.log(`   • ${testNotifications.length} Notifications`);
    console.log(`   • ${testProjects.length} Projects`);
    console.log('\n🔑 Test API Keys:');
    testApiKeys.forEach(key => {
      console.log(`   • ${key.email}: ${key.key}`);
    });

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

module.exports = {
  seedAllData,
  seedUsers,
  seedPlans,
  seedApiKeys,
  seedUsage,
  seedNotifications,
  seedProjects,
  clearAllData,
  testUsers,
  testPlans,
  testApiKeys,
  testUsage,
  testNotifications,
  testProjects
};

// ============================================================================
// CLI INTERFACE
// ============================================================================

if (require.main === module) {
  console.log('🔧 Scalix Test Data Seeder');
  console.log('==========================\n');

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  node test-data-seeder.js              # Seed all test data');
    console.log('  node test-data-seeder.js --clear      # Clear all data');
    console.log('  node test-data-seeder.js --users      # Seed only users');
    console.log('  node test-data-seeder.js --plans      # Seed only plans');
    console.log('  node test-data-seeder.js --help       # Show this help\n');
    process.exit(0);
  }

  if (args.includes('--clear')) {
    clearAllData().then(() => process.exit(0));
  } else if (args.includes('--users')) {
    seedUsers().then(() => process.exit(0));
  } else if (args.includes('--plans')) {
    seedPlans().then(() => process.exit(0));
  } else {
    seedAllData().then(() => process.exit(0));
  }
}
