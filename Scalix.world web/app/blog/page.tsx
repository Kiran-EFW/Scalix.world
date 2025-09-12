'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, ArrowRight, Search } from 'lucide-react'

const featuredPost = {
  title: 'The Future of Local AI Development: Why Privacy-First Matters',
  excerpt: 'Explore how local AI development is revolutionizing the industry by putting privacy, security, and control back in developers\' hands.',
  author: 'Sarah Chen',
  date: '2024-09-10',
  readTime: '8 min read',
  category: 'AI Trends',
  image: '/api/placeholder/800/400',
  slug: 'future-local-ai-development'
}

const latestPosts = [
  {
    title: 'Building Scalable AI Applications: Best Practices for 2024',
    excerpt: 'Learn how to architect AI applications that can grow with your business needs and handle increasing complexity.',
    author: 'Michael Rodriguez',
    date: '2024-09-08',
    readTime: '6 min read',
    category: 'Development',
    slug: 'scalable-ai-applications-2024'
  },
  {
    title: 'Cost Optimization Strategies for AI Development',
    excerpt: 'Reduce your AI development costs by up to 60% with these proven strategies and best practices.',
    author: 'Emma Thompson',
    date: '2024-09-05',
    readTime: '5 min read',
    category: 'Business',
    slug: 'ai-cost-optimization-strategies'
  },
  {
    title: 'Integrating Multiple AI Models: A Comprehensive Guide',
    excerpt: 'Master the art of combining different AI models to achieve better performance and more accurate results.',
    author: 'David Park',
    date: '2024-09-03',
    readTime: '10 min read',
    category: 'Technical',
    slug: 'integrating-multiple-ai-models'
  },
  {
    title: 'The Rise of Local AI: Security and Privacy Benefits',
    excerpt: 'Discover why more companies are choosing local AI solutions over cloud-based alternatives.',
    author: 'Lisa Wang',
    date: '2024-09-01',
    readTime: '7 min read',
    category: 'Security',
    slug: 'rise-of-local-ai-security'
  },
  {
    title: 'Getting Started with Scalix: Your First AI Project',
    excerpt: 'A step-by-step guide to creating your first AI application using Scalix\'s powerful platform.',
    author: 'James Wilson',
    date: '2024-08-30',
    readTime: '12 min read',
    category: 'Tutorial',
    slug: 'getting-started-scalix-first-project'
  },
  {
    title: 'AI Model Selection: Finding the Right Tool for Your Use Case',
    excerpt: 'Navigate the complex landscape of AI models and choose the best one for your specific requirements.',
    author: 'Rachel Green',
    date: '2024-08-28',
    readTime: '9 min read',
    category: 'AI Models',
    slug: 'ai-model-selection-guide'
  }
]

const categories = [
  { name: 'All Posts', count: 42, active: true },
  { name: 'AI Trends', count: 12, active: false },
  { name: 'Development', count: 15, active: false },
  { name: 'Technical', count: 8, active: false },
  { name: 'Business', count: 4, active: false },
  { name: 'Security', count: 3, active: false }
]

const tags = [
  'AI Development', 'Local AI', 'Privacy', 'Scalix', 'Machine Learning',
  'API Integration', 'Cost Optimization', 'Best Practices', 'Tutorials',
  'Security', 'Performance', 'Cloud vs Local'
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Scalix Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, tutorials, and industry trends from the world of AI development.
              Stay updated with the latest in local AI technology.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#latest-posts">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Latest Articles
                </Button>
              </Link>
              <Link href="#categories">
                <Button variant="outline" size="lg">
                  Browse by Category
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <p className="text-lg font-semibold">Featured</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories and Latest Posts */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" id="latest-posts">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-8">
                {/* Categories */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          category.active
                            ? 'bg-primary-100 text-primary-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                        <span className="float-right text-gray-400">
                          ({category.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-800 cursor-pointer transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Load More Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Stay Updated with AI Insights
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and industry insights delivered to your inbox.
              Join over 10,000 developers staying ahead of the AI curve.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
                <Button className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3">
                  Subscribe
                </Button>
              </div>
              <p className="text-primary-200 text-sm mt-3">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
