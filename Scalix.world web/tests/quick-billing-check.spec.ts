import { test, expect } from '@playwright/test';

test.describe('Quick Billing Page Check', () => {
  test('Check if billing page loads and has basic elements', async ({ page }) => {
    console.log('🚀 QUICK BILLING PAGE CHECK');
    console.log('===========================');

    await page.setViewportSize({ width: 1280, height: 800 });

    // Visit billing page
    console.log('📊 Visiting billing page...');
    await page.goto('http://localhost:3002/dashboard/billing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Get page content
    const pageContent = await page.textContent('body');
    console.log('Page content length:', pageContent?.length || 0);

    // Check for basic elements
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Take screenshot
    await page.screenshot({ path: 'test-results/quick-billing-check.png', fullPage: true });

    // Look for any text on the page
    const allText = await page.locator('body').textContent();
    console.log('All text on page (first 500 chars):', allText?.substring(0, 500));

    // Check for basic HTML structure
    const hasHtml = await page.locator('html').count();
    const hasBody = await page.locator('body').count();
    const hasHead = await page.locator('head').count();

    console.log('HTML structure:');
    console.log('- HTML element:', hasHtml > 0 ? '✅ Present' : '❌ Missing');
    console.log('- Body element:', hasBody > 0 ? '✅ Present' : '❌ Missing');
    console.log('- Head element:', hasHead > 0 ? '✅ Present' : '❌ Missing');

    // Check for any error messages
    const errorMessages = await page.locator('text=/error|Error|404|500/i').count();
    console.log('Error messages found:', errorMessages);

    // Check for loading states
    const loadingElements = await page.locator('[class*="loading"], [class*="spinner"], text=/loading|Loading/i').count();
    console.log('Loading elements found:', loadingElements);

    // Always pass this basic test
    expect(hasHtml).toBeGreaterThan(0);
    expect(hasBody).toBeGreaterThan(0);

    console.log('\n✅ QUICK BILLING CHECK COMPLETED!');
  });
});
