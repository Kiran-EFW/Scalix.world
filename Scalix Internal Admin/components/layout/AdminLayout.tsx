'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useNotifications } from '@/lib/notification-context'
import { useAuditLogger } from '@/lib/audit-context'
import { useTheme } from '@/lib/theme-context'
import {
  Home,
  Settings,
  Users,
  BarChart3,
  Crown,
  Menu,
  X,
  Shield,
  Database,
  Activity,
  TrendingUp,
  ChevronDown,
  LogOut,
  Bell,
  BellRing,
  Key,
  Building2,
  DollarSign,
  MessageSquare,
  Eye,
  FileText
} from 'lucide-react'
import { LogoAdmin } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import NotificationPanel from '@/components/notifications/NotificationPanel'
import ThemeToggle from '@/components/theme/ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Content Management', href: '/content-management', icon: FileText },
  { name: 'Metrics', href: '/metrics', icon: BarChart3 },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'System Health', href: '/system-health', icon: Shield },
  { name: 'Tier Management', href: '/tier-management', icon: Crown },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Team Management', href: '/team', icon: Users },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Enterprise', href: '/enterprise', icon: Building2 },
  { name: 'Billing', href: '/billing', icon: DollarSign },
  { name: 'Support', href: '/support', icon: MessageSquare },
  { name: 'User Monitoring', href: '/user-monitoring', icon: Eye },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const { logAction } = useAuditLogger()
  const { theme, resolvedTheme } = useTheme()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logAction('User logout', 'authentication', 'LOGOUT', 'success')
    logout()
    router.push('/login')
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    if (userMenuOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen, notificationsOpen])

  // Add some sample notifications on mount (for demo)
  useEffect(() => {
    const addSampleNotifications = () => {
      // This would normally be handled by the notification service
      // For demo purposes, we'll add some sample notifications
    }
    addSampleNotifications()
  }, [])

  // Close sidebar when clicking on a link (mobile)
  const handleLinkClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-50 w-64 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none flex-shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-border/50 bg-gradient-to-r from-primary via-primary/90 to-primary/80 shadow-sm">
            <div className="flex items-center">
              <LogoAdmin size="lg" />
              <div className="ml-2">
                <p className="text-xs text-primary-foreground/80">Internal Administration</p>
              </div>
            </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden animate-fade-in",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                )}
                onClick={handleLinkClick}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={cn(
                  "w-5 h-5 mr-3 relative z-10 transition-all duration-200",
                  isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-105"
                )} />
                <span className="relative z-10 font-medium">{item.name}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/50 to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-medium text-foreground">System Online</span>
            </div>
            <div className="text-xs text-muted-foreground">
              v1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        {/* Modern Top bar */}
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-2 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-accent transition-all duration-200 active:scale-95"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="animate-slide-up">
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  {navigationItems.find(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">Powered by Scalix Cloud API</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <div className="relative">
                    <Database className="w-4 h-4 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-green-700">API: Online</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Users: 1,247</span>
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle variant="icon" size="md" />

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  {unreadCount > 0 ? (
                    <BellRing className="w-5 h-5 text-blue-600 animate-pulse" />
                  ) : (
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>

                <NotificationPanel
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                />
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-95 border border-gray-200/60"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform duration-200",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-200 theme-transition">
                    <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-xl theme-transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full capitalize font-medium">
                          {user?.role}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Last login: {new Date(user?.lastLogin || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center space-x-3 group"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modern Page content */}
        <main className="p-2 lg:p-3 animate-fade-in bg-gradient-to-br from-background via-background to-muted/10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

