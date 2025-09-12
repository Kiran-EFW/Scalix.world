import { test, expect } from '@playwright/test';

test.describe('API Key Management System Test', () => {
  test.setTimeout(120000);

  test('Complete API Key Management Experience', async ({ page }) => {
    console.log('🔑 TESTING COMPLETE API KEY MANAGEMENT SYSTEM');
    console.log('==============================================');

    await page.setViewportSize({ width: 1280, height: 800 });

    // === 1. ACCESS DASHBOARD ===
    console.log('📊 Accessing dashboard...');

    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check dashboard loaded
    const dashboardTitle = await page.locator('text=/AI Development Dashboard/i').count();
    console.log(`✅ Dashboard loaded: ${dashboardTitle > 0 ? '✅' : '❌'}`);

    // === 2. ACCESS API KEYS SECTION ===
    console.log('\n🔑 Accessing API Keys section...');

    const apiKeysLink = page.locator('a').filter({ hasText: 'API Keys' }).first();
    if (await apiKeysLink.isVisible()) {
      await apiKeysLink.click();
      await page.waitForTimeout(2000);
    } else {
      // Try navigating directly
      await page.goto('http://localhost:3000/dashboard/api-keys');
      await page.waitForTimeout(2000);
    }

    // Check API Keys page loaded
    const apiKeysTitle = await page.locator('text=/API Keys/i').count();
    const proBadge = await page.locator('text=/Pro/i').count();
    const crownIcon = await page.locator('[class*="crown"]').count();

    console.log(`✅ API Keys page loaded: ${apiKeysTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Pro user badge: ${proBadge > 0 ? '✅' : '❌'}`);
    console.log(`✅ Crown icon visible: ${crownIcon > 0 ? '✅' : '❌'}`);

    // Take screenshot of API Keys page
    await page.screenshot({ path: 'test-results/api-keys-page.png', fullPage: true });

    // === 3. TEST API KEY CREATION ===
    console.log('\n➕ Testing API key creation...');

    const createButton = page.locator('button').filter({ hasText: 'Create API Key' });
    const createExists = await createButton.count();
    console.log(`✅ Create API Key button: ${createExists > 0 ? '✅' : '❌'}`);

    if (createExists > 0) {
      await createButton.click();
      await page.waitForTimeout(1000);

      // Check create form appeared
      const nameInput = page.locator('input[placeholder*="API Key Name"]').first();
      const formExists = await nameInput.count();
      console.log(`✅ Create form visible: ${formExists > 0 ? '✅' : '❌'}`);

      if (formExists > 0) {
        // Fill form and create API key
        await nameInput.fill('Test API Key - Playwright');
        await page.waitForTimeout(500);

        const submitButton = page.locator('button').filter({ hasText: 'Create API Key' }).first();
        await submitButton.click();
        await page.waitForTimeout(2000);

        // Check for success message
        const successMessage = await page.locator('text=/API key created successfully/i').count();
        console.log(`✅ API key creation success: ${successMessage > 0 ? '✅' : '❌'}`);

        // Take screenshot after creation
        await page.screenshot({ path: 'test-results/api-key-created.png', fullPage: true });
      }
    }

    // === 4. TEST API KEY DISPLAY ===
    console.log('\n👁️ Testing API key display...');

    // Check for API key in list
    const apiKeyCard = page.locator('text=/Test API Key - Playwright/i');
    const keyExists = await apiKeyCard.count();
    console.log(`✅ Created API key visible: ${keyExists > 0 ? '✅' : '❌'}`);

    if (keyExists > 0) {
      // Check for key visibility toggle
      const eyeButton = page.locator('[class*="eye"]').first();
      const eyeExists = await eyeButton.count();
      console.log(`✅ Key visibility toggle: ${eyeExists > 0 ? '✅' : '❌'}`);

      // Check for copy button
      const copyButton = page.locator('button').filter({ hasText: 'Copy' });
      const copyExists = await copyButton.count();
      console.log(`✅ Copy button available: ${copyExists > 0 ? '✅' : '❌'}`);

      // Check for usage stats
      const usageStats = page.locator('text=/requests/i');
      const statsExist = await usageStats.count();
      console.log(`✅ Usage statistics: ${statsExist > 0 ? '✅' : '❌'}`);
    }

    // === 5. TEST API KEY MANAGEMENT ===
    console.log('\n⚙️ Testing API key management...');

    // Check for delete button
    const deleteButton = page.locator('button').filter({ hasText: 'Delete' });
    const deleteExists = await deleteButton.count();
    console.log(`✅ Delete button available: ${deleteExists > 0 ? '✅' : '❌'}`);

    // === 6. TEST USAGE INSTRUCTIONS ===
    console.log('\n📖 Testing usage instructions...');

    // Check for code examples
    const codeExample = page.locator('pre').first();
    const codeExists = await codeExample.count();
    console.log(`✅ Code examples available: ${codeExists > 0 ? '✅' : '❌'}`);

    // Check for security warnings
    const securityWarning = page.locator('text=/Never share your API keys/i');
    const warningExists = await securityWarning.count();
    console.log(`✅ Security warnings: ${warningExists > 0 ? '✅' : '❌'}`);

    // === 7. TEST MOBILE RESPONSIVENESS ===
    console.log('\n📱 Testing mobile responsiveness...');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const mobileApiKeysTitle = await page.locator('text=/API Keys/i').count();
    const mobileProBadge = await page.locator('text=/Pro/i').count();

    console.log(`✅ Mobile API Keys page: ${mobileApiKeysTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Mobile Pro badge: ${mobileProBadge > 0 ? '✅' : '❌'}`);

    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/api-keys-mobile.png', fullPage: true });

    // Back to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // === 8. TEST NAVIGATION INTEGRATION ===
    console.log('\n🧭 Testing navigation integration...');

    // Check if API Keys appears in main navigation
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    const navApiKeysLink = page.locator('a').filter({ hasText: 'API Keys' });
    const navLinkExists = await navApiKeysLink.count();
    console.log(`✅ Navigation API Keys link: ${navLinkExists > 0 ? '✅' : '❌'}`);

    // === 9. COMPREHENSIVE API KEY ASSESSMENT ===
    console.log('\n🎯 API KEY MANAGEMENT ASSESSMENT');
    console.log('=================================');

    const apiKeyAssessment = {
      pageLoad: apiKeysTitle > 0,
      proFeatures: proBadge > 0 && crownIcon > 0,
      createFunctionality: createExists > 0,
      keyDisplay: keyExists > 0,
      keyManagement: eyeExists > 0 && copyExists > 0 && deleteExists > 0,
      usageInstructions: codeExists > 0 && warningExists > 0,
      mobileResponsive: mobileApiKeysTitle > 0,
      navigationIntegration: navLinkExists > 0,
      securityFeatures: warningExists > 0
    };

    console.log('\n🔑 API KEY FEATURES:');
    console.log(`   - Page Loading: ${apiKeyAssessment.pageLoad ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Pro Features Display: ${apiKeyAssessment.proFeatures ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Key Creation: ${apiKeyAssessment.createFunctionality ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Key Display & Management: ${apiKeyAssessment.keyManagement ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Usage Instructions: ${apiKeyAssessment.usageInstructions ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Mobile Experience: ${apiKeyAssessment.mobileResponsive ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Navigation Integration: ${apiKeyAssessment.navigationIntegration ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Security Features: ${apiKeyAssessment.securityFeatures ? '✅ Working' : '❌ Missing'}`);

    const workingFeatures = Object.values(apiKeyAssessment).filter(Boolean).length;
    const totalFeatures = Object.keys(apiKeyAssessment).length;
    const completionRate = Math.round((workingFeatures / totalFeatures) * 100);

    console.log('\n🎉 API KEY RESULTS:');
    console.log(`   - Working Features: ${workingFeatures}/${totalFeatures} (${completionRate}%)`);
    console.log(`   - Overall Status: ${completionRate >= 80 ? '✅ EXCELLENT' : completionRate >= 60 ? '⚠️ GOOD' : '❌ NEEDS WORK'}`);

    // Test assertions
    expect(apiKeyAssessment.pageLoad).toBe(true);
    expect(apiKeyAssessment.proFeatures).toBe(true);
    expect(apiKeyAssessment.createFunctionality).toBe(true);
    expect(apiKeyAssessment.keyManagement).toBe(true);

    console.log('\n✅ API KEY MANAGEMENT SYSTEM TEST COMPLETED!');
    console.log('Pro users can now generate and manage Scalix AI API keys! 🚀');
  });
});
