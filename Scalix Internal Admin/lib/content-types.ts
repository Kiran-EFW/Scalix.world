// Shared content types for admin interface
// These types mirror the main content system but provide a simplified interface for admin operations

export interface ContentTile {
  id: string
  title: string
  description: string
  icon?: string
  href?: string
  category?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string
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

// Mock content database for admin interface
// This provides a fallback when the main content system is not available
export const mockContentDatabase = {
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
          category: 'setup'
        },
        {
          id: 'first-project',
          title: 'Your First AI Project',
          description: 'Create and run your first AI-powered application',
          icon: '🚀',
          href: '/docs/getting-started/first-project',
          category: 'tutorial'
        }
      ]
    } as ContentSection
  },

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
          category: 'features'
        },
        {
          id: 'ai-powered',
          title: 'AI-Powered Development',
          description: 'Build intelligent applications faster with AI-assisted coding',
          icon: '🚀',
          category: 'features'
        }
      ]
    } as ContentSection
  },

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
        }
      ]
    } as ContentSection
  },

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
        }
      ]
    } as ContentSection
  },

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
        }
      ]
    } as ContentSection
  }
}

// Simplified ContentManager for admin interface
export class ContentManager {
  // Get all content from a specific section
  static getSection(sectionPath: string): ContentSection | null {
    const path = sectionPath.split('.')
    let current: any = mockContentDatabase

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

    collectFeatured(mockContentDatabase)
    return featured.slice(0, limit)
  }
}
