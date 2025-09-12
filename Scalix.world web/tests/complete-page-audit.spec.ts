import { test, expect } from '@playwright/test';

test.describe('Complete Scalix Page Audit', () => {
  test.setTimeout(300000); // 5 minutes timeout

  test('Comprehensive Page Structure and Content Audit', async ({ page, browser }) => {
    console.log('🔍 STARTING COMPLETE SCALIX PAGE AUDIT');
    console.log('=====================================');

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 800 });

    // Navigate to the application
    console.log('📱 Opening Scalix Application...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('✅ Application loaded successfully');

    // === DISCOVER ALL AVAILABLE ROUTES ===
    console.log('\n🔍 DISCOVERING ALL AVAILABLE ROUTES...');

    // Define all expected routes based on file structure
    const expectedRoutes = [
      // Main pages
      { path: '/', name: 'Home/Landing Page' },
      { path: '/pricing', name: 'Pricing' },
      { path: '/features', name: 'Features' },
      { path: '/docs', name: 'Documentation' },
      { path: '/docs/api', name: 'API Documentation' },
      { path: '/blog', name: 'Blog' },
      { path: '/community', name: 'Community' },
      { path: '/community/forum', name: 'Community Forum' },
      { path: '/compare', name: 'Compare' },
      { path: '/providers', name: 'Providers' },
      { path: '/pro', name: 'Pro Mode' },
      { path: '/status', name: 'Status' },

      // Dashboard pages
      { path: '/dashboard', name: 'Dashboard Home' },
      { path: '/dashboard/projects', name: 'Dashboard Projects' },
      { path: '/dashboard/usage', name: 'Dashboard Usage' },
      { path: '/dashboard/billing', name: 'Dashboard Billing' },
      { path: '/dashboard/team', name: 'Dashboard Team' },
      { path: '/dashboard/settings', name: 'Dashboard Settings' },

      // Admin pages
      { path: '/admin', name: 'Admin Dashboard' },
      { path: '/admin/health', name: 'Admin Health' },
      { path: '/admin/users', name: 'Admin Users' },
      { path: '/admin/analytics', name: 'Admin Analytics' },
      { path: '/admin/security', name: 'Admin Security' },
    ];

    console.log(`ℹ️ Found ${expectedRoutes.length} expected routes to test`);

    // === TEST EACH ROUTE ===
    const routeResults = [];
    const workingRoutes = [];
    const brokenRoutes = [];
    const duplicateContentRoutes = [];

    for (const route of expectedRoutes) {
      console.log(`\n🧪 Testing: ${route.name} (${route.path})`);

      try {
        // Navigate to the route
        await page.goto(`http://localhost:3002${route.path}`, { waitUntil: 'networkidle' });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Check if page loaded successfully
        const is404 = await page.locator('text=/404|Not Found|Page not found/i').isVisible();
        const hasContent = await page.locator('body').textContent();

        if (is404) {
          console.log(`❌ ${route.name}: 404 Page Not Found`);
          brokenRoutes.push(route);
          routeResults.push({
            ...route,
            status: '404',
            contentLength: 0,
            hasTitle: false,
            hasNavigation: false
          });
        } else {
          // Analyze page content
          const title = await page.title();
          const hasTitle = title && title !== '' && !title.includes('localhost');
          const hasNavigation = await page.locator('nav, [role="navigation"]').isVisible();
          const contentLength = hasContent ? hasContent.length : 0;

          console.log(`✅ ${route.name}: Loaded successfully`);
          console.log(`   📄 Title: ${title || 'No title'}`);
          console.log(`   📏 Content Length: ${contentLength} characters`);
          console.log(`   🧭 Navigation: ${hasNavigation ? 'Present' : 'Missing'}`);

          workingRoutes.push(route);
          routeResults.push({
            ...route,
            status: 'working',
            contentLength,
            hasTitle,
            hasNavigation,
            title
          });

          // Check for duplicate content indicators
          if (contentLength < 500) {
            console.log(`⚠️  ${route.name}: Very low content (${contentLength} chars) - possible placeholder`);
          }
        }

      } catch (error) {
        console.log(`❌ ${route.name}: Error loading - ${error.message}`);
        brokenRoutes.push(route);
        routeResults.push({
          ...route,
          status: 'error',
          error: error.message
        });
      }
    }

    // === NAVIGATION LINKS AUDIT ===
    console.log('\n🔗 ANALYZING NAVIGATION LINKS...');

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Get all navigation links
    const navLinks = await page.locator('nav a, [role="navigation"] a').all();
    console.log(`ℹ️ Found ${navLinks.length} navigation links`);

    const navLinkData = [];
    for (let i = 0; i < navLinks.length; i++) {
      try {
        const link = navLinks[i];
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const isVisible = await link.isVisible();

        if (href && text) {
          navLinkData.push({
            text: text.trim(),
            href,
            visible: isVisible
          });
        }
      } catch (error) {
        // Skip problematic links
      }
    }

    console.log('📋 Navigation Links Found:');
    navLinkData.forEach((link, index) => {
      console.log(`   ${index + 1}. "${link.text}" → ${link.href} (${link.visible ? 'visible' : 'hidden'})`);
    });

    // === COMPONENT ANALYSIS ===
    console.log('\n🧩 ANALYZING PAGE COMPONENTS...');

    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Analyze different types of components
    const componentAnalysis = {
      buttons: await page.locator('button, [role="button"]').count(),
      forms: await page.locator('form').count(),
      inputs: await page.locator('input, textarea, select').count(),
      headings: await page.locator('h1, h2, h3, h4, h5, h6').count(),
      links: await page.locator('a').count(),
      images: await page.locator('img').count(),
      cards: await page.locator('[class*="card"], [class*="Card"]').count(),
      modals: await page.locator('[role="dialog"], .modal, .Modal').count()
    };

    console.log('📊 Component Analysis (Landing Page):');
    Object.entries(componentAnalysis).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // === DASHBOARD ANALYSIS ===
    console.log('\n📊 ANALYZING DASHBOARD STRUCTURE...');

    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const dashboardComponents = {
      sidebar: await page.locator('[class*="sidebar"], [class*="Sidebar"]').count(),
      charts: await page.locator('[class*="chart"], [class*="Chart"], canvas').count(),
      metrics: await page.locator('[class*="metric"], [class*="Metric"], .stat, .metric').count(),
      tables: await page.locator('table').count(),
      actionButtons: await page.locator('button[class*="action"], button[class*="Action"]').count()
    };

    console.log('📊 Dashboard Component Analysis:');
    Object.entries(dashboardComponents).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // === IDENTIFY POTENTIAL ISSUES ===
    console.log('\n🚨 IDENTIFYING POTENTIAL ISSUES...');

    // Check for duplicate routes
    const routePaths = expectedRoutes.map(r => r.path);
    const duplicatePaths = routePaths.filter((path, index) => routePaths.indexOf(path) !== index);

    if (duplicatePaths.length > 0) {
      console.log('⚠️ Duplicate route paths found:');
      duplicatePaths.forEach(path => console.log(`   - ${path}`));
    } else {
      console.log('✅ No duplicate route paths found');
    }

    // Check for empty pages
    const emptyPages = routeResults.filter(r => r.status === 'working' && r.contentLength < 500);
    if (emptyPages.length > 0) {
      console.log('⚠️ Potentially empty/placeholder pages:');
      emptyPages.forEach(page => console.log(`   - ${page.name}: ${page.contentLength} chars`));
    }

    // Check for pages without proper titles
    const pagesWithoutTitles = routeResults.filter(r => r.status === 'working' && !r.hasTitle);
    if (pagesWithoutTitles.length > 0) {
      console.log('⚠️ Pages without proper titles:');
      pagesWithoutTitles.forEach(page => console.log(`   - ${page.name}`));
    }

    // === COMPREHENSIVE SUMMARY ===
    console.log('\n🎉 AUDIT COMPLETE - COMPREHENSIVE SUMMARY');
    console.log('========================================');

    console.log(`📊 Total Routes Tested: ${expectedRoutes.length}`);
    console.log(`✅ Working Routes: ${workingRoutes.length}`);
    console.log(`❌ Broken/Missing Routes: ${brokenRoutes.length}`);
    console.log(`⚠️ Low Content Pages: ${emptyPages.length}`);
    console.log(`🔗 Navigation Links: ${navLinks.length}`);
    console.log(`🧩 Components Analyzed: ${Object.values(componentAnalysis).reduce((a, b) => a + b, 0)}`);

    console.log('\n📋 WORKING ROUTES:');
    workingRoutes.forEach(route => {
      console.log(`   ✅ ${route.name} (${route.path})`);
    });

    if (brokenRoutes.length > 0) {
      console.log('\n❌ BROKEN/MISSING ROUTES:');
      brokenRoutes.forEach(route => {
        console.log(`   ❌ ${route.name} (${route.path})`);
      });
    }

    // === RECOMMENDATIONS ===
    console.log('\n💡 RECOMMENDATIONS FOR CLEANUP:');

    if (brokenRoutes.length > 0) {
      console.log('1. 🗑️ Remove or implement missing routes:');
      brokenRoutes.forEach(route => {
        console.log(`   - ${route.path} (${route.name})`);
      });
    }

    if (emptyPages.length > 0) {
      console.log('2. 📝 Add content to placeholder pages:');
      emptyPages.forEach(page => {
        console.log(`   - ${page.name} (${page.contentLength} chars)`);
      });
    }

    if (pagesWithoutTitles.length > 0) {
      console.log('3. 🏷️ Add proper titles to pages:');
      pagesWithoutTitles.forEach(page => {
        console.log(`   - ${page.name}`);
      });
    }

    // Take screenshots for documentation
    await page.screenshot({ path: 'test-results/audit-landing-page.png', fullPage: true });
    await page.goto('http://localhost:3002/dashboard');
    await page.screenshot({ path: 'test-results/audit-dashboard.png', fullPage: true });

    console.log('\n📸 Screenshots saved for documentation');
    console.log('   - test-results/audit-landing-page.png');
    console.log('   - test-results/audit-dashboard.png');

    // Final assertion
    expect(workingRoutes.length).toBeGreaterThan(0);
    expect(brokenRoutes.length).toBeLessThan(expectedRoutes.length * 0.5); // Less than 50% broken

    console.log('\n🎯 AUDIT COMPLETED SUCCESSFULLY');
  });
});
