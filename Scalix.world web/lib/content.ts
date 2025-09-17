// Centralized Content Management System for Scalix
// This file manages all content across the application with reusable tiles and sections

export interface ContentTile {
  id: string
  title: string
  description: string
  icon?: string | React.ReactNode
  color?: string
  href?: string
  items?: string[]
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string
  category?: string
  featured?: boolean
  order?: number
}

export interface ContentSection {
  id: string
  title: string
  description: string
  tiles: ContentTile[]
  layout?: 'grid' | 'list' | 'masonry'
  maxTiles?: number
}

// Main content database - Add new content here
export const contentDatabase = {
  // Documentation sections
  docs: {
    gettingStarted: {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide to get Scalix up and running on your machine',
      tiles: [
        {
          id: 'installation',
          title: 'Installation & Setup',
          description: 'Step-by-step installation instructions for your platform',
          icon: '📦',
          href: '/docs/getting-started/installation',
          items: ['System Requirements', 'Download Options', 'First Launch', 'Configuration'],
          category: 'setup'
        },
        {
          id: 'first-project',
          title: 'Your First AI Project',
          description: 'Create and run your first AI-powered application',
          icon: '🚀',
          href: '/docs/getting-started/first-project',
          items: ['Project Creation', 'AI Model Selection', 'Basic Configuration', 'Testing'],
          category: 'tutorial'
        },
        {
          id: 'troubleshooting',
          title: 'Common Issues & Solutions',
          description: 'Fix common setup and runtime issues',
          icon: '🔧',
          href: '/docs/getting-started/troubleshooting',
          items: ['Installation Errors', 'Runtime Issues', 'Performance Tuning', 'Support'],
          category: 'support'
        }
      ]
    } as ContentSection,

    apiReference: {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation for integrating with Scalix',
      tiles: [
        {
          id: 'authentication',
          title: 'Authentication',
          description: 'Secure API access with API keys and JWT tokens',
          icon: '🔐',
          href: '/docs/api/authentication',
          items: ['API Keys', 'JWT Tokens', 'Rate Limits', 'Security'],
          category: 'api'
        },
        {
          id: 'chat-completions',
          title: 'Chat Completions',
          description: 'Generate AI responses with conversation context',
          icon: '💬',
          href: '/docs/api/chat-completions',
          items: ['Basic Usage', 'Streaming', 'Context Management', 'Examples'],
          category: 'api'
        },
        {
          id: 'models',
          title: 'AI Models',
          description: 'Available AI models and their capabilities',
          icon: '🤖',
          href: '/docs/api/models',
          items: ['Model Types', 'Performance', 'Pricing', 'Selection Guide'],
          category: 'api'
        }
      ]
    } as ContentSection
  },

  // Feature sections for homepage
  features: {
    coreFeatures: {
      id: 'core-features',
      title: 'Core Features',
      description: 'Essential features that power your AI development',
      tiles: [
        {
          id: 'local-first',
          title: 'Local-First Architecture',
          description: 'Keep your code and data private with our local-first approach',
          icon: '🔒',
          color: 'bg-blue-500'
        },
        {
          id: 'ai-powered',
          title: 'AI-Powered Development',
          description: 'Build intelligent applications faster with AI-assisted coding',
          icon: '🚀',
          color: 'bg-green-500'
        },
        {
          id: 'performance',
          title: 'Lightning Fast Performance',
          description: 'Optimized for speed with intelligent caching and monitoring',
          icon: '⚡',
          color: 'bg-yellow-500'
        },
        {
          id: 'enterprise-tools',
          title: 'Enterprise-Grade Tools',
          description: 'Professional development tools and deployment automation',
          icon: '🔧',
          color: 'bg-purple-500'
        },
        {
          id: 'privacy',
          title: 'Privacy by Design',
          description: 'Your code and data never leaves your machine',
          icon: '🛡️',
          color: 'bg-red-500'
        },
        {
          id: 'cross-platform',
          title: 'Cross-Platform Support',
          description: 'Build apps for desktop, web, and mobile platforms',
          icon: '📦',
          color: 'bg-indigo-500'
        }
      ]
    } as ContentSection,

    advancedFeatures: {
      id: 'advanced-features',
      title: 'Advanced Features',
      description: 'Cutting-edge features for professional AI development',
      tiles: [
        {
          id: 'scalix-engine',
          title: 'Scalix Engine',
          description: 'Advanced AI processing with lazy edits and smart context',
          icon: '⚙️',
          href: '/features/scalix-engine'
        },
        {
          id: 'smart-context',
          title: 'Smart Context',
          description: 'Intelligent file analysis and context extraction',
          icon: '🧠',
          href: '/features/smart-context'
        },
        {
          id: 'real-time-sync',
          title: 'Real-time Synchronization',
          description: 'Live data sync across all your devices and applications',
          icon: '🔄',
          href: '/features/real-time-sync'
        }
      ]
    } as ContentSection
  },

  // Tutorials and learning content
  tutorials: {
    beginner: {
      id: 'beginner-tutorials',
      title: 'Beginner Tutorials',
      description: 'Get started with Scalix through hands-on tutorials',
      tiles: [
        {
          id: 'chatbot-tutorial',
          title: 'Building Your First AI Chatbot',
          description: 'Learn how to create a conversational AI assistant',
          difficulty: 'Beginner',
          duration: '15 min',
          href: '/tutorials/chatbot',
          icon: '💬'
        },
        {
          id: 'api-integration',
          title: 'API Integration Basics',
          description: 'Connect Scalix with your existing applications',
          difficulty: 'Beginner',
          duration: '20 min',
          href: '/tutorials/api-integration',
          icon: '🔗'
        }
      ]
    } as ContentSection,

    advanced: {
      id: 'advanced-tutorials',
      title: 'Advanced Tutorials',
      description: 'Master advanced Scalix features and integrations',
      tiles: [
        {
          id: 'custom-models',
          title: 'Custom AI Model Training',
          description: 'Train and deploy custom AI models',
          difficulty: 'Advanced',
          duration: '45 min',
          href: '/tutorials/custom-models',
          icon: '🎯'
        },
        {
          id: 'enterprise-deployment',
          title: 'Enterprise Deployment',
          description: 'Deploy Scalix in enterprise environments',
          difficulty: 'Advanced',
          duration: '60 min',
          href: '/tutorials/enterprise-deployment',
          icon: '🏢'
        }
      ]
    } as ContentSection
  },

  // Blog and news content
  blog: {
    recentPosts: {
      id: 'recent-posts',
      title: 'Recent Articles',
      description: 'Latest insights and updates from the Scalix team',
      tiles: [
        {
          id: 'ai-development-trends',
          title: 'AI Development Trends 2025',
          description: 'What to expect in AI development this year',
          href: '/blog/ai-development-trends-2025',
          category: 'trends'
        },
        {
          id: 'local-ai-benefits',
          title: 'Benefits of Local AI',
          description: 'Why local AI is better for privacy and performance',
          href: '/blog/local-ai-benefits',
          category: 'privacy'
        }
      ]
    } as ContentSection
  },

  // Community content
  community: {
    resources: {
      id: 'community-resources',
      title: 'Community Resources',
      description: 'Helpful resources from the Scalix community',
      tiles: [
        {
          id: 'forum',
          title: 'Discussion Forums',
          description: 'Get help and share knowledge with the community',
          icon: '💬',
          href: '/community/forum'
        },
        {
          id: 'showcase',
          title: 'Project Showcase',
          description: 'See amazing projects built with Scalix',
          icon: '🎨',
          href: '/community/showcase'
        },
        {
          id: 'contribute',
          title: 'Contribute to Scalix',
          description: 'Help improve Scalix by contributing code',
          icon: '🤝',
          href: '/community/contribute'
        }
      ]
    } as ContentSection
  }
}

