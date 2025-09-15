'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  BarChart3,
  CreditCard,
  Settings,
  Users,
  FolderOpen,
  Shield,
  Menu,
  X,
  Key
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminItems = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export function Sidebar({ isOpen, onToggle, className }: SidebarProps) {
  const pathname = usePathname() || ''
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: isMobile ? "-100%" : "-280px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 backdrop-blur-md bg-white/10 border-r border-white/20 shadow-xl",
          "flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-white font-semibold">Scalix</span>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="md:hidden text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
              Main
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-white/10 hover:text-white",
                      isActive
                        ? "bg-primary-600/20 text-primary-100 border-r-2 border-primary-400"
                        : "text-white/80"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Admin Section */}
          <div className="space-y-1 pt-4">
            <div className="px-3 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
              Admin
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-white/10 hover:text-white",
                      isActive
                        ? "bg-red-600/20 text-red-100 border-r-2 border-red-400"
                        : "text-white/80"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 text-center">
            Scalix v0.21.0
          </div>
        </div>
      </motion.aside>

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <Button
          variant="glass"
          size="icon"
          onClick={onToggle}
          className={cn(
            "fixed top-4 z-40 transition-all duration-300",
            isOpen ? "left-64" : "left-4"
          )}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
