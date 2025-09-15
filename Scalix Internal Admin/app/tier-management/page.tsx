'use client'

import React, { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading, PageLoading, TableSkeleton } from '@/components/ui/loading'
import { Modal, FormModal, ConfirmModal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Crown,
  Zap,
  Database,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  GripVertical,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  DollarSign,
  Activity,
  Eye,
  Copy,
  MoveUp,
  MoveDown,
  Settings,
  Save,
  X
} from 'lucide-react'

interface Tier {
  id: string
  name: string
  displayName: string
  description: string
  price: number
  userCount: number
  isActive: boolean
  features: string[]
  monthlyRevenue: number
  apiUsage: number
  growth: number
  churnRate: number
  satisfaction: number
  color: string
  order: number
}

export default function TierManagement() {
  const { success, error, info } = useToast()

  const [tiers, setTiers] = useState<Tier[]>([
    {
      id: 'starter',
      name: 'starter',
      displayName: 'Starter Plan',
      description: 'Perfect for getting started with AI applications',
      price: 990, // $9.90
      userCount: 234,
      isActive: true,
      features: ['Basic AI Models', '100 API Calls/day', 'Community Support'],
      monthlyRevenue: 2317,
      apiUsage: 15600,
      growth: 12.5,
      churnRate: 8.2,
      satisfaction: 4.2,
      color: 'bg-blue-500',
      order: 1
    },
    {
      id: 'pro',
      name: 'pro',
      displayName: 'Pro Plan',
      description: 'Advanced features for growing businesses',
      price: 2990, // $29.90
      userCount: 89,
      isActive: true,
      features: ['Premium AI Models', '1000 API Calls/day', 'Priority Support', 'Advanced Analytics'],
      monthlyRevenue: 2661,
      apiUsage: 45200,
      growth: 23.8,
      churnRate: 4.1,
      satisfaction: 4.7,
      color: 'bg-purple-500',
      order: 2
    },
    {
      id: 'enterprise',
      name: 'enterprise',
      displayName: 'Enterprise Plan',
      description: 'Full-scale solution for large organizations',
      price: 9990, // $99.90
      userCount: 12,
      isActive: true,
      features: ['All AI Models', 'Unlimited API Calls', 'Dedicated Support', 'Custom Integrations', 'White-label Solution'],
      monthlyRevenue: 11988,
      apiUsage: 156000,
      growth: 8.3,
      churnRate: 1.2,
      satisfaction: 4.9,
      color: 'bg-yellow-500',
      order: 3
    }
  ])

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'analytics' | 'comparison'>('cards')
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  // Modals
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [tierToDelete, setTierToDelete] = useState<string>('')

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Computed values
  const sortedTiers = useMemo(() => {
    return [...tiers].sort((a, b) => a.order - b.order)
  }, [tiers])

  const totalRevenue = useMemo(() => {
    return tiers.reduce((sum, tier) => sum + tier.monthlyRevenue, 0)
  }, [tiers])

  const totalUsers = useMemo(() => {
    return tiers.reduce((sum, tier) => sum + tier.userCount, 0)
  }, [tiers])

  const averageGrowth = useMemo(() => {
    return tiers.reduce((sum, tier) => sum + tier.growth, 0) / tiers.length
  }, [tiers])

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTiers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const reorderedItems = arrayMove(items, oldIndex, newIndex)

        // Update order values
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1
        }))

        success('Tier order updated successfully')
        return updatedItems
      })
    }
  }

  // Tier management handlers
  const handleCreateTier = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newTier: Tier = {
        id: `tier-${Date.now()}`,
        name: 'new-tier',
        displayName: 'New Tier',
        description: 'A new subscription tier',
        price: 1990,
        userCount: 0,
        isActive: true,
        features: ['Basic Features'],
        monthlyRevenue: 0,
        apiUsage: 0,
        growth: 0,
        churnRate: 0,
        satisfaction: 0,
        color: 'bg-gray-500',
        order: tiers.length + 1
      }

      setTiers([...tiers, newTier])
      setShowCreateForm(false)
      success('New tier created successfully')
    } catch (err) {
      error('Failed to create tier')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTier = (tier: Tier) => {
    setSelectedTier(tier)
    setShowEditForm(true)
  }

  const handleSaveTier = async () => {
    if (!selectedTier) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTiers(tiers.map(t => t.id === selectedTier.id ? selectedTier : t))
      setSelectedTier(null)
      setShowEditForm(false)
      success('Tier updated successfully')
    } catch (err) {
      error('Failed to update tier')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTier = (tierId: string) => {
    setTierToDelete(tierId)
    setShowConfirmDialog(true)
  }

  const confirmDeleteTier = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setTiers(tiers.filter(t => t.id !== tierToDelete))
      setShowConfirmDialog(false)
      setTierToDelete('')
      success('Tier deleted successfully')
    } catch (err) {
      error('Failed to delete tier')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTierStatus = async (tierId: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      setTiers(tiers.map(t =>
        t.id === tierId ? { ...t, isActive: !t.isActive } : t
      ))

      const tier = tiers.find(t => t.id === tierId)
      success(`${tier?.displayName} ${!tier?.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      error('Failed to update tier status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAnalytics = (tier: Tier) => {
    setSelectedTier(tier)
    setShowAnalytics(true)
  }

  const handleDuplicateTier = (tier: Tier) => {
    const duplicatedTier: Tier = {
      ...tier,
      id: `tier-${Date.now()}`,
      name: `${tier.name}-copy`,
      displayName: `${tier.displayName} (Copy)`,
      userCount: 0,
      monthlyRevenue: 0,
      apiUsage: 0,
      order: tiers.length + 1
    }

    setTiers([...tiers, duplicatedTier])
    success('Tier duplicated successfully')
  }

  // Sortable Tier Item Component
  function SortableTierItem({ tier }: { tier: Tier }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: tier.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group ${isDragging ? 'z-50 opacity-50' : ''}`}
      >
        <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200/60 group">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${tier.color.replace('bg-', 'bg-')} animate-pulse`} />
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {tier.displayName}
                      {tier.name === 'enterprise' && <Crown className="w-4 h-4 text-yellow-500" />}
                      {!tier.isActive && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewAnalytics(tier)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicateTier(tier)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditTier(tier)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTier(tier.id)}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">${(tier.price / 100).toFixed(2)}</div>
                <div className="text-xs text-gray-600">Monthly Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tier.userCount}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${tier.monthlyRevenue.toFixed(0)}K</div>
                <div className="text-xs text-gray-600">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{tier.growth.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Growth</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>{tier.apiUsage.toLocaleString()} calls</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span>{tier.churnRate.toFixed(1)}% churn</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>{tier.satisfaction.toFixed(1)}★ rating</span>
                </div>
              </div>

              <Button
                variant={tier.isActive ? "outline" : "default"}
                size="sm"
                onClick={() => handleToggleTierStatus(tier.id)}
                disabled={isLoading}
                className={tier.isActive ? "text-red-600 border-red-300 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"}
              >
                {tier.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {tier.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {tier.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{tier.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermissions={['manage_tiers']}>
      <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tier Management</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage subscription tiers with advanced analytics and drag-drop reordering</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), 1000)
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateForm(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Tier
            </Button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown className="w-4 h-4 inline mr-2" />
            Tier Cards
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'analytics'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'comparison'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-2" />
            Comparison
          </button>
        </div>

        {/* Analytics Overview */}
        {viewMode === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(0)}K</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{averageGrowth.toFixed(1)}% avg growth
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                    <div className="flex items-center text-xs text-blue-600 mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      Across {tiers.length} tiers
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(tiers.reduce((sum, t) => sum + t.satisfaction, 0) / tiers.length).toFixed(1)}★
                    </p>
                    <div className="flex items-center text-xs text-purple-600 mt-1">
                      <Target className="w-3 h-3 mr-1" />
                      Customer rating
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Churn Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(tiers.reduce((sum, t) => sum + t.churnRate, 0) / tiers.length).toFixed(1)}%
                    </p>
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Industry avg: 5.2%
                    </div>
                  </div>
                  <Activity className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tier Cards with Drag & Drop */}
        {viewMode === 'cards' && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortedTiers.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 gap-6">
                {sortedTiers.map((tier) => (
                  <SortableTierItem key={tier.id} tier={tier} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Tier Comparison View */}
        {viewMode === 'comparison' && (
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-red-600" />
                Tier Comparison Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Metric</th>
                      {sortedTiers.map(tier => (
                        <th key={tier.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {tier.displayName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Price</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className="px-4 py-3 text-center text-sm text-gray-900">
                          ${(tier.price / 100).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Users</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className="px-4 py-3 text-center text-sm text-gray-900">
                          {tier.userCount}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Revenue</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className="px-4 py-3 text-center text-sm text-green-600 font-medium">
                          ${tier.monthlyRevenue.toFixed(0)}K
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Growth</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className={`px-4 py-3 text-center text-sm font-medium ${
                          tier.growth > 15 ? 'text-green-600' : tier.growth > 5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {tier.growth.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Churn Rate</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className={`px-4 py-3 text-center text-sm font-medium ${
                          tier.churnRate < 3 ? 'text-green-600' : tier.churnRate < 7 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {tier.churnRate.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">Satisfaction</td>
                      {sortedTiers.map(tier => (
                        <td key={tier.id} className={`px-4 py-3 text-center text-sm font-medium ${
                          tier.satisfaction > 4.5 ? 'text-green-600' : tier.satisfaction > 4 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {tier.satisfaction.toFixed(1)}★
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Tier Modal */}
        <FormModal
          isOpen={showCreateForm || showEditForm}
          onClose={() => {
            setShowCreateForm(false)
            setShowEditForm(false)
            setSelectedTier(null)
          }}
          title={showCreateForm ? "Create New Tier" : `Edit Tier: ${selectedTier?.displayName}`}
          onSubmit={(e) => {
            e.preventDefault()
            if (showCreateForm) {
              handleCreateTier()
            } else {
              handleSaveTier()
            }
          }}
          submitText={showCreateForm ? "Create Tier" : "Save Changes"}
          isSubmitting={isLoading}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={selectedTier?.displayName || ''}
                onChange={(e) => setSelectedTier(prev => prev ? {...prev, displayName: e.target.value} : null)}
                placeholder="e.g., Premium Plan"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Monthly Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={selectedTier?.price ? (selectedTier.price / 100).toFixed(2) : ''}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0
                  setSelectedTier(prev => prev ? {...prev, price: Math.round(price * 100)} : null)
                }}
                placeholder="29.90"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={selectedTier?.description || ''}
                onChange={(e) => setSelectedTier(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Describe this tier for customers..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Color Theme</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-500'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedTier(prev => prev ? {...prev, color} : null)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedTier?.color === color ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'
                    } ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </FormModal>

        {/* Tier Analytics Modal */}
        <Modal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          title={`${selectedTier?.displayName} Analytics`}
          size="lg"
        >
          {selectedTier && (
            <div className="space-y-6">
              {/* Analytics Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${selectedTier.color.replace('bg-', 'bg-')} animate-pulse`} />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTier.displayName}</h3>
                    <p className="text-sm text-gray-600">{selectedTier.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTier.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTier.userCount}</div>
                  <div className="text-sm text-blue-600">Active Users</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">${selectedTier.monthlyRevenue.toFixed(0)}K</div>
                  <div className="text-sm text-green-600">Revenue</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedTier.growth.toFixed(1)}%</div>
                  <div className="text-sm text-purple-600">Growth Rate</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedTier.satisfaction.toFixed(1)}★</div>
                  <div className="text-sm text-orange-600">Satisfaction</div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">API Usage</span>
                      <span className="font-medium">{selectedTier.apiUsage.toLocaleString()} calls</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className={`font-medium ${selectedTier.churnRate < 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTier.churnRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-medium text-blue-600">
                        {((selectedTier.userCount / Math.max(totalUsers, 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Revenue Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Monthly Price</span>
                      <span className="font-medium">${(selectedTier.price / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                      <span className="font-medium text-green-600">${selectedTier.monthlyRevenue.toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Revenue per User</span>
                      <span className="font-medium text-purple-600">
                        ${(selectedTier.userCount > 0 ? (selectedTier.monthlyRevenue * 1000 / selectedTier.userCount).toFixed(0) : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Tier Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTier.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Confirmation Dialog */}
        <ConfirmModal
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmDeleteTier}
          title="Delete Tier"
          description={`Are you sure you want to delete "${tiers.find(t => t.id === tierToDelete)?.displayName}"? This action cannot be undone and will affect ${tiers.find(t => t.id === tierToDelete)?.userCount || 0} users.`}
          variant="danger"
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
    </ProtectedRoute>
  )
}
