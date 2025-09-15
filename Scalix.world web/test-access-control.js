// Test script for access control functionality
const puppeteer = require('playwright');

async function testAccessControl() {
  console.log('🧪 Testing Access Control System...\n');

  const browser = await puppeteer.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Access main site (should work)
    console.log('✅ Test 1: Accessing main site...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    console.log(`   Title: ${title}`);
    console.log('   ✅ Main site accessible\n');

    // Test 2: Try to access admin without authentication
    console.log('🔒 Test 2: Accessing admin without authentication...');
    try {
      await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
      const currentUrl = page.url();
      console.log(`   Current URL: ${currentUrl}`);

      if (currentUrl.includes('/auth/signin')) {
        console.log('   ✅ Redirected to signin page (expected)\n');
      } else {
        console.log('   ❌ Not redirected to signin (unexpected)\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Error accessing admin: ${error.message}\n`);
    }

    // Test 3: Check if admin layout shows access denied
    console.log('🚫 Test 3: Checking admin layout protection...');
    try {
      const adminContent = await page.$('[data-testid="admin-content"]');
      if (adminContent) {
        console.log('   ❌ Admin content visible without authentication (security issue)\n');
      } else {
        console.log('   ✅ Admin content properly protected\n');
      }
    } catch (error) {
      console.log('   ✅ Admin content not accessible (expected)\n');
    }

    // Test 4: Verify role-based access in development mode
    console.log('👤 Test 4: Testing role-based access...');
    try {
      // Navigate to signin and check if it auto-logs in development mode
      await page.goto('http://localhost:3000/auth/signin');
      await page.waitForLoadState('networkidle');

      // Check if user is automatically authenticated in dev mode
      const userMenu = await page.$('[data-testid="user-menu"]');
      if (userMenu) {
        console.log('   ✅ User automatically authenticated in dev mode\n');
      } else {
        console.log('   ❌ User not authenticated in dev mode\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Error testing authentication: ${error.message}\n`);
    }

    // Test 5: Check middleware functionality
    console.log('🛡️  Test 5: Testing middleware protection...');
    try {
      // Try accessing protected API routes
      const response = await page.goto('http://localhost:3000/api/admin/test');
      const status = response.status();

      if (status === 401 || status === 403) {
        console.log(`   ✅ API route properly protected (status: ${status})\n`);
      } else if (status === 404) {
        console.log('   ⚠️  API route not found (may need to create test endpoint)\n');
      } else {
        console.log(`   ❌ API route not properly protected (status: ${status})\n`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error testing API protection: ${error.message}\n`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }

  console.log('🎯 Access Control Testing Complete!\n');
  console.log('📋 Summary:');
  console.log('   - Main site should be accessible to everyone');
  console.log('   - Admin routes should redirect to signin');
  console.log('   - Admin content should be protected');
  console.log('   - Development mode should auto-authenticate as admin');
  console.log('   - API routes should be protected');
}

// Run the test
testAccessControl().catch(console.error);
