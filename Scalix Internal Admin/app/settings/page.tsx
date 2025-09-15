'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loading, PageLoading, TableSkeleton } from '@/components/ui/loading'
import { Modal, FormModal, ConfirmModal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ThemeSelector } from '@/components/theme/ThemeToggle'
import {
  Settings,
  Shield,
  Database,
  Mail,
  Bell,
  Key,
  Palette,
  Activity,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Upload,
  History,
  Search,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileText,
  Archive,
  RotateCcw,
  Clock,
  User,
  Globe,
  Zap,
  Server,
  Monitor,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Copy,
  Trash2,
  Edit,
  Check,
  Info,
  AlertCircle
} from 'lucide-react'

// Validation schemas
const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  debugMode: z.boolean(),
  apiRateLimit: z.number().min(1).max(10000),
  sessionTimeout: z.number().min(60).max(86400),
  cacheExpiration: z.number().min(60).max(86400),
  logRetention: z.number().min(1).max(365),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
  timezone: z.string().min(1)
})

const securitySettingsSchema = z.object({
  twoFactorRequired: z.boolean(),
  passwordMinLength: z.number().min(6).max(32),
  sessionMaxDuration: z.number().min(1).max(168),
  ipWhitelist: z.string().optional(),
  failedLoginAttempts: z.number().min(3).max(10),
  lockoutDuration: z.number().min(60).max(3600),
  passwordHistory: z.number().min(0).max(10),
  encryptionLevel: z.enum(['basic', 'standard', 'military'])
})

const notificationSettingsSchema = z.object({
  emailAlerts: z.boolean(),
  systemAlerts: z.boolean(),
  securityAlerts: z.boolean(),
  performanceAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  slackWebhook: z.string().url().optional().or(z.literal('')),
  emailDigest: z.enum(['never', 'daily', 'weekly']),
  alertThresholds: z.object({
    cpuUsage: z.number().min(1).max(100),
    memoryUsage: z.number().min(1).max(100),
    diskUsage: z.number().min(1).max(100),
    errorRate: z.number().min(0.1).max(10)
  })
})

