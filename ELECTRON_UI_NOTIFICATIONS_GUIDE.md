# 🎨 Electron App UI & Notifications - Enhancement Guide

## 📋 **CURRENT STATE ANALYSIS**

### ✅ **Already Implemented:**
- Basic cloud status indicators in ProModeSelector
- Usage dashboard with progress bars
- Cloud settings toggles
- Toast system (Sonner) for general notifications

### ❌ **MISSING UI/UX FEATURES:**

## 🚨 **NOTIFICATION SYSTEM ENHANCEMENTS**

### **1. Cloud Sync Notifications** ⚠️ *HIGH PRIORITY*

#### **Sync Success Notifications**
```typescript
// Add to ProModeSelector.tsx or create new hook
useEffect(() => {
  if (cloudStatus === 'online' && usageSummary) {
    // Show success notification on first sync
    const lastSync = settings?.lastCloudSync;
    const isFirstSync = !lastSync || new Date(lastSync) < new Date(Date.now() - 300000); // 5 min ago

    if (isFirstSync) {
      showSuccess('🔄 Cloud sync completed! Your Pro features are active.');
    }
  }
}, [cloudStatus, usageSummary]);
```

#### **Sync Failure Notifications**
```typescript
// Add error handling with user-friendly messages
const handleSyncError = (error: string) => {
  if (error.includes('network')) {
    showWarning('🌐 Unable to sync with cloud. Working offline.');
  } else if (error.includes('auth')) {
    showError('🔐 Authentication failed. Please check your subscription.');
  } else {
    showError('🔄 Sync failed. Please try again later.');
  }
};
```

#### **Offline Mode Notifications**
```typescript
// Notify when switching to offline mode
useEffect(() => {
  if (settings?.offlineMode && cloudStatus === 'offline') {
    showInfo('🔌 Offline mode activated. Usage will sync when online.');
  }
}, [settings?.offlineMode, cloudStatus]);
```

### **2. Usage Limit Warnings** ⚠️ *HIGH PRIORITY*

#### **Usage Threshold Alerts**
```typescript
// Add to usage dashboard component
const checkUsageThresholds = (usage: any, limits: any) => {
  const aiTokensPercent = (usage.ai_tokens / limits.maxAiTokens) * 100;
  const apiCallsPercent = (usage.api_calls / limits.maxApiCalls) * 100;

  if (aiTokensPercent > 90) {
    showWarning(`⚠️ AI token usage at ${Math.round(aiTokensPercent)}%. Consider upgrading.`);
  }

  if (apiCallsPercent > 95) {
    showError(`🚨 API call limit reached (${usage.api_calls}/${limits.maxApiCalls}). Upgrade required.`);
  }
};
```

#### **Monthly Reset Notifications**
```typescript
// Show when usage resets
const handleUsageReset = () => {
  showSuccess('🎉 Monthly usage reset! Fresh limits available.');
};

// Trigger on date change or manual reset detection
```

### **3. Subscription Status Notifications** ⚠️ *MEDIUM PRIORITY*

#### **Plan Upgrade/Downgrade Alerts**
```typescript
// Detect plan changes and notify user
useEffect(() => {
  const currentPlan = settings?.proFeatures?.currentPlan;
  const previousPlan = localStorage.getItem('lastKnownPlan');

  if (currentPlan && previousPlan && currentPlan !== previousPlan) {
    if (currentPlan === 'pro' && previousPlan === 'free') {
      showSuccess('🚀 Welcome to Scalix Pro! All premium features unlocked.');
    } else if (currentPlan === 'free') {
      showWarning('📉 Subscription ended. Switched to free plan.');
    }
  }

  localStorage.setItem('lastKnownPlan', currentPlan || 'free');
}, [settings?.proFeatures?.currentPlan]);
```

## 🎨 **UI ENHANCEMENTS**

### **1. Global Cloud Status Indicator** ⚠️ *HIGH PRIORITY*

