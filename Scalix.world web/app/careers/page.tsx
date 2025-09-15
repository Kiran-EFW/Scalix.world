'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Users, Target, Heart, Zap, Coffee, Globe, Award, TrendingUp } from 'lucide-react'

const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'People First',
    description: 'We believe great products are built by great teams. We prioritize work-life balance, mental health, and personal growth.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Innovation Driven',
    description: 'We push boundaries and embrace cutting-edge technology. We encourage experimentation and learning from failure.'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Privacy Focused',
    description: 'Privacy and security are core to everything we build. We believe users should control their own data.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaborative Culture',
    description: 'We work best when we work together. Open communication, mutual respect, and shared ownership drive our success.'
  }
]

const benefits = [
  {
    icon: <Coffee className="w-5 h-5" />,
    title: 'Flexible Work',
    description: 'Remote-first with flexible hours'
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: 'Competitive Pay',
    description: 'Market-leading compensation packages'
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Growth Opportunities',
    description: 'Continuous learning and career development'
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Health & Wellness',
    description: 'Comprehensive health benefits'
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Team Building',
    description: 'Regular virtual and in-person team events'
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Impact',
    description: 'Work on products that make a real difference'
  }
]

const openPositions = [
  {
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable web applications and APIs for our AI platform. Experience with React, Node.js, and cloud platforms required.',
    requirements: ['5+ years experience', 'React/Node.js expertise', 'Cloud platform experience']
  },
  {
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Develop and optimize AI models for our desktop application. Focus on performance, privacy, and user experience.',
    requirements: ['3+ years ML experience', 'Python expertise', 'Privacy-preserving ML knowledge']
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design intuitive user experiences for our AI development platform. Create beautiful, functional interfaces.',
    requirements: ['3+ years UX/UI experience', 'Figma expertise', 'AI/ML product experience']
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain our infrastructure. Ensure reliability, security, and scalability of our platform.',
    requirements: ['4+ years DevOps experience', 'AWS/GCP expertise', 'Infrastructure as Code']
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="w-16 h-16 mx-auto mb-6 text-primary-600" />
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Join Our
              <span className="block text-primary-600">Mission</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Help us build the future of AI development. We're looking for passionate individuals
              who want to make a real impact on how developers build AI applications.
            </p>

            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white">
              View Open Positions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
              >
                <div className="flex justify-center mb-4 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600">
              We offer more than just a job—we offer an opportunity to grow and make an impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 text-primary-600 mr-3">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Join our growing team and help shape the future of AI development
            </p>
          </motion.div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {position.location}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 lg:mt-0 bg-primary-600 hover:bg-primary-700 text-white">
                    Apply Now
                  </Button>
                </div>

                <p className="text-gray-600 mb-4">{position.description}</p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
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
              Don't See Your Role?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team.
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
              Send Us Your Resume
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
