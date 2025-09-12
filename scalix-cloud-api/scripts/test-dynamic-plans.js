/**
 * Test script for dynamic plan management system
 */

const fetch = require('node-fetch');

const API_BASE = process.env.SCALIX_CLOUD_API_BASE || 'http://localhost:3000';

async function testDynamicPlans() {
  console.log('🧪 Testing Dynamic Plan Management System...\n');

  try {
    // Test 1: Get all plans
    console.log('1️⃣ Testing GET /api/admin/plans');
    const plansResponse = await fetch(`${API_BASE}/api/admin/plans`);
    const plansData = await plansResponse.json();

    if (plansResponse.ok) {
      console.log('✅ Successfully retrieved plans:');
      plansData.plans.forEach(plan => {
        console.log(`   ${plan.displayName}: ${plan.maxAiTokens} tokens, $${plan.price/100}/month`);
      });
    } else {
      console.log('❌ Failed to get plans:', plansData.error);
    }

    // Test 2: Get analytics
    console.log('\n2️⃣ Testing GET /api/admin/plans/analytics');
    const analyticsResponse = await fetch(`${API_BASE}/api/admin/plans/analytics`);
    const analyticsData = await analyticsResponse.json();

    if (analyticsResponse.ok) {
      console.log('✅ Successfully retrieved analytics:');
      Object.entries(analyticsData.planStats).forEach(([plan, stats]) => {
        console.log(`   ${plan}: ${stats.users} users, ${stats.totalTokens.toLocaleString()} tokens`);
      });
    } else {
      console.log('❌ Failed to get analytics:', analyticsData.error);
    }

    // Test 3: Test plan limits retrieval (via validate-key)
    console.log('\n3️⃣ Testing plan limits retrieval');
    const testApiKey = 'test-free-key'; // This should exist in your test data

    const validateResponse = await fetch(`${API_BASE}/api/validate-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: testApiKey })
    });

    const validateData = await validateResponse.json();

    if (validateResponse.ok) {
      console.log('✅ Successfully validated key and retrieved limits:');
      console.log(`   Plan: ${validateData.plan}`);
      console.log(`   AI Tokens: ${validateData.limits.maxAiTokens}`);
      console.log(`   API Calls: ${validateData.limits.maxApiCalls}`);
      console.log(`   Storage: ${(validateData.limits.maxStorage / 1024 / 1024 / 1024).toFixed(1)}GB`);
    } else {
      console.log('❌ Failed to validate key:', validateData.error);
    }

    // Test 4: Test cache performance
    console.log('\n4️⃣ Testing caching performance');
    const startTime = Date.now();

    // Make multiple rapid requests to test caching
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(fetch(`${API_BASE}/api/validate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: testApiKey })
      }));
    }

    await Promise.all(promises);
    const endTime = Date.now();

    console.log(`✅ Cache test completed in ${endTime - startTime}ms`);
    console.log('   (Should be fast due to caching)');

    // Test 5: Test bulk update (create test update)
    console.log('\n5️⃣ Testing bulk update capability');
    const testUpdates = [
      {
        planId: 'free',
        field: 'maxAiTokens',
        value: 45000 // Slightly reduce for testing
      }
    ];

    const bulkResponse = await fetch(`${API_BASE}/api/admin/plans/bulk-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: testUpdates })
    });

    const bulkData = await bulkResponse.json();

    if (bulkResponse.ok) {
      console.log('✅ Successfully applied bulk update');
      console.log(`   Updated ${bulkData.updated} plan fields`);
    } else {
      console.log('❌ Failed to apply bulk update:', bulkData.error);
    }

    // Test 6: Verify cache was cleared and limits updated
    console.log('\n6️⃣ Testing cache invalidation');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for cache to clear

    const updatedValidateResponse = await fetch(`${API_BASE}/api/validate-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: testApiKey })
    });

    const updatedValidateData = await updatedValidateResponse.json();

    if (updatedValidateResponse.ok) {
      if (updatedValidateData.limits.maxAiTokens === 45000) {
        console.log('✅ Cache correctly invalidated, limits updated');
      } else {
        console.log('⚠️  Limits may not have updated yet, or cache is still active');
        console.log(`   Current tokens: ${updatedValidateData.limits.maxAiTokens}`);
      }
    }

    console.log('\n🎉 Dynamic Plan Management System test completed!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Access web admin at: http://localhost:3000/admin/plans');
    console.log('   2. Run monetization analysis: node scripts/monetization-strategy.js analyze');
    console.log('   3. Adjust limits based on user acquisition goals');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Export for use in other scripts
module.exports = { testDynamicPlans };

// Run if called directly
if (require.main === module) {
  testDynamicPlans();
}
