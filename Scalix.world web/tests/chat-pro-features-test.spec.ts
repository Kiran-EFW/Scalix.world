import { test, expect } from '@playwright/test';

test.describe('AI Chat Pro Features Test', () => {
  test.setTimeout(120000);

  test('Verify Pro User Chat Experience', async ({ page }) => {
    console.log('👑 TESTING PRO USER CHAT FEATURES');
    console.log('==================================');

    await page.setViewportSize({ width: 1280, height: 800 });

    // === 1. ACCESS CHAT AS FREE USER ===
    console.log('🔓 Testing Free User Experience...');

    await page.goto('http://localhost:3000/chat');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for free user indicators
    const freeUserTitle = await page.locator('text=/Scalix Chat$/i').count();
    const proBadge = await page.locator('text=/Pro$/i').count();

    console.log(`✅ Free user title: ${freeUserTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Pro badge hidden: ${proBadge === 0 ? '✅' : '❌'}`);

    // Test model selection for free user
    const modelSelector = page.locator('button').filter({ hasText: /GPT-3.5|GPT-4|Claude/i }).first();
    if (await modelSelector.isVisible()) {
      await modelSelector.click();
      await page.waitForTimeout(1000);

      // Check available models for free users
      const freeModels = await page.locator('text=/GPT-3.5 Turbo|Code Llama/i').count();
      const proModels = await page.locator('text=/GPT-4|Claude 3/i').count();

      console.log(`✅ Free models visible: ${freeModels > 0 ? '✅' : '❌'}`);
      console.log(`✅ Pro models restricted: ${proModels === 0 ? '✅' : '❌'}`);

      // Take screenshot of free user model selection
      await page.screenshot({ path: 'test-results/chat-free-user.png', fullPage: true });
    }

    // Check for upgrade prompts
    const upgradePrompt = await page.locator('text=/Upgrade to Pro/i').count();
    console.log(`✅ Upgrade prompt visible: ${upgradePrompt > 0 ? '✅' : '❌'}`);

    // === 2. SIMULATE PRO USER EXPERIENCE ===
    console.log('\n👑 Testing Pro User Experience...');

    // Simulate pro user by setting localStorage (in real app this would come from auth)
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-pro-user',
        email: 'pro@example.com',
        name: 'Pro User',
        plan: 'pro'
      }));
    });

    // Reload page to apply pro user state
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for pro user indicators
    const proUserTitle = await page.locator('text=/Scalix Chat Pro/i').count();
    const proBadgeVisible = await page.locator('text=/Pro$/i').count();
    const crownIcon = await page.locator('[class*="crown"]').count();

    console.log(`✅ Pro user title: ${proUserTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Pro badge visible: ${proBadgeVisible > 0 ? '✅' : '❌'}`);
    console.log(`✅ Crown icon visible: ${crownIcon > 0 ? '✅' : '❌'}`);

    // Check sidebar pro features
    const proBanner = await page.locator('text=/Pro User/i').count();
    const proFeatures = await page.locator('text=/GPT-4 Access|Claude 3 Access/i').count();

    console.log(`✅ Pro user banner: ${proBanner > 0 ? '✅' : '❌'}`);
    console.log(`✅ Pro features list: ${proFeatures > 0 ? '✅' : '❌'}`);

    // Test model selection for pro user
    const proModelSelector = page.locator('button').filter({ hasText: /GPT-4/i }).first();
    if (await proModelSelector.isVisible()) {
      await proModelSelector.click();
      await page.waitForTimeout(1000);

      // Check all models available for pro users
      const allModels = await page.locator('text=/GPT-4|Claude 3|GPT-3.5|Code Llama/i').count();
      console.log(`✅ All models accessible: ${allModels >= 4 ? '✅' : '❌'}`);

      // Take screenshot of pro user model selection
      await page.screenshot({ path: 'test-results/chat-pro-user.png', fullPage: true });
    }

    // === 3. TEST WELCOME MESSAGES ===
    console.log('\n💬 Testing Personalized Welcome Messages...');

    // Check pro user welcome message
    const proWelcome = await page.locator('text=/Pro subscriber|premium AI|most advanced/i').count();
    console.log(`✅ Pro welcome message: ${proWelcome > 0 ? '✅' : '❌'}`);

    // === 4. TEST MOBILE PRO EXPERIENCE ===
    console.log('\n📱 Testing Mobile Pro Experience...');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const mobileProTitle = await page.locator('text=/Scalix Chat Pro/i').count();
    const mobileProBadge = await page.locator('text=/Pro$/i').count();

    console.log(`✅ Mobile pro title: ${mobileProTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Mobile pro badge: ${mobileProBadge > 0 ? '✅' : '❌'}`);

    // Take mobile pro screenshot
    await page.screenshot({ path: 'test-results/chat-mobile-pro.png', fullPage: true });

    // Back to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // === 5. COMPREHENSIVE PRO USER ASSESSMENT ===
    console.log('\n🎯 PRO USER CHAT ASSESSMENT');
    console.log('===========================');

    const proAssessment = {
      proTitle: proUserTitle > 0,
      proBadge: proBadgeVisible > 0,
      crownIcon: crownIcon > 0,
      proBanner: proBanner > 0,
      proFeatures: proFeatures > 0,
      allModels: allModels >= 4,
      proWelcome: proWelcome > 0,
      mobilePro: mobileProTitle > 0 && mobileProBadge > 0,
      freeRestrictions: freeModels > 0 && proModels === 0,
      upgradePrompts: upgradePrompt > 0
    };

    console.log('\n👑 PRO USER FEATURES:');
    console.log(`   - Pro Title Display: ${proAssessment.proTitle ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Pro Badge: ${proAssessment.proBadge ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Crown Icon: ${proAssessment.crownIcon ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Pro Banner: ${proAssessment.proBanner ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Pro Features List: ${proAssessment.proFeatures ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - All Models Access: ${proAssessment.allModels ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Pro Welcome Messages: ${proAssessment.proWelcome ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Mobile Pro Experience: ${proAssessment.mobilePro ? '✅ Working' : '❌ Missing'}`);

    console.log('\n🔓 FREE USER RESTRICTIONS:');
    console.log(`   - Free Models Only: ${proAssessment.freeRestrictions ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Upgrade Prompts: ${proAssessment.upgradePrompts ? '✅ Working' : '❌ Missing'}`);

    const proWorkingFeatures = Object.values(proAssessment).filter(Boolean).length;
    const totalProFeatures = Object.keys(proAssessment).length;
    const proCompletionRate = Math.round((proWorkingFeatures / totalProFeatures) * 100);

    console.log('\n🎉 PRO USER RESULTS:');
    console.log(`   - Working Features: ${proWorkingFeatures}/${totalProFeatures} (${proCompletionRate}%)`);
    console.log(`   - Overall Status: ${proCompletionRate >= 80 ? '✅ EXCELLENT' : proCompletionRate >= 60 ? '⚠️ GOOD' : '❌ NEEDS WORK'}`);

    // Test assertions
    expect(proAssessment.proTitle).toBe(true);
    expect(proAssessment.proBadge).toBe(true);
    expect(proAssessment.allModels).toBe(true);
    expect(proAssessment.freeRestrictions).toBe(true);
    expect(proAssessment.upgradePrompts).toBe(true);

    console.log('\n✅ PRO USER CHAT FEATURES TEST COMPLETED!');
    console.log('Pro users get premium AI access with GPT-4 and Claude 3!');
    console.log('Free users see upgrade prompts and get basic models! 🚀');
  });
});
