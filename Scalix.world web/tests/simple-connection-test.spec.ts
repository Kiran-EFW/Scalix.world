import { test, expect } from '@playwright/test';

test.describe('Simple Connection Test', () => {
  test('Test basic server connectivity', async ({ page }) => {
    console.log('🔗 TESTING BASIC SERVER CONNECTIVITY');
    console.log('=====================================');

    try {
      // Try to access the homepage first
      console.log('🏠 Testing homepage...');
      await page.goto('http://localhost:3000', { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      const pageTitle = await page.title();
      console.log('✅ Homepage accessible, title:', pageTitle);

      // Try to access billing page
      console.log('💳 Testing billing page access...');
      await page.goto('http://localhost:3000/dashboard/billing', { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Check for any content
      const bodyText = await page.locator('body').textContent();
      const contentLength = bodyText?.length || 0;

      console.log(`✅ Billing page loaded with ${contentLength} characters of content`);

      // Check for specific elements
      const hasContent = contentLength > 100;
      const hasError = bodyText?.includes('500') || bodyText?.includes('Internal Server Error') || false;

      console.log(`✅ Has substantial content: ${hasContent ? '✅' : '❌'}`);
      console.log(`✅ No server errors: ${!hasError ? '✅' : '❌'}`);

      if (hasError) {
        console.log('⚠️ Found potential error in page content');
      }

      // Basic success criteria
      expect(hasContent).toBe(true);
      expect(!hasError).toBe(true);

    } catch (error) {
      console.log('❌ Connection test failed:', error.message);
      throw error;
    }

    console.log('\n🎯 CONNECTION TEST RESULTS:');
    console.log('   - Server accessible: ✅');
    console.log('   - Pages load: ✅');
    console.log('   - No critical errors: ✅');

    console.log('\n✅ BASIC CONNECTIVITY TEST PASSED!');
  });
});
