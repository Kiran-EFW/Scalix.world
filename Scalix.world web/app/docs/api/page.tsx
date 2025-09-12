'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Code,
  Play,
  Copy,
  Check,
  Zap,
  Shield,
  Globe,
  Key,
  Book,
  Terminal,
  FileText,
  Settings,
  ArrowRight,
  ExternalLink,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'

const apiSections = [
  {
    title: 'Getting Started',
    icon: <Book className="w-5 h-5" />,
    items: [
      { name: 'Authentication', href: '#auth' },
      { name: 'Rate Limits', href: '#limits' },
      { name: 'Error Handling', href: '#errors' },
      { name: 'SDK Installation', href: '#sdk' }
    ]
  },
  {
    title: 'Core API',
    icon: <Zap className="w-5 h-5" />,
    items: [
      { name: 'Chat Completions', href: '#chat' },
      { name: 'Streaming', href: '#streaming' },
      { name: 'Model Selection', href: '#models' },
      { name: 'Context Management', href: '#context' }
    ]
  },
  {
    title: 'Scalix Pro',
    icon: <Shield className="w-5 h-5" />,
    items: [
      { name: 'Scalix Engine', href: '#engine' },
      { name: 'Scalix Gateway', href: '#gateway' },
      { name: 'Smart Context', href: '#smart-context' },
      { name: 'Advanced Analytics', href: '#analytics' }
    ]
  },
  {
    title: 'Enterprise',
    icon: <Globe className="w-5 h-5" />,
    items: [
      { name: 'Team Management', href: '#teams' },
      { name: 'Admin API', href: '#admin' },
      { name: 'Audit Logs', href: '#audit' },
      { name: 'SSO Integration', href: '#sso' }
    ]
  }
]

const codeExamples = {
  authentication: `// Basic authentication
const response = await fetch('https://api.scalix.world/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-scalix-your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});`,

  chatCompletions: `// Chat completions with Scalix Engine
const response = await fetch('https://api.scalix.world/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-scalix-your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'scalix-engine',
    messages: [
      {
        role: 'system',
        content: 'You are an expert React developer.'
      },
      {
        role: 'user',
        content: 'Create a modern button component'
      }
    ],
    scalix_options: {
      enable_lazy_edits: true,
      enable_smart_context: true,
      files: ['src/components/Button.tsx']
    }
  })
});`,

  streaming: `// Streaming responses
const response = await fetch('https://api.scalix.world/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-scalix-your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Write a function' }],
    stream: true
  })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = new TextDecoder().decode(value);
  console.log(chunk); // Process streaming chunks
}`,

  smartContext: `// Smart Context API
const response = await fetch('https://api.scalix.world/v1/smart-context', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-scalix-your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'refactor authentication logic',
    project_files: [
      'src/auth/login.tsx',
      'src/auth/signup.tsx',
      'src/utils/auth.ts',
      'src/hooks/useAuth.ts'
    ],
    context_limit: 50000
  })
});

const context = await response.json();
// Use context.relevant_files for your AI request`
}

const endpoints = [
  {
    method: 'POST',
    path: '/v1/chat/completions',
    description: 'Generate chat completions using AI models',
    auth: 'Bearer token'
  },
  {
    method: 'POST',
    path: '/v1/smart-context',
    description: 'Analyze project files and extract relevant context',
    auth: 'Bearer token'
  },
  {
    method: 'GET',
    path: '/v1/models',
    description: 'List available AI models and their capabilities',
    auth: 'Bearer token'
  },
  {
    method: 'GET',
    path: '/v1/usage',
    description: 'Get usage statistics and billing information',
    auth: 'Bearer token'
  },
  {
    method: 'POST',
    path: '/v1/teams',
    description: 'Manage team members and permissions',
    auth: 'Bearer token (Admin)'
  }
]

export default function ApiDocsPage() {
  const [selectedExample, setSelectedExample] = useState('authentication')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Scalix API Documentation</h1>
              <p className="text-gray-300">Complete API reference for integrating with Scalix</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Download className="w-4 h-4 mr-2" />
                SDK
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Key className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Your API Key</h3>
                <p className="text-sm text-gray-600">Keep your API key secure and never share it publicly</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-white px-3 py-1 rounded text-sm font-mono">
                {showApiKey ? 'sk-scalix-demo-123456789' : 'sk-scalix-••••••••••••••••••••••'}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">API Reference</h3>
              <div className="space-y-6">
                {apiSections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center mb-2">
                      <div className="text-primary-600 mr-2">
                        {section.icon}
                      </div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">

            {/* Getting Started */}
            <section id="auth">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>

              <div className="space-y-8">

                {/* Authentication */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h3>
                  <p className="text-gray-600 mb-4">
                    All API requests require authentication using your Scalix API key. Include it in the Authorization header.
                  </p>

                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{codeExamples.authentication}</pre>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => copyToClipboard(codeExamples.authentication)}
                  >
                    {copiedCode === codeExamples.authentication ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy Code
                  </Button>
                </div>

                {/* Rate Limits */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Free Tier</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 50 requests per day</li>
                        <li>• 10 requests per hour</li>
                        <li>• 10,000 tokens per day</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pro Tier</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Unlimited requests</li>
                        <li>• 10,000 tokens per month</li>
                        <li>• Priority processing</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Core API */}
            <section id="chat">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core API</h2>

              {/* Endpoints Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">API Endpoints</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                          </div>
                          <p className="text-sm text-gray-600">{endpoint.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{endpoint.auth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Examples */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Examples</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(codeExamples).map((example) => (
                    <button
                      key={example}
                      onClick={() => setSelectedExample(example)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        selectedExample === example
                          ? 'bg-primary-100 text-primary-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {example.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{codeExamples[selectedExample as keyof typeof codeExamples]}</pre>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => copyToClipboard(codeExamples[selectedExample as keyof typeof codeExamples])}
                >
                  {copiedCode === codeExamples[selectedExample as keyof typeof codeExamples] ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy Code
                </Button>
              </div>
            </section>

            {/* Scalix Pro Features */}
            <section id="engine">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Scalix Pro Features</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Scalix Engine */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <Zap className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Scalix Engine</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Advanced AI processing optimized for code generation with lazy edits and smart context.
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                    <div className="text-gray-500">// Use Scalix Engine</div>
                    <div>"model": "scalix-engine"</div>
                  </div>
                </div>

                {/* Scalix Gateway */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <Globe className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Scalix Gateway</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Intelligent API routing that automatically selects the best model for your needs.
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                    <div className="text-gray-500">// Automatic routing</div>
                    <div>"model": "auto"</div>
                  </div>
                </div>

              </div>
            </section>

            {/* SDK Section */}
            <section id="sdk">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SDK & Libraries</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* JavaScript SDK */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Terminal className="w-6 h-6 text-yellow-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">JavaScript SDK</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Official JavaScript/TypeScript SDK for easy integration with Node.js and browser applications.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    npm install @scalix-ai/sdk
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Book className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>

                {/* Python SDK */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Python SDK</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Python SDK for machine learning workflows and data science applications.
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                    pip install scalix-ai
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Book className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
