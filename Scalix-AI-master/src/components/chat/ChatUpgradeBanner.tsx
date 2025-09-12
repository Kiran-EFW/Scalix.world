import { useState, useEffect } from "react";
import { X, Sparkles, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IpcClient } from "@/ipc/ipc_client";
import { chatNotify, schedule } from "@/lib/cloudNotifications";

interface ChatUpgradeBannerProps {
  type: 'model' | 'usage' | 'feature' | 'trial' | 'team';
  context?: string;
  modelName?: string;
  feature?: string;
  current?: number;
  limit?: number;
  daysLeft?: number;
  onDismiss?: () => void;
}

export function ChatUpgradeBanner({
  type,
  context,
  modelName,
  feature,
  current,
  limit,
  daysLeft,
  onDismiss
}: ChatUpgradeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-show upgrade notifications based on type
  useEffect(() => {
    if (!hasInteracted) {
      const showNotification = () => {
        switch (type) {
          case 'model':
            schedule.showSmartNotification('upgrade_prompt', () => {
              chatNotify.showModelUpgradePrompt(modelName || 'premium', context || '');
            });
            break;
          case 'usage':
            schedule.showSmartNotification('usage_limit', () => {
              chatNotify.showUsageUpgradePrompt(context || 'ai_tokens', current || 0, limit || 0);
            });
            break;
          case 'feature':
            schedule.showSmartNotification('upgrade_prompt', () => {
              chatNotify.showFeatureUpgradePrompt(feature || 'advanced');
            });
            break;
          case 'trial':
            schedule.showSmartNotification('trial_warning', () => {
              chatNotify.showTrialUpgradePrompt(daysLeft || 7);
            });
            break;
          case 'team':
            schedule.showSmartNotification('upgrade_prompt', () => {
              chatNotify.showTeamUpgradePrompt(feature || 'collaboration');
            });
            break;
        }
      };

      // Show notification after a brief delay
      const timer = setTimeout(showNotification, 1000);
      return () => clearTimeout(timer);
    }
  }, [type, modelName, feature, current, limit, daysLeft, context, hasInteracted]);

  const handleUpgrade = () => {
    setHasInteracted(true);
    IpcClient.getInstance().openExternalUrl("https://scalix.world/pro");
  };

  const handleTeamUpgrade = () => {
    setHasInteracted(true);
    IpcClient.getInstance().openExternalUrl("https://scalix.world/enterprise");
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getBannerContent = () => {
    switch (type) {
      case 'model':
        return {
          icon: <Sparkles className="h-5 w-5 text-purple-400" />,
          title: "Unlock Premium AI Models",
          message: `${modelName} and other advanced AI models are available with Scalix Pro. Get unlimited access to GPT-4, Claude 3 Opus, and more!`,
          buttonText: "Upgrade to Pro",
          buttonAction: handleUpgrade,
          bgColor: "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
          borderColor: "border-purple-500/20"
        };

      case 'usage':
        return {
          icon: <Crown className="h-5 w-5 text-yellow-400" />,
          title: "Usage Limit Reached",
          message: `You've used ${current}/${limit} ${context?.replace('_', ' ') || 'resources'} this period. Pro offers unlimited usage!`,
          buttonText: "Upgrade to Pro",
          buttonAction: handleUpgrade,
          bgColor: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10",
          borderColor: "border-yellow-500/20"
        };

      case 'feature':
        return {
          icon: <Sparkles className="h-5 w-5 text-green-400" />,
          title: "Pro Feature Available",
          message: `${feature?.replace('-', ' ')} is a Pro exclusive feature. Unlock advanced capabilities with your upgrade!`,
          buttonText: "Upgrade to Pro",
          buttonAction: handleUpgrade,
          bgColor: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
          borderColor: "border-green-500/20"
        };

      case 'trial':
        const urgency = (daysLeft || 0) <= 1 ? 'high' : 'medium';
        return {
          icon: <Crown className="h-5 w-5 text-red-400" />,
          title: daysLeft === 0 ? "Trial Ended" : `Trial Ends Soon`,
          message: daysLeft === 0
            ? "Your trial has ended. Upgrade to Pro to continue using advanced features!"
            : `Your trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Upgrade now to keep your progress!`,
          buttonText: "Upgrade to Pro",
          buttonAction: handleUpgrade,
          bgColor: urgency === 'high'
            ? "bg-gradient-to-r from-red-500/10 to-pink-500/10"
            : "bg-gradient-to-r from-orange-500/10 to-yellow-500/10",
          borderColor: urgency === 'high'
            ? "border-red-500/20"
            : "border-orange-500/20"
        };

      case 'team':
        return {
          icon: <Users className="h-5 w-5 text-indigo-400" />,
          title: "Team Collaboration Available",
          message: `${feature?.replace('-', ' ')} requires team collaboration features. Upgrade to Enterprise for unlimited team members!`,
          buttonText: "Upgrade to Enterprise",
          buttonAction: handleTeamUpgrade,
          bgColor: "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
          borderColor: "border-indigo-500/20"
        };

      default:
        return {
          icon: <Sparkles className="h-5 w-5 text-blue-400" />,
          title: "Unlock More Features",
          message: "Upgrade to Scalix Pro for unlimited AI tokens, premium models, and advanced features!",
          buttonText: "Upgrade Now",
          buttonAction: handleUpgrade,
          bgColor: "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
          borderColor: "border-blue-500/20"
        };
    }
  };

  const content = getBannerContent();

  return (
    <div className={`relative mx-4 mb-4 rounded-lg border p-4 shadow-sm ${content.bgColor} ${content.borderColor}`}>
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="h-4 w-4 text-gray-400 hover:text-white" />
      </button>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {content.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm mb-1">
            {content.title}
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {content.message}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={content.buttonAction}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50"
            >
              {content.buttonText}
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manage upgrade banner state
export function useChatUpgradeBanner() {
  const [bannerState, setBannerState] = useState<{
    show: boolean;
    type: ChatUpgradeBannerProps['type'];
    props?: Partial<ChatUpgradeBannerProps>;
  }>({ show: false, type: 'model' });

  const showBanner = (type: ChatUpgradeBannerProps['type'], props?: Partial<ChatUpgradeBannerProps>) => {
    setBannerState({ show: true, type, props });
  };

  const hideBanner = () => {
    setBannerState({ show: false, type: 'model' });
  };

  const BannerComponent = bannerState.show ? (
    <ChatUpgradeBanner
      type={bannerState.type}
      {...bannerState.props}
      onDismiss={hideBanner}
    />
  ) : null;

  return { showBanner, hideBanner, BannerComponent };
}
