const { chromium } = require('playwright');

async function runQuickScalixTest() {
  console.log('🚀 Quick Scalix System Test');
  console.log('===========================');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  try {
    // ==========================================
    // 1. TEST WEB APPLICATION
    // ==========================================
    console.log('\n🌐 Testing Web Application...');

    const webPage = await context.newPage();
    await webPage.goto('http://localhost:3001');

    // Wait for page to load
    await webPage.waitForLoadState('networkidle');
    console.log('✅ Web App loaded successfully');

    // Check branding
    const hasScalix = await webPage.locator('text=Scalix').count() > 0;
    console.log(`🎨 Scalix Branding: ${hasScalix ? '✅ Present' : '❌ Missing'}`);

    // Screenshot
    await webPage.screenshot({ path: 'test-results/quick-web.png' });
    console.log('📸 Screenshot: quick-web.png');

    // ==========================================
    // 2. TEST INTERNAL ADMIN
    // ==========================================
    console.log('\n⚙️ Testing Internal Admin...');

    const adminPage = await context.newPage();
    await adminPage.goto('http://localhost:3003');

    // Wait for admin page to load
    await adminPage.waitForLoadState('networkidle');
    console.log('✅ Admin App loaded successfully');

    // Check branding
    const hasAdminScalix = await adminPage.locator('text=Scalix').count() > 0;
    console.log(`🎨 Admin Branding: ${hasAdminScalix ? '✅ Present' : '❌ Missing'}`);

    // Check main navigation items exist
    const navItems = ['Dashboard', 'Metrics', 'Team Management', 'Settings'];
    for (const item of navItems) {
      const exists = await adminPage.locator(`text=${item}`).count() > 0;
      console.log(`📋 Nav Item "${item}": ${exists ? '✅ Found' : '❌ Missing'}`);
    }

    // Screenshot
    await adminPage.screenshot({ path: 'test-results/quick-admin.png' });
    console.log('📸 Screenshot: quick-admin.png');

    // ==========================================
    // 3. TEST FIREBASE EMULATOR
    // ==========================================
    console.log('\n🔥 Testing Firebase Emulator...');

    const firebasePage = await context.newPage();
    await firebasePage.goto('http://127.0.0.1:4000');

    await firebasePage.waitForLoadState('networkidle');
    console.log('✅ Firebase Emulator loaded');

    const hasFirebase = await firebasePage.locator('text=Firebase').count() > 0;
    console.log(`🔥 Firebase UI: ${hasFirebase ? '✅ Working' : '❌ Not working'}`);

    // Screenshot
    await firebasePage.screenshot({ path: 'test-results/quick-firebase.png' });
    console.log('📸 Screenshot: quick-firebase.png');

    // ==========================================
    // 4. TEST API HEALTH
    // ==========================================
    console.log('\n🌐 Testing API Health...');

    // Test API health endpoint
    const apiResponse = await fetch('http://localhost:8080/health');
    const apiData = await apiResponse.json();

    if (apiData.status === 'ok') {
      console.log('✅ Cloud API: Healthy');
      console.log(`📊 Version: ${apiData.version}`);
    } else {
      console.log('❌ Cloud API: Unhealthy');
    }

    // ==========================================
    // 5. FINAL STATUS
    // ==========================================
    console.log('\n🎉 Quick Test Complete!');
    console.log('======================');

    const allTests = [
      { name: 'Web App', status: hasScalix },
      { name: 'Admin App', status: hasAdminScalix },
      { name: 'Firebase Emulator', status: hasFirebase },
      { name: 'Cloud API', status: apiData?.status === 'ok' }
    ];

    console.log('\n📋 Test Results:');
    allTests.forEach(test => {
      console.log(`   ${test.status ? '✅' : '❌'} ${test.name}`);
    });

    const passedCount = allTests.filter(t => t.status).length;
    console.log(`\n📊 Score: ${passedCount}/${allTests.length} tests passed`);

    if (passedCount === allTests.length) {
      console.log('\n🎯 RESULT: Your Scalix system is FULLY OPERATIONAL! 🚀');
      console.log('\n🔗 Access Points:');
      console.log('   🌐 Web App: http://localhost:3001');
      console.log('   ⚙️ Admin: http://localhost:3003');
      console.log('   🔥 Firebase: http://127.0.0.1:4000');
      console.log('   🌐 API: http://localhost:8080');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Create test-results directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('test-results')) {
  fs.mkdirSync('test-results');
}

// Run the test
runQuickScalixTest();
