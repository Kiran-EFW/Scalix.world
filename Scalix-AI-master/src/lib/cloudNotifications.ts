import { showSuccess, showError, showWarning, showInfo } from './toast';

/**
 * Cloud sync and subscription notification manager
 * Handles all user-facing notifications for cloud features
 */
export class CloudNotificationManager {
  // Sync-related notifications
  static notifySyncSuccess() {
    showSuccess('🔄 Cloud sync completed! Your Pro features are active.');
  }

  static notifySyncFailure(error?: string) {
    if (error?.includes('network')) {
      showWarning('🌐 Unable to sync with cloud. Working offline - features remain available.');
    } else if (error?.includes('auth')) {
      showError('🔐 Sync failed - please check your subscription status.');
    } else {
      showWarning('🔄 Sync temporarily unavailable. Will retry automatically.');
    }
  }

  static notifyOfflineMode() {
    showInfo('🔌 Offline mode activated. Your local features work normally.');
  }

  static notifyOnlineRestored() {
    showSuccess('🌐 Connection restored! Syncing your latest data...');
  }

  // Usage limit notifications
  static notifyUsageWarning(resource: string, percent: number) {
    const messages = {
      ai_tokens: `⚠️ AI token usage at ${percent}%. Consider upgrading to Pro for unlimited tokens.`,
      api_calls: `⚠️ API calls at ${percent}%. Pro plan offers 10x more capacity.`,
      storage: `⚠️ Storage usage at ${percent}%. Pro plan includes 10GB storage.`
    };

    showWarning(messages[resource as keyof typeof messages] ||
      `⚠️ ${resource} usage at ${percent}%. Upgrade for higher limits.`);
  }

  static notifyUsageLimit(resource: string, current: number, limit: number) {
    const messages = {
      ai_tokens: `🚨 AI token limit reached (${current}/${limit}). Upgrade to Pro for unlimited tokens!`,
      api_calls: `🚨 API call limit reached (${current}/${limit}). Pro plan offers 1,000 calls/hour.`,
      storage: `🚨 Storage limit reached (${current}/${limit}GB). Pro plan includes 10GB storage.`
    };

    showError(messages[resource as keyof typeof messages] ||
      `🚨 ${resource} limit reached. Upgrade required for continued use.`);
  }

  static notifyMonthlyReset() {
    showSuccess('🎉 Monthly usage reset! Fresh limits available for this month.');
  }

  // Subscription notifications
  static notifyPlanUpgrade(plan: string) {
    const messages = {
      pro: '🚀 Welcome to Scalix Pro! Unlimited AI tokens, priority support, and advanced features unlocked!',
      enterprise: '🏢 Welcome to Scalix Enterprise! All features unlocked with dedicated support!'
    };

    showSuccess(messages[plan as keyof typeof messages] ||
      `🚀 Successfully upgraded to ${plan} plan! All features unlocked.`);
  }

  static notifyPlanDowngrade() {
    showWarning('📉 Subscription ended. Switched to free plan. Upgrade anytime to restore Pro features.');
  }

  static notifyTrialEnding(daysLeft: number) {
    if (daysLeft <= 0) {
      showError('⏰ Trial ended. Upgrade to Pro to continue using advanced features.');
    } else if (daysLeft === 1) {
      showWarning('⏰ Trial ends tomorrow. Upgrade to Pro to keep your advanced features.');
    } else {
      showInfo(`⏰ Trial ends in ${daysLeft} days. Upgrade to Pro to avoid service interruption.`);
    }
  }

  // Feature-specific upgrade prompts
  static notifyAdvancedModelAccess() {
    showInfo('🤖 Want access to GPT-4, Claude 3 Opus, and other premium AI models? Upgrade to Pro!');
  }

  static notifyTeamCollaboration() {
    showInfo('👥 Collaborate with your team on Scalix projects. Upgrade to Pro for team features!');
  }

