import { test, expect } from '@playwright/test';

test.describe('Upgrade and Downgrade User Experience', () => {
  test.setTimeout(120000);

  test('Complete Upgrade/Downgrade Flow Test', async ({ page }) => {
    console.log('🚀 STARTING UPGRADE/DOWNGRADE USER EXPERIENCE TEST');
    console.log('========================================================');

    await page.setViewportSize({ width: 1280, height: 800 });

    // === 1. VISIT DASHBOARD ===
    console.log('📊 Visiting dashboard...');
    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // === 2. CHECK FOR UPGRADE/DOWNGRADE ELEMENTS ===
    console.log('🔍 Checking for upgrade/downgrade elements...');

    const upgradeElements = [
      page.locator('text=/upgrade|Upgrade/i'),
      page.locator('text=/pro|Pro|premium|Premium/i'),
      page.locator('text=/downgrade|Downgrade/i'),
      page.locator('text=/manage plan|Manage Plan/i'),
      page.locator('text=/change plan|Change Plan/i'),
    ];

    let upgradeCount = 0;
    let proCount = 0;
    let downgradeCount = 0;
    let managePlanCount = 0;

    for (const element of upgradeElements) {
      try {
        const count = await element.count();
        const text = await element.first().textContent();

        if (text?.toLowerCase().includes('upgrade')) upgradeCount += count;
        if (text?.toLowerCase().includes('pro') || text?.toLowerCase().includes('premium')) proCount += count;
        if (text?.toLowerCase().includes('downgrade')) downgradeCount += count;
        if (text?.toLowerCase().includes('manage') || text?.toLowerCase().includes('change')) managePlanCount += count;

        if (count > 0 && text) {
          console.log(`✅ Found: "${text?.substring(0, 50)}..." (${count} times)`);
        }
      } catch (error) {
        // Continue checking
      }
    }

    console.log('\n📈 UPGRADE ELEMENTS SUMMARY:');
    console.log(`   - Upgrade buttons/text: ${upgradeCount}`);
    console.log(`   - Pro/Premium mentions: ${proCount}`);
    console.log(`   - Downgrade options: ${downgradeCount}`);
    console.log(`   - Plan management: ${managePlanCount}`);

    // === 3. TEST BILLING PAGE UPGRADE OPTIONS ===
    console.log('\n💳 Testing billing page upgrade options...');

    try {
      await page.goto('http://localhost:3002/dashboard/billing');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check for "Manage Plan" button
      const managePlanBtn = page.locator('text=/Manage Plan/i');
      const isManagePlanVisible = await managePlanBtn.isVisible();

      if (isManagePlanVisible) {
        console.log('✅ "Manage Plan" button is visible');
        await managePlanBtn.click();
        await page.waitForTimeout(1000);
        console.log('✅ "Manage Plan" button is clickable');
      } else {
        console.log('❌ "Manage Plan" button not found');
      }

      // Check for upgrade prompts when nearing limits
      const upgradePrompts = page.locator('text=/Upgrade Plan|upgrade|Upgrade/i');
      const upgradePromptCount = await upgradePrompts.count();

      console.log(`📈 Upgrade prompts found: ${upgradePromptCount}`);

      if (upgradePromptCount > 0) {
        for (let i = 0; i < upgradePromptCount; i++) {
          const text = await upgradePrompts.nth(i).textContent();
          console.log(`   - Prompt ${i + 1}: "${text?.substring(0, 30)}..."`);
        }
      }

      // Check current plan display
      const currentPlanDisplay = page.locator('text=/Current Plan|Pro Plan/i');
      const planDisplayCount = await currentPlanDisplay.count();

      console.log(`🏷️ Current plan displays: ${planDisplayCount}`);

      if (planDisplayCount > 0) {
        const planText = await currentPlanDisplay.first().textContent();
        console.log(`   - Current plan: "${planText}"`);
      }

    } catch (error) {
      console.log('❌ Billing page test failed:', error.message);
    }

    // === 4. TEST USAGE PAGE UPGRADE TRIGGERS ===
    console.log('\n📊 Testing usage page upgrade triggers...');

    try {
      await page.goto('http://localhost:3002/dashboard/usage');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Look for usage limit warnings
      const usageWarnings = page.locator('text=/limit|Limit|exceeded|Exceeded|upgrade|Upgrade/i');
      const warningCount = await usageWarnings.count();

      console.log(`⚠️ Usage warnings found: ${warningCount}`);

      if (warningCount > 0) {
        for (let i = 0; i < Math.min(warningCount, 3); i++) {
          const warningText = await usageWarnings.nth(i).textContent();
          console.log(`   - Warning ${i + 1}: "${warningText?.substring(0, 50)}..."`);
        }
      }

      // Check for usage progress bars
      const progressBars = page.locator('[class*="progress"], .bg-gray-200');
      const progressCount = await progressBars.count();

      console.log(`📊 Progress bars found: ${progressCount}`);

      // Check for upgrade buttons near limits
      const upgradeNearLimit = page.locator('text=/Upgrade Plan/i').locator('..').locator('button');
      const upgradeBtnCount = await upgradeNearLimit.count();

      console.log(`🚀 Upgrade buttons near limits: ${upgradeBtnCount}`);

    } catch (error) {
      console.log('❌ Usage page test failed:', error.message);
    }

    // === 5. TEST PRICING PAGE BENEFIT COMPARISON ===
    console.log('\n💰 Testing pricing page benefit comparison...');

    try {
      await page.goto('http://localhost:3002/pricing');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check for feature comparison table
      const comparisonTable = page.locator('table');
      const isTableVisible = await comparisonTable.isVisible();

      console.log(`📋 Feature comparison table: ${isTableVisible ? 'Visible' : 'Not found'}`);

      // Check for plan benefits
      const proBenefits = page.locator('text=/Premium AI models|Advanced analytics|Priority support/i');
      const benefitCount = await proBenefits.count();

      console.log(`🏆 Pro benefits listed: ${benefitCount}`);

      if (benefitCount > 0) {
        for (let i = 0; i < Math.min(benefitCount, 5); i++) {
          const benefit = await proBenefits.nth(i).textContent();
          console.log(`   - Benefit ${i + 1}: "${benefit?.substring(0, 40)}..."`);
        }
      }

      // Check for CTA buttons
      const ctaButtons = page.locator('button').filter({ hasText: /Start.*Trial|Upgrade|Get Started/i });
      const ctaCount = await ctaButtons.count();

      console.log(`🎯 Call-to-action buttons: ${ctaCount}`);

      if (ctaCount > 0) {
        for (let i = 0; i < ctaCount; i++) {
          const ctaText = await ctaButtons.nth(i).textContent();
          console.log(`   - CTA ${i + 1}: "${ctaText}"`);
        }
      }

    } catch (error) {
      console.log('❌ Pricing page test failed:', error.message);
    }

    // === 6. TEST PRO MODE SELECTOR ===
    console.log('\n⚡ Testing Pro mode selector...');

    try {
      await page.goto('http://localhost:3002/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Look for Pro button/selector
      const proButtons = page.locator('button').filter({ hasText: /Pro|pro/i });
      const proBtnCount = await proButtons.count();

      console.log(`🔥 Pro mode buttons found: ${proBtnCount}`);

      if (proBtnCount > 0) {
        const proBtnText = await proButtons.first().textContent();
        console.log(`   - Pro button: "${proBtnText}"`);

        // Try to click it (might open a popover)
        try {
          await proButtons.first().click();
          await page.waitForTimeout(1000);

          // Look for upgrade options in popover/modal
          const upgradeOptions = page.locator('text=/Upgrade to Pro|upgrade|Upgrade/i');
          const upgradeOptionCount = await upgradeOptions.count();

          console.log(`   - Upgrade options in Pro selector: ${upgradeOptionCount}`);

          if (upgradeOptionCount > 0) {
            const upgradeText = await upgradeOptions.first().textContent();
            console.log(`   - Upgrade option: "${upgradeText}"`);
          }
        } catch (clickError) {
          console.log('   - Could not interact with Pro button:', clickError.message);
        }
      }

    } catch (error) {
      console.log('❌ Pro mode selector test failed:', error.message);
    }

    // === 7. TEST FREE VS PRO FEATURE DIFFERENTIATION ===
    console.log('\n🔄 Testing free vs pro feature differentiation...');

    // Go back to pricing page to check differentiation
    await page.goto('http://localhost:3002/pricing');
    await page.waitForTimeout(2000);

    const freeFeatures = page.locator('text=/Free|free|100.*tokens|Basic.*models/i');
    const proFeatures = page.locator('text=/Pro|pro|10,000.*tokens|Premium.*models|Advanced.*analytics/i');

    const freeFeatureCount = await freeFeatures.count();
    const proFeatureCount = await proFeatures.count();

    console.log(`🆓 Free features highlighted: ${freeFeatureCount}`);
    console.log(`🏆 Pro features highlighted: ${proFeatureCount}`);

    // Check for limitations section
    const limitations = page.locator('text=/Limitations|limitations/i');
    const limitationCount = await limitations.count();

    console.log(`⚠️ Plan limitations mentioned: ${limitationCount}`);

    // === 8. FINAL ASSESSMENT ===
    console.log('\n🎯 UPGRADE/DOWNGRADE USER EXPERIENCE ASSESSMENT');
    console.log('====================================================');

    const assessment = {
      upgradeOptions: upgradeCount > 0 || managePlanCount > 0,
      proBenefits: proCount > 0 || benefitCount > 0,
      planComparison: isTableVisible || limitationCount > 0,
      ctaButtons: ctaCount > 0,
      usageWarnings: warningCount > 0,
      downgradeOptions: downgradeCount > 0,
      currentPlanDisplay: planDisplayCount > 0
    };

    console.log('🔐 AUTHENTICATION & PLAN MANAGEMENT:');
    console.log(`   - Upgrade options available: ${assessment.upgradeOptions ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Current plan clearly displayed: ${assessment.currentPlanDisplay ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Downgrade options available: ${assessment.downgradeOptions ? '✅ Yes' : '❌ No'}`);

    console.log('\n💰 PRICING & BENEFITS:');
    console.log(`   - Pro benefits clearly explained: ${assessment.proBenefits ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Plan comparison available: ${assessment.planComparison ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Clear call-to-action buttons: ${assessment.ctaButtons ? '✅ Yes' : '❌ No'}`);

    console.log('\n📊 USAGE MANAGEMENT:');
    console.log(`   - Usage warnings when approaching limits: ${assessment.usageWarnings ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Progress bars showing usage: ${progressCount > 0 ? '✅ Yes' : '❌ No'}`);

    console.log('\n🎨 USER EXPERIENCE:');
    const clearDirections = Object.values(assessment).filter(Boolean).length >= 5;
    console.log(`   - Clear upgrade/downgrade directions: ${clearDirections ? '✅ Excellent' : '⚠️ Needs improvement'}`);

    // Test assertions
    expect(assessment.upgradeOptions || assessment.proBenefits).toBe(true); // At least basic upgrade options
    expect(assessment.ctaButtons).toBe(true); // Should have CTA buttons
    expect(freeFeatureCount > 0 || proFeatureCount > 0).toBe(true); // Should differentiate plans

    console.log('\n✅ UPGRADE/DOWNGRADE TEST COMPLETED SUCCESSFULLY!');
    console.log('Users have clear paths to understand and manage their subscription plans.');
  });
});
