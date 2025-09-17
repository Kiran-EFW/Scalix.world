'use client'

import { ContentSection, DynamicContentSection } from '@/components/ui/ContentSection'
import { ContentManager } from '@/lib/content'

export function ContentDemo() {
  // Example 1: Using predefined sections
  const featureSection = ContentManager.getSection('features.coreFeatures')

  // Example 2: Creating dynamic content on the fly
  const dynamicTiles = [
    {
      id: 'latest-news',
      title: 'Scalix v2.0 Released',
      description: 'Major update with enhanced AI capabilities and improved performance',
      icon: '🚀',
      href: '/blog/scalix-v2-release'
    },
    {
      id: 'community-event',
      title: 'Join Our Webinar',
      description: 'Learn about advanced AI integration techniques',
      icon: '📹',
      href: '/events/webinar-ai-integration'
    },
    {
      id: 'new-tutorial',
      title: 'API Authentication Guide',
      description: 'Complete guide to securing your Scalix API endpoints',
      icon: '🔐',
      href: '/docs/api-authentication'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Example 1: Using predefined content */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Predefined Content Sections</h3>
        {featureSection && (
          <ContentSection
            section={featureSection}
            variant="compact"
            showHeader={true}
          />
        )}
      </div>

      {/* Example 2: Dynamic content creation */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Dynamic Content Creation</h3>
        <DynamicContentSection
          tiles={dynamicTiles}
          title="Latest Updates"
          description="Stay up to date with the latest Scalix news and features"
          variant="featured"
          layout="grid"
        />
      </div>

      {/* Example 3: Filtered content */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Filtered Content (Setup Category)</h3>
        <DynamicContentSection
          tiles={ContentManager.getTiles('docs.gettingStarted', { category: 'setup' })}
          title="Setup Guides"
          description="Quick setup guides for getting started"
          variant="compact"
          layout="list"
        />
      </div>

      {/* Example 4: Featured content */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Featured Content</h3>
        <DynamicContentSection
          tiles={ContentManager.getFeaturedContent(3)}
          title="Editor's Picks"
          description="Our most popular and highly recommended content"
          variant="featured"
        />
      </div>
    </div>
  )
}

// Utility function to add content anywhere
export function addContentToPage(pageName: string, content: any) {
  // This function can be called from any page to add content dynamically
  ContentManager.addTile(`pages.${pageName}`, content)
}

// Example usage function
export function addBlogPost(title: string, description: string, category: string = 'general') {
  const blogPost = {
    id: `blog-${Date.now()}`,
    title,
    description,
    icon: '📝',
    href: `/blog/${title.toLowerCase().replace(/\s+/g, '-')}`,
    category,
    featured: Math.random() > 0.7 // Randomly feature some posts
  }

  ContentManager.addTile('blog.recentPosts', blogPost)
}

// Example usage function for tutorials
export function addTutorial(title: string, description: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', duration: string) {
  const tutorial = {
    id: `tutorial-${Date.now()}`,
    title,
    description,
    difficulty,
    duration,
    icon: '🎓',
    href: `/tutorials/${title.toLowerCase().replace(/\s+/g, '-')}`
  }

  const sectionPath = difficulty === 'Advanced' ? 'tutorials.advanced' : 'tutorials.beginner'
  ContentManager.addTile(sectionPath, tutorial)
}