  static notifyPrioritySupport() {
    showInfo('💬 Need priority support? Pro subscribers get 24/7 priority assistance.');
  }

  static notifyTurboMode() {
    showInfo('⚡ Speed up your development with Turbo Edits. Available in Pro plan!');
  }

  static notifySmartContext() {
    showInfo('🧠 Reduce token usage by 80% with Smart Context. Pro feature!');
  }

  // Chat-specific notifications
  static notifyChatLimitReached(modelName: string) {
    showError(`🚨 ${modelName} usage limit reached. Upgrade to Pro for unlimited access to all AI models!`);
  }

  static notifyChatQuotaWarning(modelName: string, percent: number) {
    showWarning(`⚠️ ${modelName} usage at ${percent}%. Upgrade to Pro for unlimited access.`);
  }

  // Team upgrade prompts
  static notifyTeamLimitReached() {
    showError('👥 Team member limit reached. Upgrade to Enterprise for unlimited team members!');
  }

  static notifyProjectLimitReached() {
    showWarning('📁 Project limit reached. Pro plan allows 50+ projects. Enterprise allows unlimited.');
  }

  // Generic upgrade prompt
  static notifyUpgradePrompt(feature: string) {
    const prompts = {
      'advanced-ai': '🤖 Access premium AI models like GPT-4 and Claude 3 Opus with Pro!',
      'team-features': '👥 Share projects with your team. Pro plan supports up to 5 team members!',
      'unlimited-usage': '🚀 Remove all limits with Pro. Unlimited tokens, projects, and more!',
      'priority-support': '💬 Get 24/7 priority support with Pro subscribers!',
      'enterprise-features': '🏢 Need advanced security, SSO, or custom deployments? Try Enterprise!'
    };

    showInfo(prompts[feature as keyof typeof prompts] ||
      '🚀 Unlock more features with Scalix Pro or Enterprise!');
  }

  // Success notifications
  static notifyApiKeyActivated() {
    showSuccess('🎉 API key activated! Your Pro features are now available.');
  }

  static notifySubscriptionActivated(plan: string) {
    showSuccess(`🎊 ${plan} subscription activated! Welcome to the premium experience.`);
  }

  // Error recovery notifications
  static notifySyncRetry() {
    showInfo('🔄 Connection issue resolved. Resuming cloud sync...');
  }

  static notifyManualSyncRequired() {
    showWarning('🔄 Cloud sync failed. Click here to retry manually.');
  }
}

/**
 * Chat-specific upgrade notification system
 * Integrated into chat interface for contextual upgrade prompts
 */
export class ChatUpgradeNotifications {
  static showModelUpgradePrompt(modelName: string, context: string) {
    const modelPrompts = {
      'gpt-4': '🚀 GPT-4 delivers superior reasoning and creativity. Upgrade to Pro for unlimited access!',
      'claude-3-opus': '🧠 Claude 3 Opus provides exceptional analysis capabilities. Available in Pro!',
      'gemini-pro': '⚡ Google Gemini Pro offers fast, high-quality responses. Pro feature!',
      'default': `🤖 ${modelName} and other premium models available in Pro plan!`
    };

    const message = modelPrompts[modelName as keyof typeof modelPrompts] || modelPrompts.default;

    return {
      type: 'upgrade-prompt',
      message,
      action: 'upgrade',
      context: `model-${modelName}`,
      urgency: 'medium'
    };
  }

  static showUsageUpgradePrompt(resource: string, current: number, limit: number) {
    const prompts = {
      ai_tokens: `⚡ You've used ${current}/${limit} AI tokens this month. Pro offers unlimited tokens!`,
      api_calls: `🔄 ${current}/${limit} API calls this hour. Pro provides 10x more capacity!`,
      messages: `💬 Message limit reached (${current}/${limit}). Pro allows unlimited conversations!`
    };

    return {
      type: 'usage-limit',
      message: prompts[resource as keyof typeof prompts] || `Limit reached: ${current}/${limit}. Upgrade for more!`,
      action: 'upgrade',
      context: `usage-${resource}`,
      urgency: 'high'
    };
  }

