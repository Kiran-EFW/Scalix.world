'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  AlertTriangle,
  Crown,
  Key,
  Settings,
  Zap,
  Database,
  UserCheck,
  BarChart3,
  Clock
} from 'lucide-react';

interface UsageMetric {
  metric: string;
  current: number;
  limit: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical' | 'exceeded';
}

interface UsageDashboardProps {
  currentTier: any;
  usageStats: any;
  onUpgrade: () => void;
  onSettings: () => void;
}

export default function UsageDashboard({
  currentTier,
  usageStats,
  onUpgrade,
  onSettings
}: UsageDashboardProps) {
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);

  useEffect(() => {
    if (currentTier?.limits && usageStats?.current) {
      calculateUsageMetrics();
    }
  }, [currentTier, usageStats]);

  const calculateUsageMetrics = () => {
    const metrics: UsageMetric[] = [];
    const limits = currentTier.limits;
    const current = usageStats.current;

    Object.entries(limits).forEach(([metric, limit]) => {
      if (typeof limit === 'number' && limit > 0) {
        const currentValue = current[metric] || 0;
        const percentage = Math.round((currentValue / limit) * 100);

        let status: UsageMetric['status'] = 'normal';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 90) status = 'critical';
        else if (percentage >= 75) status = 'warning';

        metrics.push({
          metric,
          current: currentValue,
          limit,
          percentage,
          status
        });
      }
    });

    setUsageMetrics(metrics);
  };

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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case 'storage':
        return formatBytes(value);
      default:
        return formatNumber(value);
    }
  };

  const getStatusColor = (status: UsageMetric['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-orange-600';
      case 'exceeded':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: UsageMetric['status']) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-orange-100 text-orange-800">Critical</Badge>;
      case 'exceeded':
        return <Badge className="bg-red-100 text-red-800">Exceeded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProgressColor = (status: UsageMetric['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-orange-500';
      case 'exceeded':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const hasExceededLimits = usageMetrics.some(m => m.status === 'exceeded');
  const hasCriticalLimits = usageMetrics.some(m => m.status === 'critical');

  return (
    <div className="space-y-6">
      {/* Current Tier Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Current Plan: {currentTier?.displayName || 'Free'}
            </div>
            <Button onClick={onUpgrade} size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">AI Tokens</div>
              <div className="font-semibold">
                {formatValue('aiTokens', usageStats?.current?.aiTokens || 0)} /
                {formatValue('aiTokens', currentTier?.limits?.aiTokens || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">API Calls</div>
              <div className="font-semibold">
                {formatValue('apiCalls', usageStats?.current?.apiCalls || 0)} /
                {formatValue('apiCalls', currentTier?.limits?.apiCalls || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Storage</div>
              <div className="font-semibold">
                {formatBytes(usageStats?.current?.storage || 0)} /
                {formatBytes(currentTier?.limits?.storage || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Team Members</div>
              <div className="font-semibold">
                {usageStats?.current?.teamMembers || 0} /
                {currentTier?.limits?.teamMembers || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {hasExceededLimits && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Usage Limits Exceeded!</strong> Some of your usage has exceeded the limits of your current plan.
            <Button
              variant="link"
              className="p-0 h-auto text-red-800 underline ml-1"
              onClick={onSettings}
            >
              Configure your own API key
            </Button>
            {' '}or{' '}
            <Button
              variant="link"
              className="p-0 h-auto text-red-800 underline"
              onClick={onUpgrade}
            >
              upgrade your plan
            </Button>
            {' '}to continue.
          </AlertDescription>
        </Alert>
      )}

      {hasCriticalLimits && !hasExceededLimits && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Approaching Limits!</strong> You're getting close to your usage limits.
            Consider upgrading or configuring your own API key.
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usageMetrics.map((metric, index) => (
          <Card key={index} className={metric.status === 'exceeded' ? 'border-red-200' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                {formatMetricName(metric.metric)}
                {getStatusBadge(metric.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className={getStatusColor(metric.status)}>
                      {formatValue(metric.metric, metric.current)}
                    </span>
                    <span className="text-gray-500">
                      {formatValue(metric.metric, metric.limit)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(metric.percentage, 100)}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{metric.percentage}% used</span>
                    <span>
                      {metric.status === 'exceeded'
                        ? `${formatValue(metric.metric, metric.current - metric.limit)} over limit`
                        : `${formatValue(metric.metric, metric.limit - metric.current)} remaining`
                      }
                    </span>
                  </div>
                </div>

                {/* Status-specific content */}
                {metric.status === 'exceeded' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Limit exceeded!</span>
                    </div>
                  </div>
                )}

                {metric.status === 'critical' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-800 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Critical - upgrade soon!</span>
                    </div>
                  </div>
                )}

                {metric.status === 'warning' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Approaching limit</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={onUpgrade}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Crown className="w-6 h-6 text-yellow-500" />
              <div className="text-center">
                <div className="font-medium">Upgrade Plan</div>
                <div className="text-sm text-gray-600">Higher limits & features</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={onSettings}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Key className="w-6 h-6 text-blue-500" />
              <div className="text-center">
                <div className="font-medium">API Key Settings</div>
                <div className="text-sm text-gray-600">Use your own key</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open('/usage', '_blank')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <BarChart3 className="w-6 h-6 text-green-500" />
              <div className="text-center">
                <div className="font-medium">View Details</div>
                <div className="text-sm text-gray-600">Full usage report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium">Monthly Reset</div>
                <div className="text-sm text-gray-600">
                  Usage limits reset on the 1st of each month
                </div>
              </div>
            </div>
            <Badge variant="outline">
              {Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
