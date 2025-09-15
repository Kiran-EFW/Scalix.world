'use client'

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface TierLimits {
  aiTokens: number;
  apiCalls: number;
  storage: number;
  teamMembers: number;
  projects?: number;
  chats?: number;
  messages?: number;
  fileUploads?: number;
  fileSize?: number;
}

interface Tier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  limits: TierLimits;
}

interface UsageStats {
  current: {
    aiTokens: number;
    apiCalls: number;
    storage: number;
    teamMembers: number;
    [key: string]: number;
  };
  percentages: {
    [key: string]: number;
  };
  limits: TierLimits;
}

interface ExceededMetric {
  metric: string;
  limit: number;
  current: number;
  exceededBy: number;
  percentage: number;
}

export function useTierManagement() {
  const [currentTier, setCurrentTier] = useState<Tier | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exceededMetrics, setExceededMetrics] = useState<ExceededMetric[]>([]);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [customApiConfigured, setCustomApiConfigured] = useState(false);

  // Load initial data
  const loadTierData = useCallback(async () => {
    try {
      setLoading(true);

      // Load current tier and limits
      const tierResponse = await fetch('/api/user/tier');
      if (tierResponse.ok) {
        const tierData = await tierResponse.json();
        setCurrentTier({
          id: tierData.tierId,
          name: tierData.tierName,
          displayName: tierData.tier?.displayName || tierData.tierName,
          description: '',
          price: tierData.tier?.price || 0,
          currency: 'usd',
          features: tierData.tier?.features || [],
          limits: tierData.limits
        });
      }

      // Load usage statistics
      const usageResponse = await fetch('/api/usage');
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsageStats(usageData);
      }

    } catch (error) {
      console.error('Error loading tier data:', error);
      toast.error('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for limit exceedance
  const checkLimits = useCallback(() => {
    if (!currentTier?.limits || !usageStats?.current) return;

    const exceeded: ExceededMetric[] = [];
    const limits = currentTier.limits;
    const current = usageStats.current;

    Object.entries(limits).forEach(([metric, limit]) => {
      if (typeof limit === 'number' && limit > 0) {
        const currentValue = current[metric] || 0;
        if (currentValue > limit) {
          exceeded.push({
            metric,
            limit,
            current: currentValue,
            exceededBy: currentValue - limit,
            percentage: Math.round((currentValue / limit) * 100)
          });
        }
      }
    });

    setExceededMetrics(exceeded);

    // Check if we should enter fallback mode
    if (exceeded.length > 0 && !fallbackMode) {
      setFallbackMode(true);
      toast.warning('Usage limits exceeded - configure your own API key or upgrade', {
        duration: 10000,
        action: {
          label: 'Configure',
          onClick: () => window.location.href = '/settings'
        }
      });
    } else if (exceeded.length === 0 && fallbackMode) {
      setFallbackMode(false);
      toast.success('Usage back within limits');
    }
  }, [currentTier, usageStats, fallbackMode]);

  // Configure custom API key
  const configureCustomApiKey = useCallback(async (apiKey: string, provider: string) => {
    try {
      // This would typically call an API endpoint
      // For now, we'll simulate the configuration
      console.log(`Configuring ${provider} API key`);

      // Validate API key format
      if (!apiKey || apiKey.length < 20) {
        toast.error('Invalid API key format');
        return false;
      }

      // Provider-specific validation
      let isValid = false;
      switch (provider) {
        case 'openai':
          isValid = apiKey.startsWith('sk-');
          break;
        case 'anthropic':
          isValid = apiKey.startsWith('sk-ant-');
          break;
        case 'google':
          isValid = apiKey.length > 30;
          break;
        default:
          isValid = true;
      }

      if (!isValid) {
        toast.error(`Invalid ${provider} API key format`);
        return false;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCustomApiConfigured(true);
      toast.success(`${provider} API key configured successfully`);
      return true;

    } catch (error) {
      console.error('Error configuring API key:', error);
      toast.error('Failed to configure API key');
      return false;
    }
  }, []);

  // Check if request should be blocked
  const shouldBlockRequest = useCallback((requestType: string, estimatedCost = 1) => {
    if (!currentTier?.limits || !usageStats?.current) {
      return { blocked: false };
    }

    const limits = currentTier.limits;
    const current = usageStats.current;

    // Check if this specific metric would exceed limits
    if (limits[requestType] && current[requestType]) {
      const projected = current[requestType] + estimatedCost;
      if (projected > limits[requestType]) {
        return {
          blocked: true,
          reason: `${requestType} limit would be exceeded`,
          upgradeRequired: true
        };
      }
    }

    return { blocked: false };
  }, [currentTier, usageStats]);

  // Get usage warnings
  const getUsageWarnings = useCallback(() => {
    if (!currentTier?.limits || !usageStats?.current) return [];

    const warnings = [];
    const limits = currentTier.limits;
    const current = usageStats.current;

    Object.entries(limits).forEach(([metric, limit]) => {
      if (typeof limit === 'number' && limit > 0) {
        const currentValue = current[metric] || 0;
        const percentage = Math.round((currentValue / limit) * 100);

        if (percentage >= 100) {
          warnings.push({
            metric,
            percentage,
            level: 'exceeded',
            message: `${formatMetricName(metric)} usage has exceeded the limit!`
          });
        } else if (percentage >= 90) {
          warnings.push({
            metric,
            percentage,
            level: 'critical',
            message: `${formatMetricName(metric)} usage is at ${percentage}% - upgrade soon!`
          });
        } else if (percentage >= 75) {
          warnings.push({
            metric,
            percentage,
            level: 'warning',
            message: `${formatMetricName(metric)} usage is at ${percentage}%`
          });
        }
      }
    });

    return warnings;
  }, [currentTier, usageStats]);

  // Format metric names
  const formatMetricName = (metric: string) => {
    const nameMap = {
      aiTokens: 'AI Tokens',
      apiCalls: 'API Calls',
      storage: 'Storage',
      teamMembers: 'Team Members',
      projects: 'Projects',
      chats: 'Chats',
      messages: 'Messages',
      fileUploads: 'File Uploads',
      fileSize: 'File Size'
    };
    return nameMap[metric] || metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Refresh data
  const refresh = useCallback(async () => {
    await loadTierData();
  }, [loadTierData]);

  // Initialize
  useEffect(() => {
    loadTierData();
  }, [loadTierData]);

  // Check limits when data changes
  useEffect(() => {
    if (currentTier && usageStats) {
      checkLimits();
    }
  }, [currentTier, usageStats, checkLimits]);

  return {
    // State
    currentTier,
    usageStats,
    loading,
    exceededMetrics,
    fallbackMode,
    customApiConfigured,

    // Actions
    refresh,
    configureCustomApiKey,
    shouldBlockRequest,
    getUsageWarnings,

    // Utilities
    formatMetricName
  };
}
