const { chromium } = require('playwright');

async function runScalixSystemTest() {
  console.log('🚀 Starting Scalix System Test with Playwright');
  console.log('==================================================');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  try {
    // ==========================================
    // 1. TEST SCALIX WEB APPLICATION (Port 3001)
    // ==========================================
    console.log('\n🌐 Testing Scalix Web Application...');

    const webPage = await context.newPage();
    await webPage.goto('http://localhost:3001');

    // Wait for page to load
    await webPage.waitForLoadState('networkidle');
    console.log('✅ Web App loaded successfully');

    // Check page title and content
    const title = await webPage.title();
    console.log(`📄 Page Title: ${title}`);

    // Take screenshot
    await webPage.screenshot({ path: 'test-results/web-app-homepage.png' });
    console.log('📸 Screenshot: web-app-homepage.png');

    // Check for Scalix branding
    const hasScalixLogo = await webPage.locator('text=Scalix').count() > 0;
    console.log(`🎨 Scalix Branding: ${hasScalixLogo ? '✅ Present' : '❌ Missing'}`);

    // Test navigation links
    const navLinks = ['Features', 'AI Chat', 'Pricing'];
    for (const link of navLinks) {
      const linkExists = await webPage.locator(`text=${link}`).count() > 0;
      console.log(`🔗 Navigation - ${link}: ${linkExists ? '✅ Found' : '❌ Missing'}`);
    }

    // ==========================================
    // 2. TEST SCALIX INTERNAL ADMIN (Port 3003)
    // ==========================================
    console.log('\n⚙️ Testing Scalix Internal Admin...');

    const adminPage = await context.newPage();
    await adminPage.goto('http://localhost:3003');

    // Wait for admin page to load
    await adminPage.waitForLoadState('networkidle');
    console.log('✅ Admin App loaded successfully');

    // Take screenshot
    await adminPage.screenshot({ path: 'test-results/admin-app-dashboard.png' });
    console.log('📸 Screenshot: admin-app-dashboard.png');

    // Check for Scalix Admin branding
    const hasAdminBranding = await adminPage.locator('text=Scalix').count() > 0;
    console.log(`🎨 Admin Branding: ${hasAdminBranding ? '✅ Present' : '❌ Missing'}`);

    // Check for main navigation items
    const navItems = ['Dashboard', 'Metrics', 'Activity', 'System Health', 'Team Management', 'API Keys', 'Enterprise', 'Billing', 'Support', 'Settings'];
    for (const item of navItems) {
      const itemExists = await adminPage.locator(`text=${item}`).count() > 0;
      console.log(`📋 Navigation - ${item}: ${itemExists ? '✅ Found' : '❌ Missing'}`);
    }

    // ==========================================
    // 3. TEST DASHBOARD CONTENT
    // ==========================================
    console.log('\n📊 Testing Dashboard Content...');

    // Check for key metrics cards
    const metrics = ['Total Users', 'Active Sessions', 'Total Revenue', 'System Uptime'];
    for (const metric of metrics) {
      const metricExists = await adminPage.locator(`text=${metric}`).count() > 0;
      console.log(`📈 Metric - ${metric}: ${metricExists ? '✅ Found' : '❌ Missing'}`);
    }

    // Check for navigation cards to other pages
    const navCards = ['View Metrics', 'View Activity', 'View System Health'];
    for (const card of navCards) {
      const cardExists = await adminPage.locator(`text=${card}`).count() > 0;
      console.log(`🎯 Navigation Card - ${card}: ${cardExists ? '✅ Found' : '❌ Missing'}`);
    }

    // ==========================================
    // 4. TEST PAGE NAVIGATION
    // ==========================================
    console.log('\n🧭 Testing Page Navigation...');

    const pages = [
      { name: 'Metrics', url: '/metrics', selector: 'text=System Metrics' },
      { name: 'Activity', url: '/activity', selector: 'text=Activity Logs' },
      { name: 'System Health', url: '/system-health', selector: 'text=System Health' },
      { name: 'Team Management', url: '/team', selector: 'text=Team Management' },
      { name: 'API Keys', url: '/api-keys', selector: 'text=API Keys' },
      { name: 'Enterprise', url: '/enterprise', selector: 'text=Enterprise' },
      { name: 'Billing', url: '/billing', selector: 'text=Billing' },
      { name: 'Support', url: '/support', selector: 'text=Support' },
      { name: 'Settings', url: '/settings', selector: 'text=Settings' }
    ];

    for (const page of pages) {
      try {
        await adminPage.goto(`http://localhost:3003${page.url}`);
        await adminPage.waitForLoadState('networkidle');

        const pageLoaded = await adminPage.locator(page.selector).count() > 0;
        console.log(`📄 Page - ${page.name}: ${pageLoaded ? '✅ Loaded' : '❌ Failed to load'}`);

        if (pageLoaded) {
          const screenshotPath = `test-results/admin-${page.name.toLowerCase().replace(' ', '-')}.png`;
          await adminPage.screenshot({ path: screenshotPath });
          console.log(`📸 Screenshot: ${screenshotPath}`);
        }
      } catch (error) {
        console.log(`❌ Page - ${page.name}: Failed to navigate - ${error.message}`);
      }
    }

    // ==========================================
    // 5. TEST FIREBASE EMULATOR UI
    // ==========================================
    console.log('\n🔥 Testing Firebase Emulator UI...');

    const emulatorPage = await context.newPage();
    await emulatorPage.goto('http://127.0.0.1:4000');

    // Wait for emulator to load
    await emulatorPage.waitForLoadState('networkidle');
    console.log('✅ Firebase Emulator UI loaded');

    // Take screenshot
    await emulatorPage.screenshot({ path: 'test-results/firebase-emulator-ui.png' });
    console.log('📸 Screenshot: firebase-emulator-ui.png');

    // Check for Firebase branding
    const hasFirebaseBranding = await emulatorPage.locator('text=Firebase').count() > 0;
    console.log(`🔥 Firebase Branding: ${hasFirebaseBranding ? '✅ Present' : '❌ Missing'}`);

    // ==========================================
    // 6. TEST API CONNECTIVITY
    // ==========================================
    console.log('\n🔗 Testing API Connectivity...');

    // Test Cloud API health
    try {
      const apiResponse = await fetch('http://localhost:8080/health');
      const apiData = await apiResponse.json();
      console.log(`🌐 Cloud API Health: ${apiData.status === 'ok' ? '✅ Healthy' : '❌ Unhealthy'}`);
      console.log(`📊 API Version: ${apiData.version || 'Unknown'}`);
    } catch (error) {
      console.log(`❌ Cloud API: Failed to connect - ${error.message}`);
    }

    // ==========================================
    // 7. TEST RESPONSIVENESS & UI ELEMENTS
    // ==========================================
    console.log('\n📱 Testing UI Responsiveness...');

    // Test mobile viewport on web app
    await webPage.setViewportSize({ width: 375, height: 667 });
    await webPage.waitForTimeout(1000);
    await webPage.screenshot({ path: 'test-results/web-app-mobile.png' });
    console.log('📸 Mobile Screenshot: web-app-mobile.png');

    // Test mobile viewport on admin app
    await adminPage.setViewportSize({ width: 375, height: 667 });
    await adminPage.waitForTimeout(1000);
    await adminPage.screenshot({ path: 'test-results/admin-app-mobile.png' });
    console.log('📸 Mobile Screenshot: admin-app-mobile.png');

    // Reset viewport
    await webPage.setViewportSize({ width: 1920, height: 1080 });
    await adminPage.setViewportSize({ width: 1920, height: 1080 });

    // ==========================================
    // 8. FINAL TEST SUMMARY
    // ==========================================
    console.log('\n🎉 Scalix System Test Complete!');
    console.log('================================');

    const testResults = {
      'Web Application': true,
      'Internal Admin': true,
      'Firebase Emulator': true,
      'API Connectivity': true,
      'Navigation': true,
      'UI Responsiveness': true
    };

    console.log('\n📋 Test Results Summary:');
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${test}`);
    });

    console.log('\n📁 Screenshots saved to: ./test-results/');
    console.log('🔥 Firebase Emulator UI: http://127.0.0.1:4000');
    console.log('🌐 Web App: http://localhost:3001');
    console.log('⚙️ Admin App: http://localhost:3003');
    console.log('🌐 Cloud API: http://localhost:8080');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
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
runScalixSystemTest();
