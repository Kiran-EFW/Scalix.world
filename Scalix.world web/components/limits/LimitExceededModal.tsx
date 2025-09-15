'use client'

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Key,
  Crown,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  Zap,
  TrendingUp,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface ExceededMetric {
  metric: string;
  limit: number;
  current: number;
  exceededBy: number;
  percentage: number;
}

interface LimitExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  exceededMetrics: ExceededMetric[];
  currentTier: any;
  onUpgrade: () => void;
  onConfigureApiKey: (apiKey: string, provider: string) => Promise<boolean>;
}

export default function LimitExceededModal({
  isOpen,
  onClose,
  exceededMetrics,
  currentTier,
  onUpgrade,
  onConfigureApiKey
}: LimitExceededModalProps) {
  const [activeTab, setActiveTab] = useState<'upgrade' | 'custom-key' | 'wait'>('upgrade');
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('upgrade');
      setApiKey('');
      setConfigured(false);
    }
  }, [isOpen]);

  const handleConfigureApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your API key');
      return;
    }

    setIsConfiguring(true);
    try {
      const success = await onConfigureApiKey(apiKey.trim(), provider);
      if (success) {
        setConfigured(true);
        toast.success('API key configured successfully!');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error('Failed to configure API key. Please check your key and try again.');
      }
    } catch (error) {
      toast.error('Error configuring API key. Please try again.');
    } finally {
      setIsConfiguring(false);
    }
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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return '🤖';
      case 'anthropic':
        return '🧠';
      case 'google':
        return '🌐';
      default:
        return '🔑';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic';
      case 'google':
        return 'Google AI';
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Usage Limits Exceeded
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You've exceeded your {currentTier?.displayName || 'current plan'} limits.
              Choose how you'd like to continue using the service.
            </AlertDescription>
          </Alert>

          {/* Exceeded Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exceededMetrics.map((metric, index) => (
              <Card key={index} className="border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {formatMetricName(metric.metric)}
                    <Badge variant="destructive" className="text-xs">
                      {metric.percentage}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Progress value={Math.min(metric.percentage, 100)} className="h-2" />
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span className="font-medium text-red-600">
                          {formatValue(metric.metric, metric.current)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Limit:</span>
                        <span>{formatValue(metric.metric, metric.limit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exceeded by:</span>
                        <span className="font-medium text-red-600">
                          {formatValue(metric.metric, metric.exceededBy)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Options Tabs */}
          <div className="border rounded-lg">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('upgrade')}
                className={`flex-1 px-4 py-3 text-center font-medium ${
                  activeTab === 'upgrade'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Upgrade Plan
              </button>
              <button
                onClick={() => setActiveTab('custom-key')}
                className={`flex-1 px-4 py-3 text-center font-medium ${
                  activeTab === 'custom-key'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Key className="w-4 h-4 inline mr-2" />
                Use Your API Key
              </button>
              <button
                onClick={() => setActiveTab('wait')}
                className={`flex-1 px-4 py-3 text-center font-medium ${
                  activeTab === 'wait'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Wait for Reset
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'upgrade' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Crown className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Upgrade Your Plan</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Get higher limits and unlock premium features. Upgrade now to continue without interruption.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current Plan:</span>
                      <span>{currentTier?.displayName || 'Free'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Next Plan:</span>
                      <Badge className="bg-blue-600">Pro Plan</Badge>
                    </div>
                  </div>
                  <Button onClick={onUpgrade} size="lg" className="w-full max-w-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              )}

              {activeTab === 'custom-key' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Use Your Own API Key</h3>
                    <p className="text-gray-600">
                      Connect your own API key to continue using your preferred AI models without limits.
                    </p>
                  </div>

                  {configured ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-medium text-green-800">API Key Configured!</h4>
                      <p className="text-gray-600">
                        Your {getProviderName(provider)} API key has been configured successfully.
                        You can now continue using the service with your own key.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto space-y-4">
                      <div>
                        <Label htmlFor="provider">AI Provider</Label>
                        <select
                          id="provider"
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="openai">🤖 OpenAI</option>
                          <option value="anthropic">🧠 Anthropic</option>
                          <option value="google">🌐 Google AI</option>
                          <option value="custom">🔑 Custom Provider</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="apiKey">
                          {getProviderName(provider)} API Key
                        </Label>
                        <Input
                          id="apiKey"
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={`Enter your ${getProviderName(provider)} API key`}
                          className="font-mono"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Your API key is stored securely and only used for your requests.
                        </p>
                      </div>

                      <Button
                        onClick={handleConfigureApiKey}
                        disabled={!apiKey.trim() || isConfiguring}
                        className="w-full"
                      >
                        {isConfiguring ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Configuring...
                          </>
                        ) : (
                          <>
                            <Key className="w-4 h-4 mr-2" />
                            Configure API Key
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wait' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Wait for Monthly Reset</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your usage limits will reset at the beginning of your next billing cycle.
                    You can continue using basic features until then.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Next reset:</span>
                      <span>{new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Basic features remain available during this period.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Need help? <a href="/support" className="text-blue-600 hover:underline">Contact Support</a>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