  static showFeatureUpgradePrompt(feature: string) {
    const prompts = {
      'turbo-edits': '⚡ Make file edits 10x faster with Turbo Edits. Pro exclusive!',
      'smart-context': '🧠 Reduce token usage by 80% with Smart Context. Pro feature!',
      'team-share': '👥 Share this project with your team. Pro supports collaboration!',
      'export-project': '💾 Export your complete project. Available in Pro!',
      'advanced-settings': '⚙️ Access advanced AI settings and customizations. Pro feature!'
    };

    return {
      type: 'feature-locked',
      message: prompts[feature as keyof typeof prompts] || `🔒 ${feature} is a Pro feature. Upgrade to unlock!`,
      action: 'upgrade',
      context: `feature-${feature}`,
      urgency: 'medium'
    };
  }

  static showTrialUpgradePrompt(daysLeft: number) {
    const messages = {
      0: '⏰ Trial ended. Upgrade to Pro to continue using advanced features!',
      1: '⏰ Trial ends tomorrow. Upgrade to Pro to keep your progress!',
      default: `⏰ Trial ends in ${daysLeft} days. Upgrade to Pro for unlimited access!`
    };

    return {
      type: 'trial-ending',
      message: messages[daysLeft as keyof typeof messages] || messages.default,
      action: 'upgrade',
      context: 'trial-ending',
      urgency: daysLeft <= 1 ? 'high' : 'medium'
    };
  }

  static showTeamUpgradePrompt(feature: string) {
    const prompts = {
      'add-member': '👥 Add more team members to your workspace. Enterprise supports unlimited members!',
      'advanced-permissions': '🔐 Set custom permissions and roles. Available in Enterprise!',
      'audit-logs': '📊 Track team activity with audit logs. Enterprise feature!',
      'sso-integration': '🔑 Enable Single Sign-On for your team. Enterprise exclusive!',
      'priority-support': '💬 24/7 dedicated support for your team. Enterprise benefit!'
    };

    return {
      type: 'team-upgrade',
      message: prompts[feature as keyof typeof prompts] || `👥 ${feature} requires team plan. Upgrade to Enterprise!`,
      action: 'upgrade-team',
      context: `team-${feature}`,
      urgency: 'medium'
    };
  }
}

/**
 * Notification scheduling system
 * Prevents spam by managing notification frequency
 */
export class NotificationScheduler {
  private static lastNotifications = new Map<string, number>();
  private static readonly COOLDOWN_MS = {
    usage_warning: 5 * 60 * 1000,    // 5 minutes
    upgrade_prompt: 15 * 60 * 1000,  // 15 minutes
    sync_failure: 2 * 60 * 1000,     // 2 minutes
    trial_warning: 60 * 60 * 1000,   // 1 hour
    success: 30 * 1000               // 30 seconds
  };

  static canShowNotification(type: string): boolean {
    const lastShown = this.lastNotifications.get(type);
    const cooldown = this.COOLDOWN_MS[type as keyof typeof this.COOLDOWN_MS] || 60000;

    if (!lastShown) return true;

    return Date.now() - lastShown > cooldown;
  }

  static markNotificationShown(type: string) {
    this.lastNotifications.set(type, Date.now());
  }

  static resetCooldown(type: string) {
    this.lastNotifications.delete(type);
  }

  // Smart notification that respects cooldowns
  static showSmartNotification(type: string, notificationFn: () => void) {
    if (this.canShowNotification(type)) {
      notificationFn();
      this.markNotificationShown(type);
    }
  }
}

// Export convenience functions for easy use
export const notify = CloudNotificationManager;
export const chatNotify = ChatUpgradeNotifications;
export const schedule = NotificationScheduler;
