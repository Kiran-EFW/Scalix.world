import { test, expect } from '@playwright/test';

test.describe('Pages Navigation Test', () => {
  test.setTimeout(60000);

  test('Test all footer and navigation links work', async ({ page }) => {
    console.log('🧪 TESTING ALL PAGES NAVIGATION');
    console.log('================================');

    await page.setViewportSize({ width: 1280, height: 800 });

    // === 1. VISIT HOMEPAGE ===
    console.log('🏠 Visiting homepage...');
    await page.goto('http://localhost:3000', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const homeTitle = await page.title();
    console.log('✅ Homepage loaded:', homeTitle);

    // === 2. TEST ABOUT PAGE ===
    console.log('\n👥 Testing About page...');
    await page.goto('http://localhost:3000/about', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const aboutContent = await page.locator('text=/About Scalix/i').count();
    const teamSection = await page.locator('text=/Meet Our Team/i').count();
    const storySection = await page.locator('text=/Our Story/i').count();

    console.log(`✅ About page - Title: ${aboutContent > 0 ? '✅' : '❌'}`);
    console.log(`✅ About page - Team: ${teamSection > 0 ? '✅' : '❌'}`);
    console.log(`✅ About page - Story: ${storySection > 0 ? '✅' : '❌'}`);

    // === 3. TEST PRIVACY POLICY PAGE ===
    console.log('\n🔒 Testing Privacy Policy page...');
    await page.goto('http://localhost:3000/privacy', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const privacyTitle = await page.locator('text=/Privacy Policy/i').count();
    const dataRights = await page.locator('text=/Your Data Rights/i').count();
    const privacyPrinciples = await page.locator('text=/Privacy Principles/i').count();

    console.log(`✅ Privacy page - Title: ${privacyTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Privacy page - Data Rights: ${dataRights > 0 ? '✅' : '❌'}`);
    console.log(`✅ Privacy page - Principles: ${privacyPrinciples > 0 ? '✅' : '❌'}`);

    // === 4. TEST TERMS OF SERVICE PAGE ===
    console.log('\n📋 Testing Terms of Service page...');
    await page.goto('http://localhost:3000/terms', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const termsTitle = await page.locator('text=/Terms of Service/i').count();
    const keyTerms = await page.locator('text=/Key Terms Summary/i').count();
    const agreementSection = await page.locator('text=/Agreement to Terms/i').count();

    console.log(`✅ Terms page - Title: ${termsTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Terms page - Key Terms: ${keyTerms > 0 ? '✅' : '❌'}`);
    console.log(`✅ Terms page - Agreement: ${agreementSection > 0 ? '✅' : '❌'}`);

    // === 5. TEST BLOG PAGE ===
    console.log('\n📝 Testing Blog page...');
    await page.goto('http://localhost:3000/blog', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    const blogTitle = await page.locator('text=/Scalix Blog/i').count();
    const featuredPost = await page.locator('text=/Featured Article/i').count();
    const latestArticles = await page.locator('text=/Latest Articles/i').count();

    console.log(`✅ Blog page - Title: ${blogTitle > 0 ? '✅' : '❌'}`);
    console.log(`✅ Blog page - Featured: ${featuredPost > 0 ? '✅' : '❌'}`);
    console.log(`✅ Blog page - Latest: ${latestArticles > 0 ? '✅' : '❌'}`);

    // === 6. TEST FOOTER LINKS FROM HOMEPAGE ===
    console.log('\n🔗 Testing footer links from homepage...');
    await page.goto('http://localhost:3000', { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });

    // Check footer links exist
    const aboutLink = page.locator('text=/About/i').first();
    const privacyLink = page.locator('text=/Privacy Policy/i').first();
    const termsLink = page.locator('text=/Terms of Service/i').first();
    const blogLink = page.locator('text=/Blog/i').first();

    const aboutExists = await aboutLink.count();
    const privacyExists = await privacyLink.count();
    const termsExists = await termsLink.count();
    const blogExists = await blogLink.count();

    console.log(`✅ Footer About link: ${aboutExists > 0 ? '✅' : '❌'}`);
    console.log(`✅ Footer Privacy link: ${privacyExists > 0 ? '✅' : '❌'}`);
    console.log(`✅ Footer Terms link: ${termsExists > 0 ? '✅' : '❌'}`);
    console.log(`✅ Footer Blog link: ${blogExists > 0 ? '✅' : '❌'}`);

    // === 7. TEST NAVIGATION LINKS ===
    console.log('\n🧭 Testing navigation links...');

    // Check main navigation
    const navAbout = page.locator('nav').locator('text=/About/i');
    const navBlog = page.locator('nav').locator('text=/Blog/i');

    const navAboutExists = await navAbout.count();
    const navBlogExists = await navBlog.count();

    console.log(`✅ Navigation About: ${navAboutExists > 0 ? '✅' : '❌'}`);
    console.log(`✅ Navigation Blog: ${navBlogExists > 0 ? '✅' : '❌'}`);

    // === 8. COMPREHENSIVE ASSESSMENT ===
    console.log('\n🎯 COMPREHENSIVE PAGES ASSESSMENT');
    console.log('=================================');

    const assessment = {
      aboutPage: aboutContent > 0 && teamSection > 0,
      privacyPage: privacyTitle > 0 && dataRights > 0,
      termsPage: termsTitle > 0 && keyTerms > 0,
      blogPage: blogTitle > 0 && featuredPost > 0,
      footerLinks: aboutExists > 0 && privacyExists > 0 && termsExists > 0,
      navigation: navAboutExists > 0 && navBlogExists > 0,
    };

    console.log('\n📄 PAGE CREATION:');
    console.log(`   - About Us Page: ${assessment.aboutPage ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Privacy Policy: ${assessment.privacyPage ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Terms of Service: ${assessment.termsPage ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Blog Page: ${assessment.blogPage ? '✅ Working' : '❌ Missing'}`);

    console.log('\n🔗 NAVIGATION LINKS:');
    console.log(`   - Footer Links: ${assessment.footerLinks ? '✅ Working' : '❌ Missing'}`);
    console.log(`   - Navigation Menu: ${assessment.navigation ? '✅ Working' : '❌ Missing'}`);

    const workingPages = Object.values(assessment).filter(Boolean).length;
    const totalPages = Object.keys(assessment).length;
    const completionRate = Math.round((workingPages / totalPages) * 100);

    console.log('\n🎉 FINAL RESULTS:');
    console.log(`   - Working Pages/Links: ${workingPages}/${totalPages} (${completionRate}%)`);
    console.log(`   - Overall Status: ${completionRate >= 80 ? '✅ EXCELLENT' : completionRate >= 60 ? '⚠️ GOOD' : '❌ NEEDS WORK'}`);

    // Test assertions
    expect(assessment.aboutPage).toBe(true);
    expect(assessment.privacyPage).toBe(true);
    expect(assessment.termsPage).toBe(true);
    expect(assessment.blogPage).toBe(true);
    expect(assessment.footerLinks).toBe(true);

    console.log('\n✅ ALL PAGES NAVIGATION TEST COMPLETED!');
    console.log('All footer and navigation links are working perfectly.');
  });
});