// Helper functions for content management
export class ContentManager {
  // Get all content from a specific section
  static getSection(sectionPath: string): ContentSection | null {
    const path = sectionPath.split('.')
    let current: any = contentDatabase

    for (const key of path) {
      current = current?.[key]
    }

    return current || null
  }

  // Get tiles from a section with optional filtering
  static getTiles(sectionPath: string, filters?: {
    category?: string
    featured?: boolean
    limit?: number
  }): ContentTile[] {
    const section = this.getSection(sectionPath)
    if (!section) return []

    let tiles = [...section.tiles]

    // Apply filters
    if (filters?.category) {
      tiles = tiles.filter(tile => tile.category === filters.category)
    }

    if (filters?.featured !== undefined) {
      tiles = tiles.filter(tile => tile.featured === filters.featured)
    }

    // Sort by order if specified
    tiles.sort((a, b) => (a.order || 0) - (b.order || 0))

    // Apply limit
    if (filters?.limit) {
      tiles = tiles.slice(0, filters.limit)
    }

    return tiles
  }

  // Add new content to a section
  static addTile(sectionPath: string, tile: ContentTile): boolean {
    const section = this.getSection(sectionPath)
    if (!section) return false

    // Check if tile with same ID already exists
    const existingIndex = section.tiles.findIndex(t => t.id === tile.id)
    if (existingIndex >= 0) {
      section.tiles[existingIndex] = tile
    } else {
      section.tiles.push(tile)
    }

    return true
  }

  // Remove content from a section
  static removeTile(sectionPath: string, tileId: string): boolean {
    const section = this.getSection(sectionPath)
    if (!section) return false

    const index = section.tiles.findIndex(t => t.id === tileId)
    if (index >= 0) {
      section.tiles.splice(index, 1)
      return true
    }

    return false
  }

  // Search content across all sections
  static searchContent(query: string): ContentTile[] {
    const results: ContentTile[] = []
    const searchTerm = query.toLowerCase()

    const searchInObject = (obj: any, path: string = '') => {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'object' && item.title && item.description) {
            const tile = item as ContentTile
            if (tile.title.toLowerCase().includes(searchTerm) ||
                tile.description.toLowerCase().includes(searchTerm)) {
              results.push(tile)
            }
          }
          searchInObject(item, `${path}[${index}]`)
        })
      } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          searchInObject(obj[key], path ? `${path}.${key}` : key)
        })
      }
    }

    searchInObject(contentDatabase)
    return results
  }

  // Get featured content
  static getFeaturedContent(limit: number = 6): ContentTile[] {
    const featured: ContentTile[] = []

    const collectFeatured = (obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          if (typeof item === 'object' && item.featured) {
            featured.push(item as ContentTile)
          }
          collectFeatured(item)
        })
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(value => collectFeatured(value))
      }
    }

    collectFeatured(contentDatabase)
    return featured.slice(0, limit)
  }
}

// Export specific content getters for easy use
export const getDocsSections = () => Object.values(contentDatabase.docs)
export const getFeatureSections = () => Object.values(contentDatabase.features)
export const getTutorialSections = () => Object.values(contentDatabase.tutorials)
export const getBlogSections = () => Object.values(contentDatabase.blog)
export const getCommunitySections = () => Object.values(contentDatabase.community)

// Export default content manager
export default ContentManager