#### **App-Wide Status Bar**
```typescript
// Add to main layout (TitleBar or main app component)
const GlobalCloudStatus = () => {
  const { cloudStatus, lastSync } = useCloudStatus();

  return (
    <div className="fixed top-2 right-2 z-50">
      <Tooltip>
        <TooltipTrigger>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
            {
              'bg-green-100 text-green-800': cloudStatus === 'online',
              'bg-gray-100 text-gray-800': cloudStatus === 'offline',
              'bg-blue-100 text-blue-800': cloudStatus === 'syncing'
            }
          )}>
            {cloudStatus === 'online' && <Cloud className="h-3 w-3" />}
            {cloudStatus === 'offline' && <CloudOff className="h-3 w-3" />}
            {cloudStatus === 'syncing' && <Wifi className="h-3 w-3 animate-pulse" />}
            <span className="capitalize">{cloudStatus}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {cloudStatus === 'online' && `Last sync: ${new Date(lastSync).toLocaleTimeString()}`}
          {cloudStatus === 'offline' && 'Working offline - sync when reconnected'}
          {cloudStatus === 'syncing' && 'Syncing with cloud...'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
```

### **2. Enhanced Pro Mode Selector** ✅ *PARTIALLY DONE*

#### **Loading States During Sync**
```typescript
// Add to ProModeSelector.tsx
const [isSyncing, setIsSyncing] = useState(false);

const handleManualSync = async () => {
  setIsSyncing(true);
  try {
    const result = await ipcClient.triggerCloudSync();
    if (result.success) {
      showSuccess('Cloud sync completed successfully!');
    } else {
      showError('Cloud sync failed: ' + result.error);
    }
  } catch (error) {
    showError('Sync failed. Please try again.');
  } finally {
    setIsSyncing(false);
  }
};
```

#### **Sync Button with Loading State**
```tsx
<Button
  onClick={handleManualSync}
  disabled={isSyncing || cloudStatus === 'offline'}
  variant="outline"
  size="sm"
>
  {isSyncing ? (
    <>
      <Loader2 className="h-3 w-3 animate-spin mr-1" />
      Syncing...
    </>
  ) : (
    <>
      <RefreshCw className="h-3 w-3 mr-1" />
      Sync Now
    </>
  )}
</Button>
```

### **3. Usage Dashboard Improvements** ✅ *PARTIALLY DONE*

#### **Real-time Usage Updates**
```typescript
// Add auto-refresh to usage dashboard
const [lastRefresh, setLastRefresh] = useState(Date.now());

useEffect(() => {
  const interval = setInterval(() => {
    if (cloudStatus === 'online') {
      // Refresh usage data
      setLastRefresh(Date.now());
    }
  }, 60000); // Refresh every minute

  return () => clearInterval(interval);
}, [cloudStatus]);
```

#### **Usage Trend Indicators**
```tsx
// Show usage change from last period
const UsageTrend = ({ current, previous }) => {
  const change = ((current - previous) / previous) * 100;
  const isIncrease = change > 0;

  return (
    <div className={cn(
      "flex items-center text-xs",
      isIncrease ? "text-red-600" : "text-green-600"
    )}>
      {isIncrease ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {Math.abs(change).toFixed(1)}%
    </div>
  );
};
```

### **4. Onboarding & Help System** ⚠️ *MEDIUM PRIORITY*

#### **First-Time Cloud User Onboarding**
```typescript
// Detect first cloud sync and show onboarding
const [showCloudOnboarding, setShowCloudOnboarding] = useState(false);

useEffect(() => {
  const hasSeenOnboarding = localStorage.getItem('cloudOnboardingSeen');
  const hasCloudFeatures = settings?.cloudSyncEnabled;

  if (!hasSeenOnboarding && hasCloudFeatures && cloudStatus === 'online') {
    setShowCloudOnboarding(true);
  }
}, [settings?.cloudSyncEnabled, cloudStatus]);

// Onboarding modal
if (showCloudOnboarding) {
  return (
    <Modal>
      <ModalHeader>Welcome to Cloud Sync!</ModalHeader>
      <ModalBody>
        <p>Your Scalix app now syncs with the cloud for:</p>
        <ul>
          <li>✅ Automatic Pro feature activation</li>
          <li>✅ Real-time usage tracking</li>
          <li>✅ Cross-device synchronization</li>
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => {
          setShowCloudOnboarding(false);
          localStorage.setItem('cloudOnboardingSeen', 'true');
        }}>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

#### **Contextual Help Tooltips**
```tsx
// Add help tooltips throughout the UI
<Tooltip>
  <TooltipTrigger>
    <HelpCircle className="h-4 w-4 text-gray-400" />
  </TooltipTrigger>
  <TooltipContent className="max-w-xs">
    <p>Cloud sync keeps your settings and usage data synchronized across devices.</p>
    <p className="mt-2 text-xs text-gray-500">
      Works automatically when online. Enable offline mode in settings if needed.
    </p>
  </TooltipContent>
