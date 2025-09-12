const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.GCP_PROJECT_ID
});

const db = admin.firestore();

async function initializeDatabase() {
  console.log('🚀 Initializing Scalix Cloud Database...');

  try {
    // Create default plans
    console.log('📋 Creating subscription plans...');
    const plansRef = db.collection('plans');

    const plans = [
      {
        id: 'free',
        name: 'free',
        displayName: 'Free',
        price: 0, // Price in cents
        currency: 'usd',
        // Generous limits for user acquisition
        maxAiTokens: 50000,      // 50K tokens (5x original)
        maxApiCalls: 500,        // 500 calls (5x original)
        maxStorage: 5368709120,  // 5GB (5x original)
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
        features: ['basic_ai', 'basic_chat', 'basic_storage'],
        description: 'Perfect for getting started with AI development',
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        id: 'pro',
        name: 'pro',
        displayName: 'Pro',
        price: 2999, // $29.99 in cents
        currency: 'usd',
        // Pro limits (can be adjusted for monetization)
        maxAiTokens: 200000,
        maxApiCalls: 1000,
        maxStorage: 10737418240, // 10GB
        maxTeamMembers: 5,
        maxProjects: 1000, // Unlimited projects
        maxChats: 5000,
        maxMessages: 50000,
        maxFileUploads: 5000,
        maxFileSize: 104857600, // 100MB
        requestsPerHour: 5000,
        requestsPerDay: 20000,
        tokensPerHour: 100000,
        tokensPerDay: 500000,
        advancedFeatures: true,
        prioritySupport: true,
        features: ['advanced_ai_models', 'team_collaboration', 'priority_support', 'unlimited_projects', 'advanced_context', 'turbo_edits'],
        description: 'For serious developers and small teams',
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        id: 'enterprise',
        name: 'enterprise',
        displayName: 'Enterprise',
        price: 9999, // $99.99 in cents
        currency: 'usd',
        // Enterprise limits (can be customized per customer)
        maxAiTokens: 1000000,
        maxApiCalls: 10000,
        maxStorage: 107374182400, // 100GB
        maxTeamMembers: 100, // Can be unlimited
        maxProjects: 10000, // Practically unlimited
        maxChats: 50000,
        maxMessages: 500000,
        maxFileUploads: 50000,
        maxFileSize: 536870912, // 512MB
        requestsPerHour: 50000,
        requestsPerDay: 200000,
        tokensPerHour: 500000,
        tokensPerDay: 2000000,
        advancedFeatures: true,
        prioritySupport: true,
        features: ['enterprise_ai_models', 'unlimited_team', 'dedicated_support', 'custom_integrations', 'sso_saml', 'audit_logs', 'advanced_security'],
        description: 'For large teams and organizations with advanced needs',
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
    ];

    // Use batch write for efficiency
    const batch = db.batch();

    for (const plan of plans) {
      const docRef = plansRef.doc(plan.id);
      batch.set(docRef, plan);
    }

    await batch.commit();
    console.log('✅ Plans created successfully');

    // Create indexes (Firestore handles this automatically, but document it)
    console.log('📊 Firestore indexes will be created automatically on first query');
    console.log('   - apiKeys: key (equality)');
    console.log('   - usageAggregates: apiKeyId, period, periodStart (composite)');

    // Create sample API key for testing (optional)
    if (process.env.CREATE_SAMPLE_KEY === 'true') {
      console.log('🔑 Creating sample API key for testing...');

      const sampleKey = {
        key: 'scalix_test_' + Date.now(),
        plan: 'free',
        isActive: true,
        features: ['basic_ai', 'chat'],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: null, // No expiration
        description: 'Sample API key for testing'
      };

      await db.collection('apiKeys').add(sampleKey);
      console.log('✅ Sample API key created:', sampleKey.key);
    }

    console.log('🎉 Database initialization complete!');
    console.log('💰 Cost-optimized with Firestore (no dedicated database costs)');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Initialization failed:', error);
  process.exit(1);
});