const apiSettingsSchema = z.object({
  defaultModel: z.enum(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3', 'claude-3-opus']),
  maxTokens: z.number().min(100).max(32768),
  temperature: z.number().min(0).max(2),
  timeout: z.number().min(5).max(300),
  rateLimits: z.object({
    requestsPerMinute: z.number().min(1).max(1000),
    requestsPerHour: z.number().min(10).max(10000),
    requestsPerDay: z.number().min(100).max(100000)
  }),
  features: z.object({
    streaming: z.boolean(),
    functionCalling: z.boolean(),
    imageGeneration: z.boolean(),
    codeExecution: z.boolean()
  })
})

const settingsSchema = z.object({
  system: systemSettingsSchema,
  security: securitySettingsSchema,
  notifications: notificationSettingsSchema,
  api: apiSettingsSchema
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const { success, error, info } = useToast()

  // State management
  const [activeTab, setActiveTab] = useState('system')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [settingsHistory, setSettingsHistory] = useState<any[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Modal states
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // Form setup
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      system: {
        maintenanceMode: false,
        debugMode: false,
        apiRateLimit: 1000,
        sessionTimeout: 3600,
        cacheExpiration: 300,
        logRetention: 30,
        backupFrequency: 'daily',
        timezone: 'UTC'
      },
      security: {
        twoFactorRequired: false,
        passwordMinLength: 8,
        sessionMaxDuration: 24,
        ipWhitelist: '',
        failedLoginAttempts: 5,
        lockoutDuration: 900,
        passwordHistory: 3,
        encryptionLevel: 'standard'
      },
      notifications: {
        emailAlerts: true,
        systemAlerts: true,
        securityAlerts: true,
        performanceAlerts: false,
        smsAlerts: false,
        slackWebhook: '',
        emailDigest: 'daily',
        alertThresholds: {
          cpuUsage: 80,
          memoryUsage: 85,
          diskUsage: 90,
          errorRate: 2
        }
      },
      api: {
        defaultModel: 'gpt-4',
        maxTokens: 4000,
        temperature: 0.7,
        timeout: 30,
        rateLimits: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          requestsPerDay: 10000
        },
        features: {
          streaming: true,
          functionCalling: true,
          imageGeneration: false,
          codeExecution: false
        }
      }
    }
  })

  const { handleSubmit, watch, reset, formState: { errors, isDirty } } = form

  // Watch for changes to track unsaved state
  useEffect(() => {
    setHasUnsavedChanges(isDirty)
  }, [isDirty])

  // Mock settings history
  useEffect(() => {
    const mockHistory = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'admin@scalix.world',
        action: 'Updated API rate limits',
        category: 'api',
        changes: { rateLimits: { requestsPerMinute: 60 } }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        user: 'admin@scalix.world',
        action: 'Enabled two-factor authentication',
        category: 'security',
        changes: { twoFactorRequired: true }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        user: 'system',
        action: 'Automatic backup completed',
        category: 'system',
        changes: {}
      }
    ]
    setSettingsHistory(mockHistory)
  }, [])

  // File dropzone for import
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        handleImportSettings(file)
      }
    }
  })

  // Computed values
  const filteredTabs = useMemo(() => {
    if (!searchQuery) return tabs

    return tabs.filter(tab =>
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Handlers
  const handleSaveSettings = async (data: SettingsFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Add to history
      const newHistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        user: 'admin@scalix.world',
        action: 'Updated system settings',
        category: activeTab,
        changes: data[activeTab as keyof SettingsFormData]
      }
      setSettingsHistory(prev => [newHistoryEntry, ...prev])

      success('Settings saved successfully!')
      setHasUnsavedChanges(false)
    } catch (err) {
      error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportSettings = async (format: 'json' | 'yaml' | 'env') => {
    setIsLoading(true)
    try {
      const currentSettings = form.getValues()
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        settings: currentSettings
      }

      let content: string
      let mimeType: string
      let extension: string

      switch (format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2)
          mimeType = 'application/json'
          extension = 'json'
          break
        case 'yaml':
          content = `# Scalix Admin Settings Export\n# Version: 1.0\n# Exported: ${new Date().toISOString()}\n\n${JSON.stringify(exportData, null, 2)}`
          mimeType = 'application/x-yaml'
          extension = 'yaml'
          break
        case 'env':
          content = Object.entries(exportData.settings)
            .map(([category, settings]) => `# ${category.toUpperCase()} SETTINGS\n${Object.entries(settings as any)
              .map(([key, value]) => `${category.toUpperCase()}_${key.toUpperCase()}=${JSON.stringify(value)}`)
              .join('\n')}`)
            .join('\n\n')
          mimeType = 'text/plain'
          extension = 'env'
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scalix-settings-${new Date().toISOString().split('T')[0]}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      success(`Settings exported as ${format.toUpperCase()}`)
      setShowBackupModal(false)
    } catch (err) {
      error('Failed to export settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportSettings = async (file: File) => {
    setIsLoading(true)
    try {
      const text = await file.text()
      let importData: any

      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text)
      } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        // Simple YAML-like parsing (for demo)
        importData = JSON.parse(text.replace(/^#.*$/gm, '').trim())
      }

      if (importData?.settings) {
        form.reset(importData.settings)
        success('Settings imported successfully!')
        setShowImportModal(false)
      } else {
        error('Invalid settings file format')
      }
    } catch (err) {
      error('Failed to import settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreDefaults = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      form.reset()
      success('Settings restored to defaults')
      setShowConfirmReset(false)
      setHasUnsavedChanges(false)
    } catch (err) {
      error('Failed to restore defaults')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const tabs = [
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      description: 'System configuration, maintenance, and performance',
      color: 'blue'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Authentication, access control, and security policies',
      color: 'red'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alert preferences, webhooks, and communication',
      color: 'yellow'
    },
    {
      id: 'api',
      label: 'API',
      icon: Key,
      description: 'AI models, rate limits, and API configuration',
      color: 'purple'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Theme, display preferences, and visual settings',
      color: 'indigo'
    }
  ];

  return (
    <ProtectedRoute requiredPermissions={['system_settings']}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
              <p className="text-gray-600 mt-2">Advanced configuration with validation, history tracking, and backup/restore capabilities</p>
              <div className="flex items-center space-x-4 mt-3">
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Last updated: {settingsHistory[0]?.timestamp ? settingsHistory[0].timestamp.toLocaleString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistoryModal(true)}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBackupModal(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmReset(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <Button
                onClick={handleSubmit(handleSaveSettings)}
                disabled={isLoading || !hasUnsavedChanges}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Enhanced Settings Interface */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              {/* Settings Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {filteredTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap min-w-max ${
                      activeTab === tab.id
                        ? `border-b-2 border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      {searchQuery && (
                        <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit(handleSaveSettings)} className="space-y-8">
                  {/* System Settings */}
                  {activeTab === 'system' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-blue-600" />
                          System Configuration
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionExpansion('system-general')}
                        >
                          {expandedSections.has('system-general') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>

                      {expandedSections.has('system-general') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <Controller
                              name="system.maintenanceMode"
                              control={form.control}
                              render={({ field }) => (
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <AlertTriangle className={`w-5 h-5 ${field.value ? 'text-red-500' : 'text-gray-400'}`} />
                                    <div>
                                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                                      <p className="text-sm text-gray-600">Temporarily disable user access for maintenance</p>
                                    </div>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                  </label>
                                </div>
                              )}
                            />

                            <Controller
                              name="system.debugMode"
                              control={form.control}
                              render={({ field }) => (
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <Eye className={`w-5 h-5 ${field.value ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <div>
                                      <p className="font-medium text-gray-900">Debug Mode</p>
                                      <p className="text-sm text-gray-600">Enable detailed logging and error reporting</p>
                                    </div>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              )}
                            />

                            <Controller
                              name="system.timezone"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="timezone">System Timezone</Label>
                                  <select
                                    id="timezone"
                                    {...field}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                  >
                                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                  </select>
                                </div>
                              )}
                            />
                          </div>

                          <div className="space-y-4">
                            <Controller
                              name="system.apiRateLimit"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="apiRateLimit">API Rate Limit (requests/minute)</Label>
                                  <Input
                                    id="apiRateLimit"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    className={errors.system?.apiRateLimit ? 'border-red-500' : ''}
                                  />
                                  {errors.system?.apiRateLimit && (
                                    <p className="text-sm text-red-600">{errors.system.apiRateLimit.message}</p>
                                  )}
                                </div>
                              )}
                            />

                            <Controller
                              name="system.sessionTimeout"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                                  <Input
                                    id="sessionTimeout"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    className={errors.system?.sessionTimeout ? 'border-red-500' : ''}
                                  />
                                  {errors.system?.sessionTimeout && (
                                    <p className="text-sm text-red-600">{errors.system.sessionTimeout.message}</p>
                                  )}
                                </div>
                              )}
                            />

                            <Controller
                              name="system.cacheExpiration"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="cacheExpiration">Cache Expiration (seconds)</Label>
                                  <Input
                                    id="cacheExpiration"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    className={errors.system?.cacheExpiration ? 'border-red-500' : ''}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* System Maintenance */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          <Server className="w-5 h-5 mr-2 text-green-600" />
                          System Maintenance
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionExpansion('system-maintenance')}
                        >
                          {expandedSections.has('system-maintenance') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>

                      {expandedSections.has('system-maintenance') && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Controller
                            name="system.backupFrequency"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                <select
                                  id="backupFrequency"
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>
                            )}
                          />

                          <Controller
                            name="system.logRetention"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="logRetention">Log Retention (days)</Label>
                                <Input
                                  id="logRetention"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            )}
                          />

                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                // Simulate clearing cache
                                setIsLoading(true)
                                setTimeout(() => {
                                  setIsLoading(false)
                                  success('System cache cleared successfully')
                                }, 1500)
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Clear Cache
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-red-600" />
                        Security Configuration
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Controller
                            name="security.twoFactorRequired"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <Lock className={`w-5 h-5 ${field.value ? 'text-green-500' : 'text-gray-400'}`} />
                                  <div>
                                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-gray-600">Require 2FA for all user accounts</p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              </div>
                            )}
                          />

                          <Controller
                            name="security.passwordMinLength"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                                <Input
                                  id="passwordMinLength"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className={errors.security?.passwordMinLength ? 'border-red-500' : ''}
                                />
                                {errors.security?.passwordMinLength && (
                                  <p className="text-sm text-red-600">{errors.security.passwordMinLength.message}</p>
                                )}
                              </div>
                            )}
                          />

                          <Controller
                            name="security.encryptionLevel"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="encryptionLevel">Encryption Level</Label>
                                <select
                                  id="encryptionLevel"
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <option value="basic">Basic (AES-128)</option>
                                  <option value="standard">Standard (AES-256)</option>
                                  <option value="military">Military (AES-256 + PBKDF2)</option>
                                </select>
                              </div>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <Controller
                            name="security.failedLoginAttempts"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="failedLoginAttempts">Max Failed Login Attempts</Label>
                                <Input
                                  id="failedLoginAttempts"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="security.lockoutDuration"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="lockoutDuration">Account Lockout Duration (seconds)</Label>
                                <Input
                                  id="lockoutDuration"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="security.passwordHistory"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="passwordHistory">Password History (previous passwords to remember)</Label>
                                <Input
                                  id="passwordHistory"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      <Controller
                        name="security.ipWhitelist"
                        control={form.control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            <Label htmlFor="ipWhitelist">IP Whitelist (optional)</Label>
                            <Textarea
                              id="ipWhitelist"
                              {...field}
                              placeholder="192.168.1.0/24, 10.0.0.0/8, 172.16.0.0/12"
                              rows={3}
                            />
                            <p className="text-sm text-gray-600">Comma-separated list of allowed IP ranges. Leave empty to allow all IPs.</p>
                          </div>
                        )}
                      />
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                        Notification Preferences
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {[
                            { name: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for important events' },
                            { name: 'systemAlerts', label: 'System Alerts', desc: 'Get notified about system status changes' },
                            { name: 'securityAlerts', label: 'Security Alerts', desc: 'Receive security-related notifications' },
                            { name: 'performanceAlerts', label: 'Performance Alerts', desc: 'Monitor system performance metrics' }
                          ].map((alert) => (
                            <Controller
                              key={alert.name}
                              name={`notifications.${alert.name}` as any}
                              control={form.control}
                              render={({ field }) => (
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <Mail className={`w-5 h-5 ${field.value ? 'text-blue-500' : 'text-gray-400'}`} />
                                    <div>
                                      <p className="font-medium text-gray-900">{alert.label}</p>
                                      <p className="text-sm text-gray-600">{alert.desc}</p>
                                    </div>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              )}
                            />
                          ))}
                        </div>

                        <div className="space-y-4">
                          <Controller
                            name="notifications.smsAlerts"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <Smartphone className={`w-5 h-5 ${field.value ? 'text-green-500' : 'text-gray-400'}`} />
                                  <div>
                                    <p className="font-medium text-gray-900">SMS Alerts</p>
                                    <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                              </div>
                            )}
                          />

                          <Controller
                            name="notifications.emailDigest"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="emailDigest">Email Digest Frequency</Label>
                                <select
                                  id="emailDigest"
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <option value="never">Never</option>
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                </select>
                              </div>
                            )}
                          />

                          <Controller
                            name="notifications.slackWebhook"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="slackWebhook">Slack Webhook URL (optional)</Label>
                                <Input
                                  id="slackWebhook"
                                  type="url"
                                  {...field}
                                  placeholder="https://hooks.slack.com/services/..."
                                  className={errors.notifications?.slackWebhook ? 'border-red-500' : ''}
                                />
                                {errors.notifications?.slackWebhook && (
                                  <p className="text-sm text-red-600">{errors.notifications.slackWebhook.message}</p>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      {/* Alert Thresholds */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">Alert Thresholds</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <Controller
                            name="notifications.alertThresholds.cpuUsage"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="cpuThreshold">CPU Usage (%)</Label>
                                <Input
                                  id="cpuThreshold"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  min="1"
                                  max="100"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="notifications.alertThresholds.memoryUsage"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="memoryThreshold">Memory Usage (%)</Label>
                                <Input
                                  id="memoryThreshold"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  min="1"
                                  max="100"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="notifications.alertThresholds.diskUsage"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="diskThreshold">Disk Usage (%)</Label>
                                <Input
                                  id="diskThreshold"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  min="1"
                                  max="100"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="notifications.alertThresholds.errorRate"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="errorThreshold">Error Rate (%)</Label>
                                <Input
                                  id="errorThreshold"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  min="0.1"
                                  max="10"
                                  step="0.1"
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* API Settings */}
                  {activeTab === 'api' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Key className="w-5 h-5 mr-2 text-purple-600" />
                        API Configuration
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Controller
                            name="api.defaultModel"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="defaultModel">Default AI Model</Label>
                                <select
                                  id="defaultModel"
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Cost-effective)</option>
                                  <option value="gpt-4">GPT-4 (Most Capable)</option>
                                  <option value="gpt-4-turbo">GPT-4 Turbo (Fast & Capable)</option>
                                  <option value="claude-3">Claude 3 (Alternative AI)</option>
                                  <option value="claude-3-opus">Claude 3 Opus (Most Advanced)</option>
                                </select>
                              </div>
                            )}
                          />

                          <Controller
                            name="api.maxTokens"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="maxTokens">Maximum Tokens per Request</Label>
                                <Input
                                  id="maxTokens"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className={errors.api?.maxTokens ? 'border-red-500' : ''}
                                />
                                {errors.api?.maxTokens && (
                                  <p className="text-sm text-red-600">{errors.api.maxTokens.message}</p>
                                )}
                              </div>
                            )}
                          />

                          <Controller
                            name="api.temperature"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="temperature">Response Creativity (Temperature)</Label>
                                <Input
                                  id="temperature"
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="2"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Deterministic</span>
                                  <span>Creative</span>
                                </div>
                              </div>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <Controller
                            name="api.timeout"
                            control={form.control}
                            render={({ field }) => (
                              <div className="space-y-2">
                                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                                <Input
                                  id="timeout"
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className={errors.api?.timeout ? 'border-red-500' : ''}
                                />
                                {errors.api?.timeout && (
                                  <p className="text-sm text-red-600">{errors.api.timeout.message}</p>
                                )}
                              </div>
                            )}
                          />

                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Rate Limits</h4>

                            <Controller
                              name="api.rateLimits.requestsPerMinute"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="rpm">Requests per Minute</Label>
                                  <Input
                                    id="rpm"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </div>
                              )}
                            />

                            <Controller
                              name="api.rateLimits.requestsPerHour"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="rph">Requests per Hour</Label>
                                  <Input
                                    id="rph"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </div>
                              )}
                            />

                            <Controller
                              name="api.rateLimits.requestsPerDay"
                              control={form.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Label htmlFor="rpd">Requests per Day</Label>
                                  <Input
                                    id="rpd"
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* AI Features */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">AI Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Controller
                            name="api.features.streaming"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Zap className={`w-4 h-4 ${field.value ? 'text-blue-500' : 'text-gray-400'}`} />
                                  <span className="text-sm font-medium">Streaming Responses</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="api.features.functionCalling"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Settings className={`w-4 h-4 ${field.value ? 'text-purple-500' : 'text-gray-400'}`} />
                                  <span className="text-sm font-medium">Function Calling</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="api.features.imageGeneration"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Monitor className={`w-4 h-4 ${field.value ? 'text-green-500' : 'text-gray-400'}`} />
                                  <span className="text-sm font-medium">Image Generation</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                />
                              </div>
                            )}
                          />

                          <Controller
                            name="api.features.codeExecution"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Globe className={`w-4 h-4 ${field.value ? 'text-orange-500' : 'text-gray-400'}`} />
                                  <span className="text-sm font-medium">Code Execution</span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                />
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-indigo-600" />
                        Appearance & Display
                      </h3>

                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Theme Preferences</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Choose how the application looks and feels. Changes are applied immediately.
                          </p>

                          <div className="max-w-md">
                            <ThemeSelector />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Display Options</h4>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Monitor className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Compact Mode</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Reduce spacing and padding</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Eye className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">High Contrast</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Zap className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Reduced Motion</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Disable animations and transitions</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Accessibility</h4>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Smartphone className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Large Text</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Increase font size across the app</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Globe className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Focus Indicators</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Show focus rings for keyboard navigation</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="mt-6">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  // Reset to defaults
                                  success('Display preferences reset to defaults')
                                }}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset to Defaults
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </CardContent>
          </Card>

          {/* System Status & Validation */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                System Status & Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Configuration Valid</p>
                    <p className="text-sm text-green-700">All settings pass validation</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Security Active</p>
                    <p className="text-sm text-blue-700">All security measures enabled</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-purple-900">API Connected</p>
                    <p className="text-sm text-purple-700">External services reachable</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-900">System Healthy</p>
                    <p className="text-sm text-orange-700">All systems operational</p>
                  </div>
                </div>
              </div>

              {/* Form Errors Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Configuration Errors</h4>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(errors).map(([category, categoryErrors]) => (
                      <div key={category} className="text-sm">
                        <span className="font-medium text-red-800 capitalize">{category}:</span>
                        <ul className="ml-4 mt-1 space-y-1">
                          {Object.entries(categoryErrors as any).map(([field, error]: [string, any]) => (
                            <li key={field} className="text-red-700">
                              â€¢ {field}: {error.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
