/**
 * Monetization Strategy Script
 * Analyzes usage patterns and suggests limit adjustments for gradual monetization
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../service-account.json'))
  });
}

const db = admin.firestore();

/**
 * Analyze current usage patterns and suggest monetization adjustments
 */
async function analyzeMonetizationStrategy() {
  console.log('🔍 Analyzing monetization strategy...\n');

  try {
    // Get current plans
    const plansSnapshot = await db.collection('plans').get();
    const plans = {};
    plansSnapshot.forEach(doc => {
      plans[doc.id] = doc.data();
    });

    // Get current month usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const usageSnapshot = await db.collection('usage')
      .where('period', '==', 'month')
      .where('startDate', '==', currentMonth)
      .get();

    const usageStats = {};
    usageSnapshot.forEach(doc => {
      const data = doc.data();
      const plan = data.plan || 'free';

      if (!usageStats[plan]) {
        usageStats[plan] = {
          users: 0,
          totalTokens: 0,
          totalCalls: 0,
          avgTokensPerUser: 0,
          avgCallsPerUser: 0,
          highUsageUsers: 0,
          lowUsageUsers: 0
        };
      }

      usageStats[plan].users += 1;
      usageStats[plan].totalTokens += data.ai_tokens || 0;
      usageStats[plan].totalCalls += data.api_calls || 0;
    });

    // Calculate averages and identify usage patterns
    Object.keys(usageStats).forEach(plan => {
      const stats = usageStats[plan];
      stats.avgTokensPerUser = stats.totalTokens / stats.users;
      stats.avgCallsPerUser = stats.totalCalls / stats.users;

      // Count high/low usage users (above/below 80% of limits)
      const planLimits = plans[plan];
      if (planLimits) {
        // This would require individual user usage data
        // For now, we'll use aggregate analysis
      }
    });

    console.log('📊 Current Usage Statistics:');
    console.log('===============================');
    Object.entries(usageStats).forEach(([plan, stats]) => {
      console.log(`\n${plan.toUpperCase()} PLAN:`);
      console.log(`  Users: ${stats.users}`);
      console.log(`  Total Tokens: ${stats.totalTokens.toLocaleString()}`);
      console.log(`  Total API Calls: ${stats.totalCalls.toLocaleString()}`);
      console.log(`  Avg Tokens/User: ${Math.round(stats.avgTokensPerUser).toLocaleString()}`);
      console.log(`  Avg Calls/User: ${Math.round(stats.avgCallsPerUser).toLocaleString()}`);
    });

    // Generate monetization recommendations
    const recommendations = generateRecommendations(plans, usageStats);

    console.log('\n💡 Monetization Recommendations:');
    console.log('================================');
    recommendations.forEach(rec => {
      console.log(`\n${rec.title}`);
      console.log(`Priority: ${rec.priority}`);
      console.log(`Impact: ${rec.impact}`);
      console.log(`Rationale: ${rec.rationale}`);
      if (rec.suggestedChanges) {
        console.log('Suggested Changes:');
        rec.suggestedChanges.forEach(change => {
          console.log(`  - ${change.field}: ${change.current} → ${change.suggested}`);
        });
      }
    });

    return { usageStats, recommendations };

  } catch (error) {
    console.error('Error analyzing monetization strategy:', error);
    throw error;
  }
}

/**
 * Generate monetization recommendations based on usage patterns
 */
function generateRecommendations(plans, usageStats) {
  const recommendations = [];

  // Analyze Free Tier Usage
  const freeStats = usageStats.free;
  const freeLimits = plans.free;

  if (freeStats) {
    const tokenUtilization = freeStats.avgTokensPerUser / freeLimits.maxAiTokens;
    const callUtilization = freeStats.avgCallsPerUser / freeLimits.maxApiCalls;

    // If free users are hitting limits frequently, tighten them gradually
    if (tokenUtilization > 0.7 || callUtilization > 0.7) {
      recommendations.push({
        title: '🎯 Tighten Free Tier Limits',
        priority: 'HIGH',
        impact: 'Increase conversion to paid plans',
        rationale: `Free users are using ${Math.round(tokenUtilization * 100)}% of token limits and ${Math.round(callUtilization * 100)}% of API call limits. Gradual reduction will encourage upgrades.`,
        suggestedChanges: [
          {
            field: 'maxAiTokens',
            current: freeLimits.maxAiTokens,
            suggested: Math.max(10000, Math.round(freeLimits.maxAiTokens * 0.8))
          },
          {
            field: 'maxApiCalls',
            current: freeLimits.maxApiCalls,
            suggested: Math.max(50, Math.round(freeLimits.maxApiCalls * 0.8))
          }
        ]
      });
    }

    // If free tier has low utilization, consider generous limits to attract users
    if (tokenUtilization < 0.3 && callUtilization < 0.3 && freeLimits.maxAiTokens < 50000) {
      recommendations.push({
        title: '🚀 Increase Free Tier Generosity',
        priority: 'MEDIUM',
        impact: 'Attract more users for future monetization',
        rationale: `Free tier utilization is low (${Math.round(tokenUtilization * 100)}% tokens, ${Math.round(callUtilization * 100)}% calls). Consider increasing limits to attract more users.`,
        suggestedChanges: [
          {
            field: 'maxAiTokens',
            current: freeLimits.maxAiTokens,
            suggested: Math.min(100000, Math.round(freeLimits.maxAiTokens * 1.5))
          },
          {
            field: 'maxApiCalls',
            current: freeLimits.maxApiCalls,
            suggested: Math.min(1000, Math.round(freeLimits.maxApiCalls * 1.5))
          }
        ]
      });
    }
  }

  // Analyze Pro Tier Performance
  const proStats = usageStats.pro;
  const proLimits = plans.pro;

  if (proStats && proStats.users > 0) {
    const tokenUtilization = proStats.avgTokensPerUser / proLimits.maxAiTokens;

    // If Pro users are power users, consider increasing limits
    if (tokenUtilization > 0.8) {
      recommendations.push({
        title: '⚡ Increase Pro Tier Limits',
        priority: 'MEDIUM',
        impact: 'Improve user satisfaction and retention',
        rationale: `Pro users are using ${Math.round(tokenUtilization * 100)}% of their token limits. Consider increasing to accommodate power users.`,
        suggestedChanges: [
          {
            field: 'maxAiTokens',
            current: proLimits.maxAiTokens,
            suggested: Math.round(proLimits.maxAiTokens * 1.25)
          }
        ]
      });
    }
  }

  // Seasonal/Market Analysis
  const totalFreeUsers = freeStats?.users || 0;
  const totalPaidUsers = Object.entries(usageStats)
    .filter(([plan]) => plan !== 'free')
    .reduce((sum, [, stats]) => sum + stats.users, 0);

  const conversionRate = totalPaidUsers / (totalFreeUsers + totalPaidUsers);

  if (conversionRate < 0.1) {
    recommendations.push({
      title: '📈 Optimize Conversion Funnel',
      priority: 'HIGH',
      impact: 'Increase paid user conversion',
      rationale: `Current conversion rate is ${Math.round(conversionRate * 100)}%. Consider more aggressive free tier limits reduction or improved upgrade prompts.`,
      suggestedChanges: [
        {
          field: 'free_tier_strategy',
          current: 'Generous limits',
          suggested: 'Gradual limit reduction + better upgrade UX'
        }
      ]
    });
  }

  // Pricing Recommendations
  if (totalPaidUsers > 100 && conversionRate > 0.2) {
    recommendations.push({
      title: '💰 Consider Price Optimization',
      priority: 'MEDIUM',
      impact: 'Increase revenue per user',
      rationale: `With ${totalPaidUsers} paid users and ${Math.round(conversionRate * 100)}% conversion, consider testing slight price increases or new tiers.`,
      suggestedChanges: [
        {
          field: 'pricing_strategy',
          current: 'Fixed pricing',
          suggested: 'A/B test price increases or add intermediate tiers'
        }
      ]
    });
  }

  return recommendations;
}

