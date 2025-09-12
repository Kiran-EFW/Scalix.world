// User Types
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  createdAt: Date
  updatedAt: Date
  emailVerified: boolean
  lastLoginAt?: Date
}

export interface UserProfile extends User {
  bio?: string
  website?: string
  location?: string
  company?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    browser: boolean
    marketing: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    dataSharing: boolean
  }
}

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    tokens: number
    projects: number
    storage: string
    users: number
  }
  popular?: boolean
}

// Billing Types
export interface Invoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  billingReason: 'subscription_cycle' | 'subscription_create' | 'subscription_update'
  createdAt: Date
  dueDate?: Date
  paidAt?: Date
  pdfUrl?: string
  hostedInvoiceUrl?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  bankAccount?: {
    bankName: string
    last4: string
    routingNumber: string
  }
  isDefault: boolean
  createdAt: Date
}

// Usage Types
export interface UsageStats {
  userId: string
  period: {
    start: Date
    end: Date
  }
  tokens: {
    used: number
    limit: number
    remaining: number
  }
  costs: {
    total: number
    byModel: Record<string, number>
    byProject: Record<string, number>
  }
  projects: {
    count: number
    active: number
  }
}

export interface UsageEvent {
  id: string
  userId: string
  projectId?: string
  model: string
  tokens: number
  cost: number
  timestamp: Date
  endpoint: string
}

// Project Types
export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: Date
  updatedAt: Date
  lastActivityAt: Date
  settings: ProjectSettings
}

export interface ProjectSettings {
  framework?: string
  language?: string
  database?: string
  deployment?: string
  aiModels: string[]
  contextPaths: string[]
}

// Team Types
export interface Team {
  id: string
  name: string
  description?: string
  ownerId: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: Date
  updatedAt: Date
  settings: TeamSettings
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: Date
  invitedBy: string
  status: 'active' | 'invited' | 'removed'
}

export interface TeamSettings {
  defaultRole: 'member' | 'admin'
  requireApproval: boolean
  maxMembers: number
  billingOwner: string
}

// API Types
export interface ApiKey {
  id: string
  userId: string
  name: string
  key: string // This should never be sent to client
  permissions: string[]
  lastUsed?: Date
  createdAt: Date
  expiresAt?: Date
}

// Admin Types
export interface AdminStats {
  users: {
    total: number
    active: number
    newThisMonth: number
    churnRate: number
  }
  revenue: {
    monthlyRecurring: number
    totalRevenue: number
    averageRevenuePerUser: number
    growth: number
  }
  usage: {
    totalTokens: number
    averageTokensPerUser: number
    topModels: Array<{ model: string; usage: number }>
  }
  system: {
    uptime: number
    errorRate: number
    responseTime: number
  }
}

// Form Types
export interface SignInForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  name?: string
}

export interface ProfileForm {
  name: string
  email: string
  bio?: string
  website?: string
  location?: string
  company?: string
}

// Error Types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface ValidationError {
  field: string
  message: string
}

// Generic Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component Props Types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    label: string
    render?: (value: any, item: T) => React.ReactNode
  }>
  loading?: boolean
  pagination?: {
    page: number
    total: number
    onPageChange: (page: number) => void
  }
}
