'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import { SUPER_ADMIN } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/lib/slices/authSlice'
import { Shield, Zap, Users, Settings } from 'lucide-react'

export function SuperAdminFill() {
  const [isVisible, setIsVisible] = useState(false)
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleSuperAdminLogin = () => {
    if (password === SUPER_ADMIN.password) {
      const adminUser = {
        id: 'super-admin-001',
        email: SUPER_ADMIN.email,
        name: SUPER_ADMIN.name,
        avatar: '',
        plan: 'enterprise' as const,
        role: 'super_admin' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch(setCredentials({
        user: adminUser,
        token: 'super-admin-token-dev-mode'
      }))

      setIsVisible(false)
      setPassword('')
    }
  }

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          variant="glass"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="backdrop-blur-md bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
        >
          <Shield className="w-4 h-4 mr-2" />
          Dev Admin
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => setIsVisible(false)}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4"
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-red-400" />
              <CardTitle className="text-red-400">Super Admin Access</CardTitle>
            </div>
            <CardDescription>
              Development mode - Instant admin login for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-300">Admin Email</label>
                <div className="p-2 bg-red-500/10 border border-red-400/30 rounded text-sm text-red-200">
                  {SUPER_ADMIN.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-300">Admin Name</label>
                <div className="p-2 bg-red-500/10 border border-red-400/30 rounded text-sm text-red-200">
                  {SUPER_ADMIN.name}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-red-300">Password</label>
              <Input
                type="password"
                placeholder="Enter super admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-red-500/10 border-red-400/30 text-red-200 placeholder:text-red-400/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-400/30">
                <Zap className="w-3 h-3 mr-1" />
                Enterprise Plan
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                <Users className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSuperAdminLogin}
                disabled={!password}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Login as Super Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsVisible(false)}
                className="border-red-400/30 text-red-300 hover:bg-red-500/10"
              >
                Cancel
              </Button>
            </div>

            <div className="text-xs text-red-400/70 text-center">
              ⚠️ Development mode only - Not available in production
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
