'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Bell,
  Key,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  AlertTriangle,
  Loader2,
  Check
} from 'lucide-react'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  bio: string
  profilePicture: string | null
  twoFactorEnabled: boolean
  activeSessions: Array<{
    id: string
    name: string
    device: string
    lastActive: string
    isCurrent: boolean
  }>
  notificationSettings: {
    email: boolean
    projectUpdates: boolean
    teamActivity: boolean
    billingAlerts: boolean
  }
  appearanceSettings: {
    theme: string
    language: string
    timezone: string
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'api' | 'appearance'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Form states
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notificationData, setNotificationData] = useState({
    email: true,
    projectUpdates: true,
    teamActivity: false,
    billingAlerts: true
  })
  const [appearanceData, setAppearanceData] = useState({
    theme: 'light',
    language: 'en-US',
    timezone: 'UTC-8'
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        setProfileData({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          company: result.data.company,
          bio: result.data.bio
        })
        setNotificationData(result.data.notificationSettings)
        setAppearanceData(result.data.appearanceSettings)
      } else {
        setErrorMessage('Failed to load user data')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      setErrorMessage('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      showError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      })
      const result = await response.json()
      if (result.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error updating password:', error)
      showError('Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const toggle2FA = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !userData?.twoFactorEnabled })
      })
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error)
      showError('Failed to update 2FA settings')
    } finally {
      setSaving(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/settings?action=session&sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setUserData(prev => prev ? {
          ...prev,
          activeSessions: prev.activeSessions.filter(s => s.id !== sessionId)
        } : null)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error revoking session:', error)
      showError('Failed to revoke session')
    } finally {
      setSaving(false)
    }
  }

  const updateNotifications = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      })
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      showError('Failed to update notification settings')
    } finally {
      setSaving(false)
    }
  }

  const updateAppearance = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appearanceData)
      })
      const result = await response.json()
      if (result.success) {
        setUserData(result.data)
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error updating appearance:', error)
      showError('Failed to update appearance settings')
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    setSaving(true)
    try {
      const response = await fetch('/api/settings?action=account', {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      showError('Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveChanges = () => {
    switch (activeTab) {
      case 'profile':
        saveProfile()
        break
      case 'security':
        updatePassword()
        break
      case 'notifications':
        updateNotifications()
        break
      case 'appearance':
        updateAppearance()
        break
      default:
        showError('No changes to save')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        <Button 
          onClick={handleSaveChanges}
          disabled={saving}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
        >
          <Check className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{errorMessage}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                  <p className="text-gray-600">Update your personal information and profile details.</p>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      className="mb-2"
                      onClick={() => {
                        // In production, this would open a file picker
                        showSuccess('Photo upload functionality coming soon!')
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-gray-600">Manage your password and security preferences.</p>
                </div>

                {/* Change Password */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <Button>Update Password</Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${userData?.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">{userData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      onClick={toggle2FA}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {userData?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>

                  <div className="space-y-3">
                    {userData?.activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{session.name}</p>
                          <p className="text-sm text-gray-600">{session.device} • {session.lastActive}</p>
                        </div>
                        {session.isCurrent ? (
                          <span className="text-green-600 text-sm font-medium">Current</span>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => revokeSession(session.id)}
                            disabled={saving}
                          >
                            {saving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Revoke'
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification Preferences</h2>
                  <p className="text-gray-600">Choose how you want to be notified about your projects and team activity.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationData.email}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, email: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Project Updates</h3>
                      <p className="text-gray-600">Get notified when your projects are updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationData.projectUpdates}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, projectUpdates: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Team Activity</h3>
                      <p className="text-gray-600">Notifications about team member activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationData.teamActivity}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, teamActivity: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Billing Alerts</h3>
                      <p className="text-gray-600">Important billing and payment notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationData.billingAlerts}
                        onChange={(e) => setNotificationData(prev => ({ ...prev, billingAlerts: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Settings */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">API Keys</h2>
                  <p className="text-gray-600">Manage your API keys for programmatic access to Scalix services.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Production API Key</h3>
                      <p className="text-gray-600">sk-live-••••••••••••••••••••••••••••••••</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-sm font-medium">Active</span>
                      <Button variant="outline" size="sm">Regenerate</Button>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Created: January 15, 2025</p>
                    <p>Last used: 2 minutes ago</p>
                    <p>Requests today: 1,247</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Development API Key</h3>
                      <p className="text-gray-600">sk-dev-••••••••••••••••••••••••••••••••</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-sm font-medium">Active</span>
                      <Button variant="outline" size="sm">Regenerate</Button>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Created: January 15, 2025</p>
                    <p>Last used: 5 hours ago</p>
                    <p>Requests today: 89</p>
                  </div>
                </div>

                <Button className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Create New API Key
                </Button>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Appearance</h2>
                  <p className="text-gray-600">Customize the look and feel of your Scalix dashboard.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border-2 border-blue-500 rounded-lg p-4 cursor-pointer">
                        <div className="w-full h-16 bg-white rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer">
                        <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">System</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                    <select 
                      value={appearanceData.language}
                      onChange={(e) => setAppearanceData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-UK">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Timezone</h3>
                    <select 
                      value={appearanceData.timezone}
                      onChange={(e) => setAppearanceData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (Central European Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={deleteAccount}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
