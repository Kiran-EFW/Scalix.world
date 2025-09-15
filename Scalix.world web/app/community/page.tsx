'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  MessageSquare,
  Users,
  BookOpen,
  Calendar,
  HelpCircle,
  Trophy,
  ArrowRight,
  Github,
  Hash,
  Twitter,
  Youtube,
  ExternalLink,
  Heart,
  Star,
  Clock
} from 'lucide-react'

const communityStats = [
  { value: '15K+', label: 'Community Members' },
  { value: '2.8K', label: 'Monthly Active Users' },
  { value: '45K+', label: 'Forum Posts' },
  { value: '98%', label: 'Helpful Responses' }
]

const forumCategories = [
  {
    name: 'Getting Started',
    description: 'New to Scalix? Get help with installation and basic setup',
    posts: 1247,
    topics: 89,
    lastActivity: '2 hours ago',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    name: 'Development Help',
    description: 'Technical questions about AI development and integrations',
    posts: 3256,
    topics: 234,
    lastActivity: '15 minutes ago',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-green-500'
  },
  {
    name: 'Showcase',
    description: 'Share your AI projects and get feedback from the community',
    posts: 892,
    topics: 156,
    lastActivity: '1 hour ago',
    icon: <Trophy className="w-6 h-6" />,
    color: 'bg-yellow-500'
  },
  {
    name: 'General Discussion',
    description: 'Talk about AI trends, best practices, and Scalix features',
    posts: 2156,
    topics: 198,
    lastActivity: '30 minutes ago',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'bg-purple-500'
  },
  {
    name: 'Bug Reports',
    description: 'Report bugs and help improve Scalix',
    posts: 445,
    topics: 67,
    lastActivity: '4 hours ago',
    icon: <Github className="w-6 h-6" />,
    color: 'bg-red-500'
  },
  {
    name: 'Feature Requests',
    description: 'Suggest new features and vote on community ideas',
    posts: 678,
    topics: 92,
    lastActivity: '1 hour ago',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-indigo-500'
  }
]

const communityPlatforms = [
  {
    name: 'Discord',
    description: 'Real-time chat, voice channels, and community events',
    members: '8.2K',
    icon: <Hash className="w-6 h-6" />,
    color: 'bg-indigo-600',
    link: 'https://discord.gg/scalix',
    online: '1.2K'
  },
  {
    name: 'GitHub',
    description: 'Contribute to the codebase and track development',
    members: '1.5K',
    icon: <Github className="w-6 h-6" />,
    color: 'bg-gray-800',
    link: 'https://github.com/scalix-ai',
    online: null
  },
  {
    name: 'Twitter',
    description: 'Follow for updates, tips, and AI industry news',
    members: '12K',
    icon: <Twitter className="w-6 h-6" />,
    color: 'bg-blue-500',
    link: 'https://twitter.com/scalix_ai',
    online: null
  },
  {
    name: 'YouTube',
    description: 'Tutorials, demos, and educational content',
    members: '25K',
    icon: <Youtube className="w-6 h-6" />,
    color: 'bg-red-600',
    link: 'https://youtube.com/@scalix-ai',
    online: null
  }
]

const upcomingEvents = [
  {
    title: 'AI Development Workshop',
    date: 'Sep 20, 2024',
    time: '2:00 PM EST',
    type: 'Workshop',
    attendees: 45,
    maxAttendees: 100
  },
  {
    title: 'Community AMA with Founders',
    date: 'Sep 25, 2024',
    time: '3:00 PM EST',
    type: 'AMA',
    attendees: 78,
    maxAttendees: 200
  },
  {
    title: 'Local AI Showcase',
    date: 'Oct 2, 2024',
    time: '1:00 PM EST',
    type: 'Showcase',
    attendees: 23,
    maxAttendees: 50
  }
]

const topContributors = [
  { name: 'Sarah Chen', contributions: 127, avatar: 'SC', badge: 'Core Contributor' },
  { name: 'Mike Rodriguez', contributions: 95, avatar: 'MR', badge: 'Community Leader' },
  { name: 'Emma Thompson', contributions: 89, avatar: 'ET', badge: 'Bug Hunter' },
  { name: 'David Park', contributions: 76, avatar: 'DP', badge: 'Mentor' },
  { name: 'Lisa Wang', contributions: 68, avatar: 'LW', badge: 'Content Creator' }
]

export default function CommunityPage() {
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
              Join the Scalix
              <span className="block text-primary-600">Community</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with fellow AI developers, get help, share your projects, and contribute to the future of local AI development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#forums">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Join Discussion
                </Button>
              </Link>
              <Link href="#platforms">
                <Button variant="outline" size="lg">
                  Community Platforms
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Platforms */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" id="platforms">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community across multiple platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPlatforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${platform.color} text-white`}>
                    {platform.icon}
                  </div>
                  {platform.online && (
                    <div className="flex items-center text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {platform.online} online
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {platform.name}
                </h3>

                <p className="text-gray-600 mb-4 text-sm">
                  {platform.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {platform.members} members
                  </span>
                </div>

                <a href={platform.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    Join {platform.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Forums */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" id="forums">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Community Forums
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help, share knowledge, and connect with fellow developers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forumCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{category.posts} posts</span>
                  <span>{category.topics} topics</span>
                  <span>Last activity: {category.lastActivity}</span>
                </div>

                <Button variant="outline" className="w-full">
                  Browse {category.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join live sessions, workshops, and community meetups
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'AMA' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {event.attendees}/{event.maxAttendees} attending
                  </span>
                </div>

                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  Register for Event
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Community Heroes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the amazing contributors who make Scalix better every day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {topContributors.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {contributor.avatar}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {contributor.name}
                </h3>

                <p className="text-primary-600 text-sm font-medium mb-2">
                  {contributor.badge}
                </p>

                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <Heart className="w-4 h-4 mr-1" />
                  {contributor.contributions} contributions
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Join the Community?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Whether you're just getting started or you're an AI expert, there's a place for you in the Scalix community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#platforms">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Join Discord
                </Button>
              </Link>
              <Link href="#forums">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Browse Forums
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