</Tooltip>
```

## 🔧 **TECHNICAL IMPLEMENTATION**

### **1. Cloud Status Hook** ✅ *NEEDED*
```typescript
// Create: src/hooks/useCloudStatus.ts
export const useCloudStatus = () => {
  const { settings } = useSettings();
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('checking');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check cloud connectivity
        const response = await fetch(`${CLOUD_API_BASE}/health`, {
          signal: AbortSignal.timeout(3000)
        });

        const newStatus = response.ok ? 'online' : 'offline';
        setCloudStatus(newStatus);

        if (response.ok) {
          setLastSync(new Date());
        }
      } catch {
        setCloudStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return { cloudStatus, lastSync, isOnline: cloudStatus === 'online' };
};
```

### **2. Notification Manager** ✅ *NEEDED*
```typescript
// Create: src/lib/cloudNotifications.ts
import { showSuccess, showError, showWarning, showInfo } from './toast';

export class CloudNotificationManager {
  static notifySyncSuccess() {
    showSuccess('🔄 Cloud sync completed! Your data is up to date.');
  }

  static notifySyncFailure(error?: string) {
    const message = error?.includes('network')
      ? '🌐 Sync failed due to network issues. Will retry automatically.'
      : '🔄 Sync failed. Please check your connection and try again.';
    showWarning(message);
  }

  static notifyOfflineMode() {
    showInfo('🔌 Switched to offline mode. Features work locally.');
  }

  static notifyUsageWarning(resource: string, percent: number) {
    showWarning(`⚠️ ${resource} usage at ${percent}%. Consider upgrading.`);
  }

  static notifyUsageLimit(resource: string, current: number, limit: number) {
    showError(`🚨 ${resource} limit reached (${current}/${limit}). Upgrade required.`);
  }

  static notifyPlanUpgrade(plan: string) {
    showSuccess(`🚀 Upgraded to ${plan} plan! All features unlocked.`);
  }

  static notifyPlanDowngrade() {
    showWarning('📉 Subscription ended. Switched to free plan.');
  }
}
```

### **3. Loading States Hook** ✅ *NEEDED*
```typescript
// Create: src/hooks/useLoadingState.ts
export const useLoadingState = (key: string) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = (isLoading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  };

  const isLoading = loadingStates[key] || false;

  return { isLoading, setLoading };
};
```

## 📋 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core Notifications (2 hours)** ⚠️ *HIGH PRIORITY*
1. Add cloud sync success/failure notifications
2. Add usage limit warnings
3. Add subscription status notifications

### **Phase 2: UI Polish (3 hours)** ⚠️ *MEDIUM PRIORITY*
1. Global cloud status indicator
2. Enhanced loading states
3. Usage trend indicators

### **Phase 3: Onboarding & Help (2 hours)** ⚠️ *LOW PRIORITY*
1. First-time user onboarding
2. Contextual help tooltips
3. Advanced notification preferences

## 🎯 **SUCCESS METRICS**

- **Notification Engagement**: 80% of users see sync notifications
- **Error Recovery**: 90% of sync failures resolved via user action
- **Usage Awareness**: 95% of users see usage warnings before limits
- **Onboarding Completion**: 85% of new users complete cloud setup

## 🚀 **QUICK WINS**

### **Immediate Impact (30 minutes):**
```typescript
// Add to ProModeSelector.tsx
import { showSuccess, showError } from '@/lib/toast';

// After successful sync
showSuccess('🔄 Cloud sync completed! Pro features activated.');
```

### **High Impact (1 hour):**
```typescript
// Add usage warnings
if (usagePercent > 90) {
  showWarning(`⚠️ Usage at ${usagePercent}%. Upgrade soon.`);
}
```

**Total Implementation Time**: 5-7 hours
**User Experience Impact**: HIGH (notifications guide user behavior)
**Technical Risk**: LOW (enhances existing systems)
