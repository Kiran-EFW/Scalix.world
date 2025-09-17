// Admin Content Management Utilities
// These functions demonstrate how to add content from the back office

import { ContentManager } from '@/lib/content'
import type { ContentTile } from '@/lib/content'

// ==========================================
// QUICK ADD FUNCTIONS FOR ADMINS
// ==========================================

/**
 * Add a new blog post from the admin panel
 */
export function addBlogPost(title: string, description: string, category: string = 'general') {
  const blogPost: ContentTile = {
    id: `blog-${Date.now()}`,
    title,
    description,
    icon: '📝',
    href: `/blog/${title.toLowerCase().replace(/\s+/g, '-')}`,
    category,
    featured: Math.random() > 0.7 // Randomly feature some posts
  }

  return ContentManager.addTile('blog.recentPosts', blogPost)
}

/**
 * Add a new tutorial from the admin panel
 */
export function addTutorial(
  title: string,
  description: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  duration: string,
  category: string = 'tutorial'
) {
  const tutorial: ContentTile = {
    id: `tutorial-${Date.now()}`,
    title,
    description,
    difficulty,
    duration,
    icon: '🎓',
    href: `/tutorials/${title.toLowerCase().replace(/\s+/g, '-')}`,
    category
  }

  const sectionPath = difficulty === 'Advanced' ? 'tutorials.advanced' : 'tutorials.beginner'
  return ContentManager.addTile(sectionPath, tutorial)
}

/**
 * Add documentation content from the admin panel
 */
export function addDocumentation(
  title: string,
  description: string,
  section: string = 'gettingStarted',
  category: string = 'docs'
) {
  const doc: ContentTile = {
    id: `doc-${Date.now()}`,
    title,
    description,
    icon: '📚',
    href: `/docs/${section}/${title.toLowerCase().replace(/\s+/g, '-')}`,
    category
  }

  return ContentManager.addTile(`docs.${section}`, doc)
}

/**
 * Add community content from the admin panel
 */
export function addCommunityContent(
  title: string,
  description: string,
  type: 'forum' | 'showcase' | 'resource',
  category: string = 'community'
) {
  const icons = {
    forum: '💬',
    showcase: '🎨',
    resource: '📖'
  }

  const communityContent: ContentTile = {
    id: `community-${type}-${Date.now()}`,
    title,
    description,
    icon: icons[type],
    href: `/community/${type}/${title.toLowerCase().replace(/\s+/g, '-')}`,
    category
  }

  return ContentManager.addTile('community.resources', communityContent)
}

/**
 * Add feature highlight from the admin panel
 */
export function addFeature(
  title: string,
  description: string,
  icon: string = '🚀',
  section: string = 'coreFeatures'
) {
  const feature: ContentTile = {
    id: `feature-${Date.now()}`,
    title,
    description,
    icon,
    category: 'features'
  }

  return ContentManager.addTile(`features.${section}`, feature)
}

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Bulk add multiple content items
 */
export function bulkAddContent(contentArray: Array<{
  type: 'blog' | 'tutorial' | 'doc' | 'feature' | 'community'
  title: string
  description: string
  [key: string]: any
}>) {
  const results = []

  for (const item of contentArray) {
    let success = false

    switch (item.type) {
      case 'blog':
        success = addBlogPost(item.title, item.description, item.category)
        break
      case 'tutorial':
        success = addTutorial(item.title, item.description, item.difficulty, item.duration)
        break
      case 'doc':
        success = addDocumentation(item.title, item.description, item.section)
        break
      case 'feature':
        success = addFeature(item.title, item.description, item.icon)
        break
      case 'community':
        success = addCommunityContent(item.title, item.description, item.contentType)
        break
    }

    results.push({
      item: item.title,
      success,
      type: item.type
    })
  }

  return results
}

/**
 * Get content statistics for admin dashboard
 */
export function getContentStats() {
  const stats = {
    totalContent: 0,
    byCategory: {} as Record<string, number>,
    featuredContent: 0,
    publishedContent: 0
  }

  // Count content across all sections
  Object.keys(ContentManager.getSection('docs') || {}).forEach(sectionKey => {
    const tiles = ContentManager.getTiles(`docs.${sectionKey}`)
    stats.totalContent += tiles.length
    tiles.forEach(tile => {
      if (tile.category) {
        stats.byCategory[tile.category] = (stats.byCategory[tile.category] || 0) + 1
      }
      if (tile.featured) stats.featuredContent++
      if (tile.href) stats.publishedContent++
    })
  })

  // Similar counting for other categories...
  // (This is simplified - you could extend this for all categories)

  return stats
}

// ==========================================
// ADMIN WORKFLOW EXAMPLES
// ==========================================

/**
 * Example: Monthly content update workflow
 */
export function monthlyContentUpdate() {
  const updates = [
    // Add new blog posts
    { type: 'blog' as const, title: 'Scalix v3.0 Features', description: 'New AI capabilities', category: 'releases' },
    { type: 'blog' as const, title: 'Performance Optimization Guide', description: 'Improve your app speed', category: 'guides' },

    // Add new tutorials
    { type: 'tutorial' as const, title: 'Advanced API Integration', description: 'Deep dive into API usage', difficulty: 'Advanced' as const, duration: '45 min' },
    { type: 'tutorial' as const, title: 'Custom Model Training', description: 'Train your own AI models', difficulty: 'Intermediate' as const, duration: '60 min' },

    // Add documentation updates
    { type: 'doc' as const, title: 'Webhook Configuration', description: 'Set up real-time notifications', section: 'apiReference' }
  ]

  return bulkAddContent(updates)
}

/**
 * Example: Product launch content workflow
 */
export function productLaunchContent(featureName: string, description: string) {
  const launchContent = [
    { type: 'blog' as const, title: `${featureName} - Now Available`, description, category: 'releases' },
    { type: 'tutorial' as const, title: `Getting Started with ${featureName}`, description: `Learn to use ${featureName}`, difficulty: 'Beginner' as const, duration: '15 min' },
    { type: 'feature' as const, title: featureName, description, icon: '✨' }
  ]

  return bulkAddContent(launchContent)
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Validate content before adding
 */
export function validateContent(content: Partial<ContentTile>): { valid: boolean, errors: string[] } {
  const errors: string[] = []

  if (!content.title?.trim()) errors.push('Title is required')
  if (!content.description?.trim()) errors.push('Description is required')
  if (content.href && !content.href.startsWith('/')) errors.push('URL must start with /')

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Auto-generate content ID
 */
export function generateContentId(prefix: string = 'content'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Export everything for use in admin components
export default {
  addBlogPost,
  addTutorial,
  addDocumentation,
  addCommunityContent,
  addFeature,
  bulkAddContent,
  getContentStats,
  monthlyContentUpdate,
  productLaunchContent,
  validateContent,
  generateSlug,
  generateContentId
}
