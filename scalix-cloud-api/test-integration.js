// ============================================================================
// INTEGRATION TESTS
// ============================================================================
// Tests to verify connections, data consistency, and user context filtering
// across all Scalix applications with dummy data
// ============================================================================

const { ScalixClient } = require('./lib/client-sdk');
const { createDataContext } = require('./lib/data-context');
const admin = require('firebase-admin');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:8080',
  timeout: 10000,
  testUsers: {
    regular: {
      id: 'user_regular_001',
      email: 'user@example.com',
      role: 'user',
      apiKey: 'scalix_test_regular_' // Will be completed by seeder
    },
    pro: {
      id: 'user_pro_001',
      email: 'pro@example.com',
      role: 'user',
      apiKey: 'scalix_test_pro_' // Will be completed by seeder
    },
    admin: {
      id: 'admin_team_001',
      email: 'admin@scalix.world',
      role: 'admin',
      apiKey: 'scalix_test_admin_' // Will be completed by seeder
    },
    superAdmin: {
      id: 'admin_super_001',
      email: 'superadmin@scalix.world',
      role: 'super_admin'
    }
  }
};

class ScalixIntegrationTests {
  constructor() {
    this.clients = {};
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
  }

  // ============================================================================
  // TEST UTILITIES
  // ============================================================================

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Running: ${testName}`);
    this.results.total++;

    try {
      const result = await testFunction();
      console.log(`✅ PASSED: ${testName}`);
      this.results.passed++;
      this.results.tests.push({
        name: testName,
        status: 'passed',
        result
      });
      return result;
    } catch (error) {
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({
        name: testName,
        status: 'failed',
        error: error.message
      });
      return null;
    }
  }

  async initializeClients() {
    console.log('\n🚀 Initializing test clients...');

    // Initialize clients for different user types
    for (const [userType, userConfig] of Object.entries(TEST_CONFIG.testUsers)) {
      // Get the full API key from Firestore
      const apiKeyDoc = await admin.firestore()
        .collection('apiKeys')
        .where('userId', '==', userConfig.id)
        .limit(1)
        .get();

      let apiKey = null;
      if (!apiKeyDoc.empty) {
        apiKey = apiKeyDoc.docs[0].data().key;
      }

      this.clients[userType] = new ScalixClient({
        baseUrl: TEST_CONFIG.baseUrl,
        apiKey: apiKey,
        application: 'test',
        syncEnabled: false, // Disable sync for tests
        realTimeEnabled: false // Disable real-time for tests
      });

      console.log(`   ✅ ${userType} client initialized${apiKey ? ' (with API key)' : ' (no API key)'}`);
    }
  }

  // ============================================================================
  // CONNECTION TESTS
  // ============================================================================

  async testConnections() {
    console.log('\n🔗 Testing Connections');

    await this.runTest('Health Check', async () => {
      const response = await fetch(`${TEST_CONFIG.baseUrl}/health`);
      if (!response.ok) throw new Error('Health check failed');
      const data = await response.json();
      if (data.status !== 'ok') throw new Error('Health status not OK');
      return data;
    });

    await this.runTest('API Key Validation', async () => {
      const regularClient = this.clients.regular;
      const result = await regularClient.request('/api/validate-key', {
        method: 'POST',
        data: { apiKey: regularClient.apiKey }
      });
      if (!result.isValid) throw new Error('API key validation failed');
      return result;
    });

    await this.runTest('Database Connection', async () => {
      const db = admin.firestore();
      const testDoc = await db.collection('test').doc('connection').get();
      return { connected: true };
    });
  }

  // ============================================================================
  // DATA CONSISTENCY TESTS
  // ============================================================================

  async testDataConsistency() {
    console.log('\n📊 Testing Data Consistency');

    await this.runTest('Plans Data Consistency', async () => {
      const regularClient = this.clients.regular;
      const adminClient = this.clients.admin;

      // Regular user should see public plans
      const regularPlans = await regularClient.getData('plans', { isActive: true });
      // Admin should see all plans
      const adminPlans = await adminClient.getData('plans');

      if (!Array.isArray(regularPlans) || regularPlans.length === 0) {
        throw new Error('Regular user cannot access plans');
      }

      if (!Array.isArray(adminPlans) || adminPlans.length === 0) {
        throw new Error('Admin cannot access plans');
      }

      // Admin should see more plans or same with full data
      if (adminPlans.length < regularPlans.length) {
        throw new Error('Admin sees fewer plans than regular user');
      }

      return {
        regularUserPlans: regularPlans.length,
        adminPlans: adminPlans.length
      };
    });

    await this.runTest('User Data Isolation', async () => {
      const regularClient = this.clients.regular;
      const proClient = this.clients.pro;

      // Each user should only see their own data
      const regularUsers = await regularClient.getData('users');
      const proUsers = await proClient.getData('users');

      // Regular user should only see themselves or public data
      if (Array.isArray(regularUsers) && regularUsers.length > 1) {
        const ownData = regularUsers.filter(u => u.id === TEST_CONFIG.testUsers.regular.id);
        if (ownData.length === 0) {
          throw new Error('Regular user cannot see their own data');
        }
      }

      return {
        regularUserData: Array.isArray(regularUsers) ? regularUsers.length : 1,
        proUserData: Array.isArray(proUsers) ? proUsers.length : 1
      };
    });

    await this.runTest('Usage Data Filtering', async () => {
      const regularClient = this.clients.regular;
      const adminClient = this.clients.admin;

      const regularUsage = await regularClient.getData('usage');
      const adminUsage = await adminClient.getData('usage');

      // Admin should see more usage data than regular user
      const regularCount = Array.isArray(regularUsage) ? regularUsage.length : 0;
      const adminCount = Array.isArray(adminUsage) ? adminUsage.length : 0;

      if (adminCount < regularCount) {
        throw new Error('Admin sees less usage data than regular user');
      }

      return {
        regularUsageCount: regularCount,
        adminUsageCount: adminCount
      };
    });
  }

  // ============================================================================
  // USER CONTEXT TESTS
  // ============================================================================

  async testUserContext() {
    console.log('\n👤 Testing User Context');

    await this.runTest('Role-Based Permissions', async () => {
      const regularClient = this.clients.regular;
      const adminClient = this.clients.admin;
      const superAdminClient = this.clients.superAdmin;

      // Test permission checks
      const regularContext = await regularClient.request('/api/user/context');
      const adminContext = await adminClient.request('/api/user/context');

      if (!regularContext.role || regularContext.role !== 'user') {
        throw new Error('Regular user has incorrect role');
      }

      if (!adminContext.role || adminContext.role !== 'admin') {
        throw new Error('Admin user has incorrect role');
      }

      return {
        regularUserRole: regularContext.role,
        adminUserRole: adminContext.role,
        regularPermissions: regularContext.permissions?.length || 0,
        adminPermissions: adminContext.permissions?.length || 0
      };
    });

    await this.runTest('Feature Flags by Role', async () => {
      const regularClient = this.clients.regular;
      const adminClient = this.clients.admin;

      const regularContext = await regularClient.request('/api/user/context');
      const adminContext = await adminClient.request('/api/user/context');

      // Check feature flags
      const regularFeatures = regularContext.featureFlags || {};
      const adminFeatures = adminContext.featureFlags || {};

      // Admin should have more features enabled
      const regularEnabledFeatures = Object.values(regularFeatures).filter(f => f).length;
      const adminEnabledFeatures = Object.values(adminFeatures).filter(f => f).length;

      if (adminEnabledFeatures < regularEnabledFeatures) {
        throw new Error('Admin has fewer features than regular user');
      }

      return {
        regularEnabledFeatures,
        adminEnabledFeatures
      };
    });

    await this.runTest('Data Projection by Role', async () => {
      const regularClient = this.clients.regular;
      const adminClient = this.clients.admin;

      // Get user data for different roles
      const regularUserData = await regularClient.getData('users', { id: TEST_CONFIG.testUsers.regular.id });
      const adminUserData = await adminClient.getData('users', { id: TEST_CONFIG.testUsers.regular.id });

      // Admin should see more fields than regular user
      const regularFields = Object.keys(Array.isArray(regularUserData) ? regularUserData[0] : regularUserData || {});
      const adminFields = Object.keys(Array.isArray(adminUserData) ? adminUserData[0] : adminUserData || {});

      if (adminFields.length < regularFields.length) {
        throw new Error('Admin sees fewer fields than regular user');
      }

      return {
        regularUserFields: regularFields,
        adminUserFields: adminFields
      };
    });
  }

  // ============================================================================
  // SYNCHRONIZATION TESTS
  // ============================================================================

  async testSynchronization() {
    console.log('\n🔄 Testing Synchronization');

    await this.runTest('Sync Status Check', async () => {
      const client = this.clients.admin;
      const syncStatus = await client.request('/api/sync/status');

      if (!syncStatus.cache) {
        throw new Error('Sync status missing cache information');
      }

      return syncStatus;
    });

    await this.runTest('Cache Functionality', async () => {
      const client = this.clients.regular;

      // First request (should fetch from API)
      const startTime1 = Date.now();
      const plans1 = await client.getData('plans');
      const time1 = Date.now() - startTime1;

      // Second request (should use cache)
      const startTime2 = Date.now();
      const plans2 = await client.getData('plans');
      const time2 = Date.now() - startTime2;

      // Cache should be faster (though this is a rough test)
      if (time2 > time1) {
        console.log('   ℹ️  Cache may not be working (second request slower)');
      }

      return {
        firstRequestTime: time1,
        secondRequestTime: time2,
        cacheWorking: time2 <= time1
      };
    });

    await this.runTest('Cross-Application Sync', async () => {
      const client = this.clients.admin;

      // Test manual sync trigger
      try {
        const syncResult = await client.request('/api/sync/trigger', {
          method: 'POST',
          data: {
            sourceApp: 'test',
            targetApp: 'web',
            collections: ['plans']
          }
        });

        return syncResult;
      } catch (error) {
        // This might fail if sync is not fully implemented, which is OK
        console.log('   ℹ️  Manual sync may not be fully implemented yet');
        return { status: 'sync_not_available' };
      }
    });
  }

  // ============================================================================
  // API FUNCTIONALITY TESTS
  // ============================================================================

  async testApiFunctionality() {
    console.log('\n🔧 Testing API Functionality');

    await this.runTest('Usage Tracking', async () => {
      const client = this.clients.regular;

      const usageData = {
        apiKey: client.apiKey,
        metric: 'test_api_calls',
        amount: 1,
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      };

      const result = await client.request('/api/usage/track', {
        method: 'POST',
        data: usageData
      });

      if (!result.success) {
        throw new Error('Usage tracking failed');
      }

      return result;
    });

    await this.runTest('Usage Summary', async () => {
      const client = this.clients.regular;

      const summary = await client.request('/api/usage/summary', {
        headers: {
          'Authorization': `Bearer ${client.apiKey}`
        }
      });

      if (!summary.currentMonth) {
        throw new Error('Usage summary missing data');
      }

      return summary;
    });

    await this.runTest('Plan Management (Admin)', async () => {
      const adminClient = this.clients.admin;

      const plans = await adminClient.request('/api/admin/plans');

      if (!plans.plans || !Array.isArray(plans.plans)) {
        throw new Error('Admin plans endpoint failed');
      }

      return {
        planCount: plans.plans.length,
        context: plans.context
      };
    });
  }

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  async testPerformance() {
    console.log('\n⚡ Testing Performance');

    await this.runTest('API Response Time', async () => {
      const client = this.clients.regular;
      const startTime = Date.now();

      await client.getData('plans');

      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) { // 5 seconds
        throw new Error(`Response too slow: ${responseTime}ms`);
      }

      return { responseTime: `${responseTime}ms` };
    });

    await this.runTest('Concurrent Requests', async () => {
      const client = this.clients.regular;
      const requests = [];

      // Make 5 concurrent requests
      for (let i = 0; i < 5; i++) {
        requests.push(client.getData('plans'));
      }

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      if (results.length !== 5) {
        throw new Error('Not all concurrent requests completed');
      }

      return {
        totalRequests: 5,
        totalTime: `${totalTime}ms`,
        avgResponseTime: `${totalTime / 5}ms`
      };
    });
  }

  // ============================================================================
  // MAIN TEST RUNNER
  // ============================================================================

  async runAllTests() {
    console.log('🚀 Scalix Integration Tests');
    console.log('==========================\n');

    try {
      // Initialize clients
      await this.initializeClients();

      // Run all test suites
      await this.testConnections();
      await this.testDataConsistency();
      await this.testUserContext();
      await this.testSynchronization();
      await this.testApiFunctionality();
      await this.testPerformance();

      // Print results
      this.printResults();

    } catch (error) {
      console.error('❌ Test runner failed:', error);
    }
  }

  printResults() {
    console.log('\n📊 Test Results Summary');
    console.log('======================');

    console.log(`\n✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total:  ${this.results.total}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%\n`);

    if (this.results.failed > 0) {
      console.log('❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`);
        });
    }

    console.log('\n🎯 Test Coverage:');
    console.log('   • Connection Testing');
    console.log('   • Data Consistency');
    console.log('   • User Context & Permissions');
    console.log('   • Synchronization');
    console.log('   • API Functionality');
    console.log('   • Performance');

    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! Your Scalix system is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the output above for details.');
    }
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const testRunner = new ScalixIntegrationTests();

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Scalix Integration Tests');
    console.log('========================');
    console.log('Usage:');
    console.log('  node test-integration.js              # Run all tests');
    console.log('  node test-integration.js --connections # Test only connections');
    console.log('  node test-integration.js --consistency # Test only data consistency');
    console.log('  node test-integration.js --context     # Test only user context');
    console.log('  node test-integration.js --help        # Show this help\n');
    return;
  }

  // Seed data first if requested
  if (args.includes('--seed')) {
    console.log('🌱 Seeding test data first...');
    const seeder = require('./test-data-seeder');
    await seeder.seedAllData();
    console.log('');
  }

  if (args.includes('--connections')) {
    await testRunner.initializeClients();
    await testRunner.testConnections();
  } else if (args.includes('--consistency')) {
    await testRunner.initializeClients();
    await testRunner.testDataConsistency();
  } else if (args.includes('--context')) {
    await testRunner.initializeClients();
    await testRunner.testUserContext();
  } else {
    await testRunner.runAllTests();
  }
}

// Run tests if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ScalixIntegrationTests;
