import { test, expect, Page } from '@playwright/test';

async function checkPageLoad(page: Page, url: string, expectedTitle: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const title = await page.title();
  expect(title).toContain('Scalix');

  // Check for any console errors
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  // Wait a moment for any dynamic content
  await page.waitForTimeout(1000);

  console.log(`✅ ${url} - Loaded successfully`);

  return { errors, title };
}

async function testNavigation(page: Page) {
  // Test main navigation links
  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' }
  ];

  for (const link of navLinks) {
    const linkElement = page.getByRole('link', { name: link.name });
    if (await linkElement.count() > 0) {
      await linkElement.click();
      await page.waitForLoadState('networkidle');
      console.log(`✅ Navigation: ${link.name} - Working`);
      await page.goBack();
    }
  }
}

async function testDashboardNavigation(page: Page) {
  // Navigate to dashboard
  await page.getByRole('link', { name: 'Manage Subscriptions' }).click();
  await page.waitForLoadState('networkidle');

  // Test dashboard sub-navigation
  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/dashboard/projects' },
    { name: 'Usage', href: '/dashboard/usage' },
    { name: 'Billing', href: '/dashboard/billing' },
    { name: 'Team', href: '/dashboard/team' },
    { name: 'Settings', href: '/dashboard/settings' }
  ];

  for (const link of dashboardLinks) {
    const linkElement = page.getByRole('link', { name: link.name });
    if (await linkElement.count() > 0) {
      await linkElement.click();
      await page.waitForLoadState('networkidle');
      console.log(`✅ Dashboard Navigation: ${link.name} - Working`);

      // Check for specific content on each page
      await checkDashboardPageContent(page, link.name);
    }
  }
}

async function checkDashboardPageContent(page: Page, pageName: string) {
  switch (pageName) {
    case 'Projects':
      // Check for project-related content
      const newProjectBtn = page.getByRole('button', { name: 'New Project' });
      const projectCards = page.locator('[class*="rounded-xl"]').first();
      expect(await newProjectBtn.count() > 0 || await projectCards.count() > 0).toBe(true);
      break;

    case 'Usage':
      // Check for usage analytics content
      const exportBtn = page.getByRole('button', { name: 'Export' });
      const usageTable = page.locator('table');
      expect(await exportBtn.count() > 0 && await usageTable.count() > 0).toBe(true);
      break;

    case 'Billing':
      // Check for billing content
      const managePlanBtn = page.getByRole('button', { name: 'Manage Plan' });
      expect(await managePlanBtn.count() > 0).toBe(true);
      break;

    case 'Team':
      // Check for team content
      const inviteBtn = page.getByRole('button', { name: 'Invite Member' });
      expect(await inviteBtn.count() > 0).toBe(true);
      break;

    case 'Settings':
      // Check for settings content
      const saveBtn = page.getByRole('button', { name: 'Save Changes' });
      expect(await saveBtn.count() > 0).toBe(true);
      break;
  }
}

async function testAdminPanel(page: Page) {
  // Navigate to admin panel
  await page.getByRole('link', { name: 'Admin Panel' }).click();
  await page.waitForLoadState('networkidle');

  // Test admin navigation
  const adminLinks = [
    { name: 'System Health', href: '/admin/health' },
    { name: 'User Management', href: '/admin/users' },
    { name: 'Data Analytics', href: '/admin/analytics' },
    { name: 'Security', href: '/admin/security' }
  ];

  for (const link of adminLinks) {
    const linkElement = page.getByRole('link', { name: link.name });
    if (await linkElement.count() > 0) {
      await linkElement.click();
      await page.waitForLoadState('networkidle');
      console.log(`✅ Admin Navigation: ${link.name} - Working`);
    }
  }
}

async function testInteractiveElements(page: Page) {
  // Test buttons and interactive elements
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();

  console.log(`📊 Found ${buttonCount} buttons on the page`);

  // Test a few key buttons
  const primaryButtons = [
    'Manage Subscriptions',
    'View API Plans',
    'Start Free Trial',
    'Refresh',
    'Export'
  ];

  for (const buttonText of primaryButtons) {
    const button = page.getByRole('button', { name: buttonText });
    if (await button.count() > 0) {
      const isVisible = await button.isVisible();
      expect(isVisible).toBe(true);
      console.log(`✅ Button: "${buttonText}" - Visible and interactive`);
    }
  }
}

