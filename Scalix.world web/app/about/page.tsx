'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Users,
  Target,
  Shield,
  Zap,
  Globe,
  Heart,
  Award,
  TrendingUp,
  Code,
  Lock,
  Smartphone
} from 'lucide-react'

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former AI researcher at Google Brain with 8+ years of experience in machine learning and privacy-preserving AI systems.',
    image: '/api/placeholder/150/150',
    linkedin: '#'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Engineering Director at Meta, specializing in scalable systems and distributed computing. Built AI infrastructure serving millions of users.',
    image: '/api/placeholder/150/150',
    linkedin: '#'
  },
  {
    name: 'Emma Thompson',
    role: 'Head of Product',
    bio: 'Product leader with experience at Stripe and Airbnb. Passionate about creating developer tools that empower innovation.',
    image: '/api/placeholder/150/150',
    linkedin: '#'
  },
  {
    name: 'David Park',
    role: 'Lead Engineer',
    bio: 'Full-stack developer with expertise in AI model integration and real-time systems. Previously led engineering teams at Uber.',
    image: '/api/placeholder/150/150',
    linkedin: '#'
  }
]

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'We believe your data belongs to you. Our local-first approach ensures your AI applications run on your infrastructure.'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimized for speed and efficiency. Run AI models locally without the latency and costs of cloud APIs.'
  },
  {
    icon: Code,
    title: 'Developer Experience',
    description: 'Built by developers, for developers. Intuitive APIs, comprehensive documentation, and active community support.'
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Democratizing AI development. Make powerful AI tools accessible to developers of all skill levels.'
  }
]

const milestones = [
  {
    year: '2023',
    title: 'Company Founded',
    description: 'Scalix was born from the vision to make AI development local and private.'
  },
  {
    year: '2024',
    title: 'First Release',
    description: 'Launched our initial platform with support for popular AI models.'
  },
  {
    year: '2024',
    title: '10,000+ Users',
    description: 'Reached our first major milestone with thousands of active developers.'
  },
  {
    year: '2025',
    title: 'Enterprise Launch',
    description: 'Expanding to enterprise customers with advanced features and support.'
  }
]

export default function AboutPage() {
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
              About Scalix
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're building the future of AI development. Local, private, and powerful.
              Empowering developers to create AI applications without compromise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Get Started
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To democratize AI development by providing a local-first platform that prioritizes
              privacy, performance, and developer experience. We believe AI should be accessible,
              private, and under your control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A diverse team of AI researchers, engineers, and product leaders united by a
              shared vision of making AI development accessible and private for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Scalix was born from frustration. As AI researchers and engineers working at
                  major tech companies, we saw firsthand the limitations and privacy concerns
                  of cloud-based AI services.
                </p>
                <p>
                  We believed there had to be a better way – a platform that puts developers
                  in control of their AI applications, respects user privacy, and delivers
                  exceptional performance without vendor lock-in.
                </p>
                <p>
                  In 2023, we left our comfortable positions to build that platform. Today,
                  Scalix empowers thousands of developers to build AI applications locally,
                  privately, and efficiently.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Journey</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-16">
              Scalix by Numbers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-primary-100">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-primary-100">AI Requests Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-100">AI Models Supported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-primary-100">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Help us build the future of AI development. Whether you're a developer,
              researcher, or entrepreneur, there's a place for you in our community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Start Building Today
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join Our Community
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
