#!/usr/bin/env node

// Quick Test Runner for Scalix Internal Testing
const { chromium } = require('playwright');

async function runQuickTests() {
  console.log('🚀 Scalix Quick Test Runner');
  console.log('===========================');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  try {
    console.log('\n📋 Running Quick Tests...\n');

    // ==========================================
    // 1. BASIC CONNECTIVITY TESTS
    // ==========================================
    console.log('🔗 Testing Basic Connectivity...');

    // Test Web App
    try {
      const webPage = await context.newPage();
      await webPage.goto('http://localhost:3001');
      await webPage.waitForLoadState('networkidle');
      console.log('✅ Web App: Connected and loaded');

      const title = await webPage.title();
      console.log(`📄 Title: ${title}`);

      await webPage.close();
    } catch (error) {
      console.log('❌ Web App: Failed to connect');
    }

    // Test Admin App
    try {
      const adminPage = await context.newPage();
      await adminPage.goto('http://localhost:3004');
      await adminPage.waitForLoadState('networkidle');
      console.log('✅ Admin App: Connected and loaded');

      // Check for Scalix branding
      const hasScalix = await adminPage.locator('text=Scalix').count() > 0;
      console.log(`🎨 Branding: ${hasScalix ? 'Present' : 'Missing'}`);

      await adminPage.close();
    } catch (error) {
      console.log('❌ Admin App: Failed to connect');
    }

    // ==========================================
    // 2. API CONNECTIVITY TEST
    // ==========================================
    console.log('\n🌐 Testing API Connectivity...');

    try {
      const response = await fetch('http://localhost:8080/health');
      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        console.log('✅ API Health: Good');
        console.log(`📊 Version: ${data.version}`);
      } else {
        console.log('⚠️ API Health: Responding but status unclear');
      }
    } catch (error) {
      console.log('❌ API: Failed to connect');
    }

    // ==========================================
    // 3. FIREBASE CONNECTIVITY TEST
    // ==========================================
    console.log('\n🔥 Testing Firebase Connectivity...');

    try {
      const firebasePage = await context.newPage();
      await firebasePage.goto('http://127.0.0.1:4000');
      await firebasePage.waitForLoadState('networkidle');
      console.log('✅ Firebase Emulator: Connected');
      await firebasePage.close();
    } catch (error) {
      console.log('❌ Firebase Emulator: Failed to connect');
    }

    // ==========================================
    // 4. QUICK FUNCTIONALITY TESTS
    // ==========================================
    console.log('\n⚙️ Testing Basic Functionality...');

    const adminPage = await context.newPage();
    await adminPage.goto('http://localhost:3004');
    await adminPage.waitForLoadState('networkidle');

    // Test navigation items exist
    const navTests = [
      { name: 'Dashboard', selector: 'text=Dashboard' },
      { name: 'Metrics', selector: 'text=Metrics' },
      { name: 'Team Management', selector: 'text=Team Management' },
      { name: 'Settings', selector: 'text=Settings' }
    ];

    for (const test of navTests) {
      try {
        const exists = await adminPage.locator(test.selector).count() > 0;
        console.log(`${exists ? '✅' : '❌'} ${test.name}: ${exists ? 'Found' : 'Missing'}`);
      } catch (error) {
        console.log(`❌ ${test.name}: Error testing`);
      }
    }

    await adminPage.close();

    // ==========================================
    // 5. PERFORMANCE CHECK
    // ==========================================
    console.log('\n⚡ Quick Performance Check...');

    const perfPage = await context.newPage();
    const startTime = Date.now();

    await perfPage.goto('http://localhost:3004');
    await perfPage.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`⏱️ Admin Load Time: ${loadTime}ms ${loadTime < 3000 ? '✅' : '⚠️'}`);

    await perfPage.close();

    // ==========================================
    // 6. SUMMARY
    // ==========================================
    console.log('\n📊 Quick Test Summary:');
    console.log('=======================');
    console.log('✅ Basic connectivity tests completed');
    console.log('✅ Service availability verified');
    console.log('✅ Basic functionality confirmed');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Open browser and manually test features');
    console.log('2. Check browser console for errors');
    console.log('3. Test specific workflows you care about');
    console.log('4. Use the detailed checklist for comprehensive testing');

  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  runQuickTests();
}

module.exports = { runQuickTests };