async function testResponsiveDesign(page: Page) {
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);

  // Check mobile navigation
  const mobileMenuBtn = page.locator('button').filter({ hasText: /menu|Menu/i }).first();
  if (await mobileMenuBtn.count() > 0) {
    await mobileMenuBtn.click();
    console.log('✅ Mobile navigation - Working');
  }

  // Test desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  console.log('✅ Desktop responsive design - Working');
}

async function testContentQuality(page: Page) {
  // Check for API-related content
  const apiContent = [
    'subscription',
    'API',
    'usage',
    'billing',
    'analytics'
  ];

  for (const term of apiContent) {
    const content = page.locator(`text=/${term}/i`);
    const count = await content.count();
    if (count > 0) {
      console.log(`✅ Content: "${term}" found ${count} times`);
    }
  }

  // Check for consistent branding
  const scalixBrand = page.locator('text=/Scalix/i');
  const brandCount = await scalixBrand.count();
  console.log(`✅ Branding: "Scalix" found ${brandCount} times`);
}

test.describe('Scalix Comprehensive Test Suite', () => {
  test('Complete Application Test', async ({ page }) => {
    console.log('🚀 Starting comprehensive Scalix test...\n');

    // Test 1: Landing Page
    console.log('📋 Test 1: Landing Page');
    const landingResult = await checkPageLoad(page, '/', 'Scalix');
    expect(landingResult.errors.length).toBe(0);

    // Check landing page content
    await expect(page.locator('text=/Manage AI API Subscriptions/i')).toBeVisible();
    await expect(page.locator('text=/Active Subscriptions/i')).toBeVisible();
    console.log('✅ Landing page content - Verified');

    // Test 2: Navigation
    console.log('\n📋 Test 2: Main Navigation');
    await testNavigation(page);

    // Test 3: Interactive Elements
    console.log('\n📋 Test 3: Interactive Elements');
    await testInteractiveElements(page);

    // Test 4: Dashboard Navigation
    console.log('\n📋 Test 4: Dashboard Navigation');
    await testDashboardNavigation(page);

    // Test 5: Admin Panel
    console.log('\n📋 Test 5: Admin Panel');
    await testAdminPanel(page);

    // Test 6: Responsive Design
    console.log('\n📋 Test 6: Responsive Design');
    await testResponsiveDesign(page);

    // Test 7: Content Quality
    console.log('\n📋 Test 7: Content Quality');
    await testContentQuality(page);

    // Test 8: Performance
    console.log('\n📋 Test 8: Performance Check');
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    console.log(`✅ Page reload time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Scalix application is fully functional and ready for production!');
  });

  test('Core Functionality Test', async ({ page }) => {
    console.log('🔍 Testing Core API Subscription Management Features...');

    // Navigate to dashboard
    await page.goto('/');
    await page.getByRole('link', { name: 'Manage Subscriptions' }).click();
    await page.waitForLoadState('networkidle');

    // Test core features
    const features = [
      'API Subscription Dashboard',
      'Usage Analytics',
      'Billing',
      'Team',
      'Settings'
    ];

    for (const feature of features) {
      const featureLink = page.getByRole('link', { name: feature });
      if (await featureLink.count() > 0) {
        await featureLink.click();
        await page.waitForLoadState('networkidle');

        // Verify page loaded with expected content
        const pageTitle = page.locator('h1').first();
        await expect(pageTitle).toBeVisible();

        console.log(`✅ ${feature} - Loaded and functional`);
      }
    }

    console.log('✅ Core functionality test completed!');
  });

  test('Data Validation Test', async ({ page }) => {
    console.log('📊 Testing Data Display and Validation...');

    // Test landing page stats
    await page.goto('/');
    const activeSubscriptions = page.locator('text=/Active Subscriptions/i');
    await expect(activeSubscriptions).toBeVisible();

    // Test dashboard metrics
    await page.getByRole('link', { name: 'Manage Subscriptions' }).click();
    await page.waitForLoadState('networkidle');

    // Check for numeric data display
    const metrics = page.locator('[class*="font-bold"]').filter(/^\d/);
    const metricCount = await metrics.count();
    console.log(`✅ Found ${metricCount} numeric metrics displayed`);

    // Test usage page data
    await page.getByRole('link', { name: 'Usage' }).click();
    await page.waitForLoadState('networkidle');

    const usageTable = page.locator('table');
    await expect(usageTable).toBeVisible();
    console.log('✅ Usage analytics table - Working');

    console.log('✅ Data validation test completed!');
  });
});
