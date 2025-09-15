import { Metadata } from 'next'
import { Shield, Settings, Users, BarChart3, Server, Database } from 'lucide-react'
import AdminProtected from '@/components/auth/AdminProtected'

export const metadata: Metadata = {
  title: 'Scalix Admin Dashboard',
  description: 'Super Admin Dashboard for Scalix Ecosystem Management',
}

const adminNavItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/admin', active: true },
  { icon: Server, label: 'System Health', href: '/admin/health', active: false },
  { icon: Users, label: 'User Management', href: '/admin/users', active: false },
  { icon: Database, label: 'Data Analytics', href: '/admin/analytics', active: false },
  { icon: Settings, label: 'System Config', href: '/admin/config', active: false },
  { icon: Shield, label: 'Security', href: '/admin/security', active: false },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtected requiredPermission="admin">
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),rgba(255,255,255,0))]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Scalix Admin</h1>
                <p className="text-sm text-gray-600">AI Platform Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All Systems Operational</span>
              </div>

              <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                Emergency Shutdown
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Admin Sidebar */}
        <nav className="w-64 bg-white/80 backdrop-blur-md shadow-sm min-h-screen border-r border-gray-200">
          <div className="p-4">
            <div className="space-y-2">
              {adminNavItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Requests</span>
                  <span className="text-sm font-medium text-gray-900">45.2K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Load</span>
                  <span className="text-sm font-medium text-green-600">23%</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AdminProtected>
  )
}
