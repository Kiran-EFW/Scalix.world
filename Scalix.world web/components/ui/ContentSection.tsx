'use client'

import { motion } from 'framer-motion'
import { ContentTile, CompactContentTile, FeaturedContentTile, TutorialTile } from './ContentTile'
import { Button } from './Button'
import { ArrowRight, Grid, List, Layout } from 'lucide-react'
import Link from 'next/link'
import type { ContentSection as ContentSectionType, ContentTile as ContentTileType } from '@/lib/content'

interface ContentSectionProps {
  section: ContentSectionType
  variant?: 'default' | 'featured' | 'compact'
  showHeader?: boolean
  showViewAll?: boolean
  viewAllHref?: string
  className?: string
  tileClassName?: string
}

export function ContentSection({
  section,
  variant = 'default',
  showHeader = true,
  showViewAll = false,
  viewAllHref,
  className = '',
  tileClassName = ''
}: ContentSectionProps) {
  const layout = section.layout || 'grid'
  const maxTiles = section.maxTiles || section.tiles.length

  // Select tile component based on variant
  const TileComponent = {
    default: ContentTile,
    featured: FeaturedContentTile,
    compact: CompactContentTile,
    tutorial: TutorialTile
  }[variant] || ContentTile

  // Grid layout classes
  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    list: 'space-y-4',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-8'
  }

  const renderTiles = () => {
    const tilesToShow = section.tiles.slice(0, maxTiles)

    return tilesToShow.map((tile, index) => (
      <TileComponent
        key={tile.id}
        tile={tile}
        index={index}
        className={tileClassName}
      />
    ))
  }

  return (
    <section className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {section.description}
            </p>

            {/* View All Button */}
            {showViewAll && viewAllHref && (
              <Button variant="outline" asChild>
                <Link href={viewAllHref}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </motion.div>
        )}

        {/* Tiles Container */}
        <div className={gridClasses[layout]}>
          {renderTiles()}
        </div>

        {/* Show more indicator */}
        {section.tiles.length > maxTiles && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              +{section.tiles.length - maxTiles} more {section.title.toLowerCase()}
            </p>
            {viewAllHref && (
              <Button variant="outline" asChild>
                <Link href={viewAllHref}>
                  View All {section.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Specialized section components for common use cases

// Featured content section for homepage
export function FeaturedContentSection({ section, className }: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      section={section}
      variant="featured"
      showHeader={true}
      className={`bg-gradient-to-br from-primary-50 to-purple-50 ${className}`}
    />
  )
}

// Compact section for sidebars or footer areas
export function CompactContentSection({ section, className }: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      section={section}
      variant="compact"
      showHeader={false}
      className={`py-12 ${className}`}
    />
  )
}

// Tutorial section with special styling
export function TutorialContentSection({ section, className }: Omit<ContentSectionProps, 'variant'>) {
  return (
    <ContentSection
      section={section}
      variant="tutorial"
      showHeader={true}
      className={`bg-gray-50 ${className}`}
    />
  )
}

// Dynamic section that can be configured
export function DynamicContentSection({
  tiles,
  title,
  description,
  layout = 'grid',
  variant = 'default',
  className = ''
}: {
  tiles: ContentTileType[]
  title: string
  description: string
  layout?: 'grid' | 'list' | 'masonry'
  variant?: 'default' | 'featured' | 'compact' | 'tutorial'
  className?: string
}) {
  const section: ContentSectionType = {
    id: `dynamic-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    description,
    tiles,
    layout
  }

  return (
    <ContentSection
      section={section}
      variant={variant}
      className={className}
    />
  )
}
