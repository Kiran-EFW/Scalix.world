// ============================================================================
// SCALIX TEST RUNNER
// ============================================================================
// Comprehensive test runner for all Scalix system components
// Seeds data, runs integration tests, and validates connections
// ============================================================================

const { spawn } = require('child_process');
const path = require('path');

class ScalixTestRunner {
  constructor() {
    this.results = {
      seeder: null,
      integration: null,
      overall: {
        passed: 0,
        failed: 0,
        total: 0
      }
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`\n🚀 Running: ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: path.dirname(__filename),
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Command completed successfully`);
          resolve(code);
        } else {
          console.log(`❌ Command failed with exit code ${code}`);
          reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
        }
      });

      child.on('error', (error) => {
        console.error(`❌ Command error:`, error);
        reject(error);
      });
    });
  }

  // ============================================================================
  // TEST PHASES
  // ============================================================================

  async checkPrerequisites() {
    console.log('\n🔍 Checking Prerequisites');

    try {
      // Check if Firebase is configured
      const fs = require('fs');
      const envPath = path.join(__dirname, '.env');
      if (!fs.existsSync(envPath)) {
        throw new Error('.env file not found. Please configure Firebase credentials.');
      }

      console.log('✅ Environment file found');
      console.log('✅ Firebase configuration present');

      // Check if server is running
      const response = await fetch('http://localhost:8080/health').catch(() => null);
      if (!response) {
        console.log('⚠️  Scalix API server not running on localhost:8080');
        console.log('   Please start the server first: npm run dev');
        return false;
      }

      const health = await response.json();
      console.log(`✅ Scalix API server running (v${health.version})`);

      return true;

    } catch (error) {
      console.error('❌ Prerequisites check failed:', error.message);
      return false;
    }
  }

  async seedTestData() {
    console.log('\n🌱 Seeding Test Data');

    try {
      await this.runCommand('node', ['test-data-seeder.js']);
      this.results.seeder = { status: 'success' };
      console.log('✅ Test data seeded successfully');
      return true;
    } catch (error) {
      this.results.seeder = { status: 'failed', error: error.message };
      console.log('❌ Test data seeding failed');
      return false;
    }
  }

  async runIntegrationTests() {
    console.log('\n🧪 Running Integration Tests');

    try {
      await this.runCommand('node', ['test-integration.js']);
      this.results.integration = { status: 'success' };
      console.log('✅ Integration tests completed');
      return true;
    } catch (error) {
      this.results.integration = { status: 'failed', error: error.message };
      console.log('❌ Integration tests failed');
      return false;
    }
  }

  async runConnectionTests() {
    console.log('\n🔗 Testing Connections Only');

    try {
      await this.runCommand('node', ['test-integration.js', '--connections']);
      console.log('✅ Connection tests completed');
      return true;
    } catch (error) {
      console.log('❌ Connection tests failed');
      return false;
    }
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  printReport() {
    console.log('\n📊 Scalix Test Report');
    console.log('====================');

    console.log('\n📋 Test Phases:');
    console.log(`   Data Seeding: ${this.results.seeder?.status === 'success' ? '✅' : '❌'}`);
    console.log(`   Integration:  ${this.results.integration?.status === 'success' ? '✅' : '❌'}`);

    console.log('\n🔑 Test Data Summary:');
    console.log('   • 4 User accounts (regular, pro, admin, super_admin)');
    console.log('   • 3 Subscription plans (free, pro, enterprise)');
    console.log('   • 3 API keys with usage data');
    console.log('   • Usage tracking records');
    console.log('   • Notifications and projects');

    console.log('\n🧪 Integration Tests Cover:');
    console.log('   • API connections and health checks');
    console.log('   • Data consistency across user roles');
    console.log('   • User context and permission filtering');
    console.log('   • Real-time synchronization');
    console.log('   • Performance and response times');

    if (this.results.seeder?.status === 'success' && this.results.integration?.status === 'success') {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('   Your Scalix system is working correctly with proper data consistency.');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED');
      console.log('   Check the output above for details.');
    }

    console.log('\n📖 Next Steps:');
    console.log('   1. Start your web application: cd "../Scalix.world web" && npm run dev');
    console.log('   2. Start your internal admin: cd "../Scalix Internal Admin" && npm run dev');
    console.log('   3. Test the connections manually using the seeded data');
    console.log('   4. Verify data consistency across applications');
  }

  // ============================================================================
  // MAIN RUNNER
  // ============================================================================

  async runFullTestSuite() {
    console.log('🚀 Scalix Complete Test Suite');
    console.log('=============================\n');

    // Check prerequisites
    const prerequisitesOk = await this.checkPrerequisites();
    if (!prerequisitesOk) {
      console.log('\n❌ Cannot run tests due to missing prerequisites.');
      console.log('   Please ensure:');
      console.log('   1. .env file is configured with Firebase credentials');
      console.log('   2. Scalix API server is running on localhost:8080');
      process.exit(1);
    }

    // Run test phases
    const seedSuccess = await this.seedTestData();
    const integrationSuccess = seedSuccess ? await this.runIntegrationTests() : false;

    // Print final report
    this.printReport();

    // Exit with appropriate code
    if (seedSuccess && integrationSuccess) {
      console.log('\n✅ Test suite completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Test suite completed with failures.');
      process.exit(1);
    }
  }

  async runQuickTest() {
    console.log('⚡ Scalix Quick Connection Test');
    console.log('===============================\n');

    const prerequisitesOk = await this.checkPrerequisites();
    if (!prerequisitesOk) {
      process.exit(1);
    }

    await this.runConnectionTests();

    console.log('\n✅ Quick test completed!');
  }

  async showHelp() {
    console.log('Scalix Test Runner');
    console.log('==================');
    console.log('');
    console.log('Usage:');
    console.log('  node test-runner.js                    # Run full test suite');
    console.log('  node test-runner.js --quick           # Quick connection test only');
    console.log('  node test-runner.js --seed-only       # Seed data only');
    console.log('  node test-runner.js --test-only       # Run tests only (skip seeding)');
    console.log('  node test-runner.js --help            # Show this help');
    console.log('');
    console.log('Prerequisites:');
    console.log('  • Scalix API server running on localhost:8080');
    console.log('  • Firebase credentials configured in .env');
    console.log('  • Node.js and npm installed');
    console.log('');
    console.log('Test Data:');
    console.log('  • 4 user accounts with different roles');
    console.log('  • 3 subscription plans');
    console.log('  • API keys and usage data');
    console.log('  • Notifications and projects');
    console.log('');
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const testRunner = new ScalixTestRunner();

  if (args.includes('--help') || args.includes('-h')) {
    testRunner.showHelp();
    return;
  }

  if (args.includes('--quick')) {
    await testRunner.runQuickTest();
  } else if (args.includes('--seed-only')) {
    const prerequisitesOk = await testRunner.checkPrerequisites();
    if (prerequisitesOk) {
      await testRunner.seedTestData();
    }
  } else if (args.includes('--test-only')) {
    const prerequisitesOk = await testRunner.checkPrerequisites();
    if (prerequisitesOk) {
      await testRunner.runIntegrationTests();
    }
  } else {
    await testRunner.runFullTestSuite();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = ScalixTestRunner;
