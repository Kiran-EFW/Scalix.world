'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ThumbsUp,
  Eye,
  Reply,
  Pin,
  Flame,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Calendar,
  User,
  Tag
} from 'lucide-react'

const forumCategories = [
  {
    name: 'Getting Started',
    slug: 'getting-started',
    description: 'New to Scalix? Get help with installation and basic setup',
    topics: 89,
    posts: 1247,
    lastActivity: '2 minutes ago',
    color: 'bg-blue-500',
    icon: '🚀'
  },
  {
    name: 'AI Development',
    slug: 'ai-development',
    description: 'Technical discussions about AI integration and development',
    topics: 156,
    posts: 2156,
    lastActivity: '5 minutes ago',
    color: 'bg-green-500',
    icon: '🤖'
  },
  {
    name: 'Showcase',
    slug: 'showcase',
    description: 'Share your AI projects and get feedback from the community',
    topics: 78,
    posts: 892,
    lastActivity: '12 minutes ago',
    color: 'bg-purple-500',
    icon: '⭐'
  },
  {
    name: 'Pro Features',
    slug: 'pro-features',
    description: 'Discussions about Scalix Pro, Engine, and Gateway features',
    topics: 45,
    posts: 623,
    lastActivity: '18 minutes ago',
    color: 'bg-yellow-500',
    icon: '⚡'
  },
  {
    name: 'Bug Reports',
    slug: 'bug-reports',
    description: 'Report bugs and help improve Scalix',
    topics: 34,
    posts: 445,
    lastActivity: '25 minutes ago',
    color: 'bg-red-500',
    icon: '🐛'
  },
  {
    name: 'Feature Requests',
    slug: 'feature-requests',
    description: 'Suggest new features and vote on community ideas',
    topics: 67,
    posts: 934,
    lastActivity: '32 minutes ago',
    color: 'bg-indigo-500',
    icon: '💡'
  }
]

const featuredTopics = [
  {
    id: 1,
    title: 'Best practices for integrating multiple AI providers in production',
    author: 'alex_dev',
    avatar: 'AD',
    replies: 24,
    views: 1247,
    lastReply: '5 minutes ago',
    category: 'AI Development',
    tags: ['production', 'multi-provider', 'best-practices'],
    isPinned: true,
    votes: 42
  },
  {
    id: 2,
    title: 'Scalix Engine vs traditional AI APIs: Performance comparison',
    author: 'sarah_ml',
    avatar: 'SM',
    replies: 18,
    views: 892,
    lastReply: '12 minutes ago',
    category: 'Pro Features',
    tags: ['scalix-engine', 'performance', 'comparison'],
    isPinned: false,
    votes: 31
  },
  {
    id: 3,
    title: 'How to optimize costs when using GPT-4 for large codebases',
    author: 'mike_cost',
    avatar: 'MC',
    replies: 15,
    views: 756,
    lastReply: '18 minutes ago',
    category: 'AI Development',
    tags: ['cost-optimization', 'gpt-4', 'large-codebases'],
    isPinned: false,
    votes: 28
  }
]

const recentPosts = [
  {
    id: 1,
    title: 'Question about local model performance with Ollama',
    author: 'dev_newbie',
    avatar: 'DN',
    category: 'Getting Started',
    time: '2 minutes ago',
    excerpt: 'Hi everyone! I\'m trying to set up Ollama with Scalix but noticing slower response times compared to cloud providers...',
    replies: 3
  },
  {
    id: 2,
    title: 'Showcase: Built an AI-powered code review tool',
    author: 'code_master',
    avatar: 'CM',
    category: 'Showcase',
    time: '5 minutes ago',
    excerpt: 'Just finished building an AI code review assistant using Scalix Engine. It automatically detects potential bugs and suggests improvements...',
    replies: 7
  },
  {
    id: 3,
    title: 'Smart Context not working as expected with React components',
    author: 'react_dev',
    avatar: 'RD',
    category: 'Pro Features',
    time: '8 minutes ago',
    excerpt: 'Has anyone experienced issues with Smart Context not properly analyzing React component dependencies? Here\'s what I\'m seeing...',
    replies: 5
  },
  {
    id: 4,
    title: 'Feature Request: Support for Claude 3.5 Sonnet',
    author: 'ai_enthusiast',
    avatar: 'AE',
    category: 'Feature Requests',
    time: '12 minutes ago',
    excerpt: 'Would love to see support for the latest Claude 3.5 Sonnet model. The improved reasoning capabilities would be amazing...',
    replies: 12,
    votes: 24
  },
  {
    id: 5,
    title: 'Performance issue with large TypeScript projects',
    author: 'ts_expert',
    avatar: 'TE',
    category: 'Bug Reports',
    time: '15 minutes ago',
    excerpt: 'Experiencing significant slowdowns when working with TypeScript projects over 50K lines. Anyone else seeing this?',
    replies: 9
  }
]

const topContributors = [
  {
    name: 'alex_dev',
    avatar: 'AD',
    posts: 247,
    reputation: 1250,
    badge: 'Community Leader',
    joined: 'Jan 2024'
  },
  {
    name: 'sarah_ml',
    avatar: 'SM',
    posts: 189,
    reputation: 980,
    badge: 'AI Expert',
    joined: 'Feb 2024'
  },
  {
    name: 'mike_cost',
    avatar: 'MC',
    posts: 156,
    reputation: 750,
    badge: 'Cost Optimizer',
    joined: 'Mar 2024'
  },
  {
    name: 'dev_newbie',
    avatar: 'DN',
    posts: 98,
    reputation: 420,
    badge: 'Rising Star',
    joined: 'Jun 2024'
  }
]

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
              <p className="text-gray-300">Connect, learn, and share with the Scalix community</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Unanswered</option>
                <option>My Topics</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">

              {/* Categories */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Topics
                  </button>
                  {forumCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                        selectedCategory === category.slug
                          ? 'bg-primary-100 text-primary-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{category.name}</div>
                        <div className="text-xs opacity-75">{category.topics} topics</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {topContributors.map((contributor) => (
                    <div key={contributor.name} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                        {contributor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{contributor.name}</div>
                        <div className="text-xs text-gray-500">{contributor.posts} posts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-primary-600">{contributor.reputation}</div>
                        <div className="text-xs text-gray-400">rep</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Online Now</span>
                    <span className="font-medium text-gray-900">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Topics Today</span>
                    <span className="font-medium text-gray-900">34</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Solutions</span>
                    <span className="font-medium text-gray-900">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response</span>
                    <span className="font-medium text-gray-900">12min</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Featured Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Pin className="w-5 h-5 mr-2 text-primary-600" />
                  Featured Topics
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {featuredTopics.map((topic) => (
                  <div key={topic.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {topic.isPinned && <Pin className="w-4 h-4 text-primary-600" />}
                          <h3 className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {topic.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{topic.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{topic.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{topic.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{topic.lastReply}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {topic.category}
                          </span>
                          <div className="flex space-x-1">
                            {topic.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {topic.votes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Recent Discussions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600 flex-shrink-0">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                            {post.title}
                          </h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.author}</span>
                            <span>{post.time}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </div>
                            {post.votes && (
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.votes}</span>
                              </div>
                            )}
                            <Button variant="outline" size="sm">
                              <Reply className="w-4 h-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Button variant="outline">
                Load More Discussions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
