import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Info, Cloud, CloudOff, Wifi, WifiOff, BarChart3 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { IpcClient } from "@/ipc/ipc_client";
import { hasScalixProKey, type UserSettings } from "@/lib/schemas";
import { useState, useEffect } from "react";
import { getUsageSummaryFromCloud, CLOUD_API_BASE } from "@/ipc/utils/scalix_auth";
import { notify, schedule } from "@/lib/cloudNotifications";

export function ProModeSelector() {
  const { settings, updateSettings } = useSettings();
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('checking');
  const [usageSummary, setUsageSummary] = useState<any>(null);
  const [showUsage, setShowUsage] = useState(false);

  // Check cloud connectivity with smart notifications
  useEffect(() => {
    let wasOnline = false;

    const checkCloudStatus = async () => {
      const previousStatus = cloudStatus;

      try {
        const response = await fetch(`${CLOUD_API_BASE}/health`, {
          signal: AbortSignal.timeout(5000)
        });

        const isOnline = response.ok;
        setCloudStatus(isOnline ? 'online' : 'offline');

        // Smart notifications based on status changes
        if (isOnline && !wasOnline) {
          schedule.showSmartNotification('sync_success', () => {
            if (previousStatus === 'offline') {
              notify.notifyOnlineRestored();
            }
          });
          wasOnline = true;
        } else if (!isOnline && wasOnline) {
          schedule.showSmartNotification('sync_failure', () => {
            notify.notifySyncFailure('network');
          });
          wasOnline = false;
        }

      } catch {
        setCloudStatus('offline');
        if (wasOnline) {
          schedule.showSmartNotification('sync_failure', () => {
            notify.notifySyncFailure('network');
          });
          wasOnline = false;
        }
      }
    };

    checkCloudStatus();
    const interval = setInterval(checkCloudStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [cloudStatus]);

  // Load usage summary when cloud is online and we have a Pro key
  useEffect(() => {
    const loadUsageSummary = async () => {
      if (cloudStatus !== 'online' || !hasProKey || !settings?.enableScalixPro) {
        return;
      }

      const apiKey = settings.providerSettings?.auto?.apiKey?.value;
      if (!apiKey) return;

      try {
        setCloudStatus('syncing');
        const summary = await getUsageSummaryFromCloud(apiKey);
        if (summary) {
          setUsageSummary(summary);

          // Check usage thresholds and show notifications
          checkUsageThresholds(summary);

          // Update local settings with cloud data
          updateSettings({
            proFeatures: {
              ...settings.proFeatures,
              usageLimits: summary.limits,
              currentPlan: summary.limits ? 'pro' : 'free', // Simple mapping
              lastValidated: new Date().toISOString()
            }
          });

          // Show sync success notification
          schedule.showSmartNotification('sync_success', () => {
            notify.notifySyncSuccess();
          });
        }
      } catch (error) {
        console.warn('Failed to load usage summary:', error);
        schedule.showSmartNotification('sync_failure', () => {
          notify.notifySyncFailure(error.message);
        });
      } finally {
        setCloudStatus('online');
      }
    };

    loadUsageSummary();
  }, [cloudStatus, settings?.enableScalixPro]);

  // Check usage thresholds and show appropriate notifications
  const checkUsageThresholds = (summary: any) => {
    if (!summary?.currentMonth || !summary?.limits) return;

    const { currentMonth, limits } = summary;

    // Check AI tokens
    const aiTokensPercent = limits.maxAiTokens > 0 ? (currentMonth.ai_tokens / limits.maxAiTokens) * 100 : 0;
    if (aiTokensPercent >= 95) {
      schedule.showSmartNotification('usage_limit', () => {
        notify.notifyUsageLimit('ai_tokens', currentMonth.ai_tokens, limits.maxAiTokens);
      });
    } else if (aiTokensPercent >= 80) {
      schedule.showSmartNotification('usage_warning', () => {
        notify.notifyUsageWarning('ai_tokens', Math.round(aiTokensPercent));
      });
    }

    // Check API calls
    const apiCallsPercent = limits.maxApiCalls > 0 ? (currentMonth.api_calls / limits.maxApiCalls) * 100 : 0;
    if (apiCallsPercent >= 90) {
      schedule.showSmartNotification('usage_limit', () => {
        notify.notifyUsageLimit('api_calls', currentMonth.api_calls, limits.maxApiCalls);
      });
    } else if (apiCallsPercent >= 70) {
      schedule.showSmartNotification('usage_warning', () => {
        notify.notifyUsageWarning('api_calls', Math.round(apiCallsPercent));
      });
    }
  };

  const toggleLazyEdits = () => {
    updateSettings({
      enableProLazyEditsMode: !settings?.enableProLazyEditsMode,
    });
  };

  const handleSmartContextChange = (
    newValue: "off" | "conservative" | "balanced",
  ) => {
    if (newValue === "off") {
      updateSettings({
        enableProSmartFilesContextMode: false,
        proSmartContextOption: undefined,
      });
    } else if (newValue === "conservative") {
      updateSettings({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: undefined, // Conservative is the default when enabled but no option set
      });
    } else if (newValue === "balanced") {
      updateSettings({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: "balanced",
      });
    }
  };

  const toggleProEnabled = () => {
    updateSettings({
      enableScalixPro: !settings?.enableScalixPro,
    });
  };

  const hasProKey = settings ? hasScalixProKey(settings) : false;
  const proModeTogglable = hasProKey && Boolean(settings?.enableScalixPro);

  // Cloud status icon
  const getCloudIcon = () => {
    switch (cloudStatus) {
      case 'online':
        return <Cloud className="h-3 w-3 text-green-500" />;
      case 'offline':
        return <CloudOff className="h-3 w-3 text-gray-400" />;
      case 'syncing':
        return <Wifi className="h-3 w-3 text-blue-500 animate-pulse" />;
      default:
        return <WifiOff className="h-3 w-3 text-gray-400" />;
    }
  };

  const getCloudTooltip = () => {
    switch (cloudStatus) {
      case 'online':
        return 'Cloud services online';
      case 'offline':
        return 'Cloud services offline - working locally';
      case 'syncing':
        return 'Syncing with cloud...';
      default:
        return 'Checking cloud status...';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Cloud Status Indicator */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {getCloudIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent>{getCloudTooltip()}</TooltipContent>
      </Tooltip>

      {/* Usage Button (only show if we have usage data) */}
      {usageSummary && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowUsage(!showUsage)}
            >
              <BarChart3 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            AI Tokens: {usageSummary.currentMonth?.ai_tokens || 0} / {usageSummary.limits?.maxAiTokens || 0}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Main Pro Button */}
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="has-[>svg]:px-1.5 flex items-center gap-1.5 h-8 border-primary/50 hover:bg-primary/10 font-medium shadow-sm shadow-primary/10 transition-all hover:shadow-md hover:shadow-primary/15"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium text-xs-sm">Pro</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Configure Scalix Pro settings</TooltipContent>
        </Tooltip>
      <PopoverContent className="w-80 border-primary/20">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Scalix Pro</span>
            </h4>
            <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
          </div>
          {!hasProKey && (
            <div className="text-sm text-center text-muted-foreground">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => {
                  IpcClient.getInstance().openExternalUrl(
                    "https://scalix.world/pro#ai",
                  );
                }}
              >
                Unlock Pro modes
              </a>
            </div>
          )}
          <div className="flex flex-col gap-5">
            <SelectorRow
              id="pro-enabled"
              label="Enable Scalix Pro"
              description="Use Scalix Pro AI credits"
              tooltip="Uses Scalix Pro AI credits for the main AI model and Pro modes."
              isTogglable={hasProKey}
              settingEnabled={Boolean(settings?.enableScalixPro)}
              toggle={toggleProEnabled}
            />
            <SelectorRow
              id="lazy-edits"
              label="Turbo Edits"
              description="Makes file edits faster and cheaper"
              tooltip="Uses a faster, cheaper model to generate full file updates."
              isTogglable={proModeTogglable}
              settingEnabled={Boolean(settings?.enableProLazyEditsMode)}
              toggle={toggleLazyEdits}
            />
            <SmartContextSelector
              isTogglable={proModeTogglable}
              settings={settings}
              onValueChange={handleSmartContextChange}
            />

            {/* Usage Summary Section */}
            {usageSummary && (
              <div className="border-t pt-4 mt-4">
                <h5 className="font-medium text-sm mb-3 flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Usage This Month
                </h5>
                <div className="space-y-2">
                  <UsageBar
                    label="AI Tokens"
                    used={usageSummary.currentMonth?.ai_tokens || 0}
                    limit={usageSummary.limits?.maxAiTokens || 0}
                    color="blue"
                  />
                  <UsageBar
                    label="API Calls"
                    used={usageSummary.currentMonth?.api_calls || 0}
                    limit={usageSummary.limits?.maxApiCalls || 0}
                    color="green"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Plan: {settings?.proFeatures?.currentPlan || 'Free'} •
                  Last sync: {settings?.proFeatures?.lastValidated ?
                    new Date(settings.proFeatures.lastValidated).toLocaleDateString() :
                    'Never'}
                </div>
              </div>
            )}

            {/* Cloud Settings */}
            <div className="border-t pt-4 mt-4">
              <h5 className="font-medium text-sm mb-3">Cloud Settings</h5>
              <div className="space-y-3">
                <SelectorRow
                  id="cloud-sync"
                  label="Cloud Sync"
                  description="Sync usage and settings with cloud"
                  tooltip="Automatically sync your usage data and settings with Scalix cloud services."
                  isTogglable={true}
                  settingEnabled={Boolean(settings?.cloudSyncEnabled)}
                  toggle={() => updateSettings({
                    cloudSyncEnabled: !settings?.cloudSyncEnabled
                  })}
                />
                <SelectorRow
                  id="offline-mode"
                  label="Offline Mode"
                  description="Work without internet connectivity"
                  tooltip="Disable cloud features and work entirely offline. Usage won't be tracked."
                  isTogglable={true}
                  settingEnabled={Boolean(settings?.offlineMode)}
                  toggle={() => updateSettings({
                    offlineMode: !settings?.offlineMode
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Usage Bar Component
function UsageBar({ label, used, limit, color }: {
  label: string;
  used: number;
  limit: number;
  color: 'blue' | 'green';
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isOverLimit = used > limit;

  const colorClasses = {
    blue: isOverLimit ? 'bg-red-500' : 'bg-blue-500',
    green: isOverLimit ? 'bg-red-500' : 'bg-green-500'
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className={isOverLimit ? 'text-red-600 font-medium' : ''}>
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SelectorRow({
  id,
  label,
  description,
  tooltip,
  isTogglable,
  settingEnabled,
  toggle,
}: {
  id: string;
  label: string;
  description: string;
  tooltip: string;
  isTogglable: boolean;
  settingEnabled: boolean;
  toggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1.5">
        <Label
          htmlFor={id}
          className={!isTogglable ? "text-muted-foreground/50" : ""}
        >
          {label}
        </Label>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                className={`h-4 w-4 cursor-help ${!isTogglable ? "text-muted-foreground/50" : "text-muted-foreground"}`}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-72">
              {tooltip}
            </TooltipContent>
          </Tooltip>
          <p
            className={`text-xs ${!isTogglable ? "text-muted-foreground/50" : "text-muted-foreground"} max-w-55`}
          >
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={isTogglable ? settingEnabled : false}
        onCheckedChange={toggle}
        disabled={!isTogglable}
      />
    </div>
  );
}

function SmartContextSelector({
  isTogglable,
  settings,
  onValueChange,
}: {
  isTogglable: boolean;
  settings: UserSettings | null;
  onValueChange: (value: "off" | "conservative" | "balanced") => void;
}) {
  // Determine current value based on settings
  const getCurrentValue = (): "off" | "conservative" | "balanced" => {
    if (!settings?.enableProSmartFilesContextMode) {
      return "off";
    }
    if (settings?.proSmartContextOption === "balanced") {
      return "balanced";
    }
    // If enabled but no option set (undefined/falsey), it's conservative
    return "conservative";
  };

  const currentValue = getCurrentValue();

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className={!isTogglable ? "text-muted-foreground/50" : ""}>
          Smart Context
        </Label>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                className={`h-4 w-4 cursor-help ${!isTogglable ? "text-muted-foreground/50" : "text-muted-foreground"}`}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-72">
              Improve efficiency and save credits working on large codebases.
            </TooltipContent>
          </Tooltip>
          <p
            className={`text-xs ${!isTogglable ? "text-muted-foreground/50" : "text-muted-foreground"}`}
          >
            Optimizes your AI's code context
          </p>
        </div>
      </div>
      <div className="inline-flex rounded-md border border-input">
        <Button
          variant={currentValue === "off" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("off")}
          disabled={!isTogglable}
          className="rounded-r-none border-r border-input h-8 px-3 text-xs flex-shrink-0"
        >
          Off
        </Button>
        <Button
          variant={currentValue === "conservative" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("conservative")}
          disabled={!isTogglable}
          className="rounded-none border-r border-input h-8 px-3 text-xs flex-shrink-0"
        >
          Conservative
        </Button>
        <Button
          variant={currentValue === "balanced" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("balanced")}
          disabled={!isTogglable}
          className="rounded-l-none h-8 px-3 text-xs flex-shrink-0"
        >
          Balanced
        </Button>
      </div>
    </div>
  );
}