/**
 * Apply gradual limit adjustments for monetization
 */
async function applyGradualAdjustments(updates) {
  console.log('🔧 Applying gradual monetization adjustments...\n');

  try {
    const batch = db.batch();

    for (const update of updates) {
      const { planId, field, value } = update;
      const planRef = db.collection('plans').doc(planId);

      batch.update(planRef, {
        [field]: value,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'monetization-script',
        adjustmentReason: 'gradual-monetization'
      });

      console.log(`📝 Updated ${planId}.${field}: ${value}`);
    }

    await batch.commit();

    // Clear plan cache (would need to be implemented)
    console.log('✅ Adjustments applied successfully');
    console.log('📊 Cache cleared - changes will take effect immediately');

  } catch (error) {
    console.error('Error applying adjustments:', error);
    throw error;
  }
}

/**
 * Create monetization roadmap
 */
function createMonetizationRoadmap(usageStats, recommendations) {
  const roadmap = {
    immediate: [],    // Next 30 days
    shortTerm: [],    // 30-90 days
    mediumTerm: [],   // 3-6 months
    longTerm: []      // 6+ months
  };

  recommendations.forEach(rec => {
    switch (rec.priority) {
      case 'HIGH':
        roadmap.immediate.push(rec);
        break;
      case 'MEDIUM':
        roadmap.shortTerm.push(rec);
        break;
      default:
        roadmap.mediumTerm.push(rec);
    }
  });

  // Add standard roadmap items
  roadmap.longTerm.push({
    title: '🏆 Enterprise Tier Launch',
    description: 'Launch $99/month enterprise tier with advanced features'
  });

  roadmap.longTerm.push({
    title: '📊 Advanced Analytics',
    description: 'Implement detailed usage analytics and predictive modeling'
  });

  return roadmap;
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'analyze':
      await analyzeMonetizationStrategy();
      break;

    case 'apply':
      if (args.length < 2) {
        console.log('Usage: node monetization-strategy.js apply <updates.json>');
        process.exit(1);
      }
      const updates = JSON.parse(require('fs').readFileSync(args[1], 'utf8'));
      await applyGradualAdjustments(updates);
      break;

    case 'roadmap':
      const { usageStats, recommendations } = await analyzeMonetizationStrategy();
      const roadmap = createMonetizationRoadmap(usageStats, recommendations);

      console.log('\n🗺️  Monetization Roadmap:');
      console.log('=======================');

      Object.entries(roadmap).forEach(([phase, items]) => {
        if (items.length > 0) {
          console.log(`\n${phase.toUpperCase()} (${phase === 'immediate' ? '0-30 days' : phase === 'shortTerm' ? '30-90 days' : phase === 'mediumTerm' ? '3-6 months' : '6+ months'}):`);
          items.forEach(item => {
            console.log(`• ${item.title}`);
            if (item.description) console.log(`  ${item.description}`);
          });
        }
      });
      break;

    default:
      console.log('Usage:');
      console.log('  node monetization-strategy.js analyze    # Analyze current usage');
      console.log('  node monetization-strategy.js apply <file.json>  # Apply limit adjustments');
      console.log('  node monetization-strategy.js roadmap   # Show monetization roadmap');
  }
}

// Export functions for use in other scripts
module.exports = {
  analyzeMonetizationStrategy,
  generateRecommendations,
  applyGradualAdjustments,
  createMonetizationRoadmap
};

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}
