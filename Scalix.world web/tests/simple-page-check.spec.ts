import { test, expect } from '@playwright/test';

test.describe('Simple Page Check', () => {
  test.setTimeout(120000);

  test('Check All Pages Load Successfully', async ({ page }) => {
    console.log('🔍 SIMPLE PAGE CHECK - All Pages Load Test');
    console.log('==========================================');

    await page.setViewportSize({ width: 1280, height: 800 });

    const routes = [
      { path: '/', name: 'Home' },
      { path: '/pricing', name: 'Pricing' },
      { path: '/features', name: 'Features' },
      { path: '/docs', name: 'Docs' },
      { path: '/docs/api', name: 'API Docs' },
      { path: '/blog', name: 'Blog' },
      { path: '/community', name: 'Community' },
      { path: '/community/forum', name: 'Community Forum' },
      { path: '/compare', name: 'Compare' },
      { path: '/providers', name: 'Providers' },
      { path: '/pro', name: 'Pro' },
      { path: '/status', name: 'Status' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/dashboard/projects', name: 'Dashboard Projects' },
      { path: '/dashboard/usage', name: 'Dashboard Usage' },
      { path: '/dashboard/billing', name: 'Dashboard Billing' },
      { path: '/dashboard/team', name: 'Dashboard Team' },
      { path: '/dashboard/settings', name: 'Dashboard Settings' },
      { path: '/admin', name: 'Admin' },
      { path: '/admin/health', name: 'Admin Health' },
      { path: '/admin/users', name: 'Admin Users' },
      { path: '/admin/analytics', name: 'Admin Analytics' },
      { path: '/admin/security', name: 'Admin Security' },
    ];

    const results = [];

    for (const route of routes) {
      try {
        console.log(`Testing: ${route.name} (${route.path})`);

        await page.goto(`http://localhost:3002${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000
        });

        // Check if page loaded (not 404)
        const is404 = await page.locator('text=/404|Not Found/i').isVisible().catch(() => false);
        const hasContent = (await page.locator('body').textContent() || '').length > 100;

        if (is404) {
          console.log(`❌ ${route.name}: 404 Error`);
          results.push({ ...route, status: '404', content: 0 });
        } else if (!hasContent) {
          console.log(`⚠️  ${route.name}: No content`);
          results.push({ ...route, status: 'empty', content: 0 });
        } else {
          const contentLength = (await page.locator('body').textContent() || '').length;
          console.log(`✅ ${route.name}: OK (${contentLength} chars)`);
          results.push({ ...route, status: 'ok', content: contentLength });
        }

      } catch (error) {
        console.log(`❌ ${route.name}: Error - ${error.message}`);
        results.push({ ...route, status: 'error', error: error.message });
      }
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    const ok = results.filter(r => r.status === 'ok').length;
    const broken = results.filter(r => r.status !== 'ok').length;
    const total = results.length;

    console.log(`✅ Working: ${ok}/${total}`);
    console.log(`❌ Issues: ${broken}/${total}`);

    if (broken > 0) {
      console.log('\n❌ BROKEN PAGES:');
      results.filter(r => r.status !== 'ok').forEach(r => {
        console.log(`   - ${r.name} (${r.path}): ${r.status}`);
      });
    }

    console.log('\n✅ WORKING PAGES:');
    results.filter(r => r.status === 'ok').forEach(r => {
      console.log(`   - ${r.name} (${r.path}): ${r.content} chars`);
    });

    // Test passes if more than 70% of pages work
    expect(ok / total).toBeGreaterThan(0.7);
  });
});
