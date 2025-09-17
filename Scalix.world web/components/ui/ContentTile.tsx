'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from './Button'
import { ArrowRight, Clock, Star } from 'lucide-react'
import type { ContentTile as ContentTileType } from '@/lib/content'

interface ContentTileProps {
  tile: ContentTileType
  index?: number
  variant?: 'default' | 'featured' | 'compact' | 'tutorial'
  className?: string
}

export function ContentTile({
  tile,
  index = 0,
  variant = 'default',
  className = ''
}: ContentTileProps) {
  const renderIcon = () => {
    if (typeof tile.icon === 'string') {
      return <span className="text-2xl">{tile.icon}</span>
    }
    if (tile.icon) {
      return tile.icon
    }
    return null
  }

  const renderDifficultyBadge = () => {
    if (!tile.difficulty) return null

    const colors = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-yellow-100 text-yellow-800',
      Advanced: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[tile.difficulty]}`}>
        {tile.difficulty}
      </span>
    )
  }

  const tileContent = (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header with icon and color */}
      {tile.color && (
        <div className={`p-3 rounded-t-xl ${tile.color} text-white`}>
          {renderIcon()}
        </div>
      )}

      <div className="p-6">
        {/* Icon (if not in header) */}
        {!tile.color && tile.icon && (
          <div className="text-4xl mb-4">
            {renderIcon()}
          </div>
        )}

        {/* Title and badges */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {tile.title}
          </h3>
          {variant === 'tutorial' && renderDifficultyBadge()}
        </div>

        {/* Description */}
        <p className={`text-gray-600 leading-relaxed mb-4 ${
          variant === 'compact' ? 'text-sm' : ''
        }`}>
          {tile.description}
        </p>

        {/* Tutorial specific content */}
        {variant === 'tutorial' && tile.duration && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            {tile.duration}
          </div>
        )}

        {/* Items list */}
        {tile.items && tile.items.length > 0 && (
          <ul className="space-y-1 mb-4">
            {tile.items.slice(0, variant === 'compact' ? 2 : 4).map((item, itemIndex) => (
              <li key={itemIndex} className="text-sm text-gray-500 flex items-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                {item}
              </li>
            ))}
            {tile.items.length > (variant === 'compact' ? 2 : 4) && (
              <li className="text-sm text-gray-400">
                +{tile.items.length - (variant === 'compact' ? 2 : 4)} more...
              </li>
            )}
          </ul>
        )}

        {/* CTA Button */}
        {tile.href && (
          <Button
            variant={variant === 'featured' ? 'default' : 'outline'}
            className="w-full"
            asChild
          >
            <Link href={tile.href}>
              {variant === 'tutorial' ? 'Start Tutorial' : 'Explore'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )

  // Wrap in motion.div for animations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      {tile.href ? (
        <Link href={tile.href} className="block h-full">
          {tileContent}
        </Link>
      ) : (
        tileContent
      )}
    </motion.div>
  )
}

// Compact version for sidebars and small spaces
export function CompactContentTile({ tile, index = 0 }: Omit<ContentTileProps, 'variant'>) {
  return (
    <ContentTile
      tile={tile}
      index={index}
      variant="compact"
      className="p-4"
    />
  )
}

// Featured version for hero sections
export function FeaturedContentTile({ tile, index = 0 }: Omit<ContentTileProps, 'variant'>) {
  return (
    <ContentTile
      tile={tile}
      index={index}
      variant="featured"
      className="ring-2 ring-primary-500 shadow-lg"
    />
  )
}

// Tutorial specific tile
export function TutorialTile({ tile, index = 0 }: Omit<ContentTileProps, 'variant'>) {
  return (
    <ContentTile
      tile={tile}
      index={index}
      variant="tutorial"
    />
  )
}
