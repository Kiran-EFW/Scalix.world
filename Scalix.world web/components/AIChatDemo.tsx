'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { scalixAPI, apiUtils } from '@/lib/api'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  MessageCircle,
  X,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
  processingTime?: number
}

const DEMO_MESSAGES = [
  {
    id: '1',
    role: 'assistant' as const,
    content: "Hello! I'm your AI assistant powered by Scalix. I can help you with coding, brainstorming, analysis, and much more. What would you like to explore today?",
    timestamp: new Date(Date.now() - 30000),
    model: 'gpt-4'
  },
  {
    id: '2',
    role: 'user' as const,
    content: "Can you help me create a React component for a real-time dashboard?",
    timestamp: new Date(Date.now() - 25000)
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: "Absolutely! I'll create a comprehensive real-time dashboard component with TypeScript, featuring live data updates, interactive charts, and responsive design. Here's what I'll include:\n\n• Real-time data fetching with automatic refresh\n• Interactive charts using Chart.js\n• Responsive grid layout\n• Error handling and loading states\n• TypeScript for type safety\n\nLet me generate the complete component for you...",
    timestamp: new Date(Date.now() - 20000),
    model: 'gpt-4',
    processingTime: 1.2
  }
]

export function AIChatDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Simulate AI response with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))

      const aiResponse = await generateAIResponse(inputValue.trim())

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        model: aiResponse.model,
        processingTime: aiResponse.processingTime
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm experiencing some connectivity issues right now. Please try again in a moment, or visit our full dashboard for uninterrupted AI assistance.",
        timestamp: new Date(),
        model: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = async (userInput: string): Promise<{
    content: string
    model: string
    processingTime: number
  }> => {
    const processingTime = 0.8 + Math.random() * 1.5

    // Context-aware responses based on user input
    if (userInput.toLowerCase().includes('react') || userInput.toLowerCase().includes('component')) {
      return {
        content: `Great question about React! I'll help you create a modern React component. Here's a production-ready example with TypeScript, hooks, and best practices:

\`\`\`tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DashboardProps {
  refreshInterval?: number
  className?: string
}

export function RealTimeDashboard({
  refreshInterval = 30000,
  className = ''
}: DashboardProps) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard-data')
      const newData = await response.json()
      setData(newData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={\`bg-white rounded-lg shadow-lg p-6 \${className}\`}
    >
      <h2 className="text-2xl font-bold mb-4">Real-Time Dashboard</h2>
      {/* Your dashboard content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard cards */}
      </div>
    </motion.div>
  )
}
\`\`\`

This component includes:
• TypeScript interfaces for type safety
• Real-time data fetching with automatic refresh
• Loading states and error handling
• Responsive design with Tailwind CSS
• Framer Motion animations
• Customizable refresh intervals

Would you like me to explain any specific part or modify it for your needs?`,
        model: 'gpt-4',
        processingTime
      }
    }

    if (userInput.toLowerCase().includes('api') || userInput.toLowerCase().includes('backend')) {
      return {
        content: `Excellent! Let's build a robust API endpoint. Here's a complete Express.js API with TypeScript, validation, and error handling:

\`\`\`typescript
import express, { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:3000'
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

app.post('/api/data',
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('age').isInt({ min: 18 }).withMessage('Must be 18 or older'),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { name, email, age } = req.body

      // Simulate database operation
      const newRecord = {
        id: Date.now(),
        name,
        email,
        age,
        createdAt: new Date()
      }

      res.status(201).json({
        success: true,
        message: 'Data created successfully',
        data: newRecord
      })
    } catch (error) {
      console.error('Error creating data:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
)

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`)
  console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`)
})

export default app
\`\`\`

This API includes:
• TypeScript for type safety
• Input validation with express-validator
• Security headers with Helmet
• CORS configuration
• Rate limiting
• Comprehensive error handling
• Health check endpoint
• Environment-based configuration

The API is production-ready and follows best practices for security, performance, and maintainability.`,
        model: 'claude-3-opus',
        processingTime
      }
    }

    if (userInput.toLowerCase().includes('database') || userInput.toLowerCase().includes('data')) {
      return {
        content: `Perfect! Database design is crucial for scalable applications. Let me help you create a robust database schema and implementation:

## Database Schema Design

\`\`\`sql
-- Users table with proper indexing and constraints
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  repository_url TEXT,
  tech_stack TEXT[], -- PostgreSQL array type
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- API Keys table for authentication
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for security
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## TypeScript Database Client

\`\`\`typescript
import { Pool } from 'pg'
import { z } from 'zod'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// User schema validation
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  fullName: z.string().optional(),
  role: z.enum(['user', 'admin', 'moderator']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export class DatabaseService {
  async createUser(userData: {
    email: string
    username: string
    passwordHash: string
    fullName?: string
  }) {
    const query = \`
      INSERT INTO users (email, username, password_hash, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, full_name, role, is_active, created_at, updated_at
    \`

    const values = [
      userData.email,
      userData.username,
      userData.passwordHash,
      userData.fullName
    ]

    const result = await pool.query(query, values)
    return UserSchema.parse(result.rows[0])
  }

  async getUserById(id: number) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true'
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    return UserSchema.parse(result.rows[0])
  }

  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true'
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    return UserSchema.parse(result.rows[0])
  }

  async updateUser(id: number, updates: Partial<{
    fullName: string
    avatarUrl: string
    isActive: boolean
  }>) {
    const setClause = Object.keys(updates)
      .map((key, index) => \`\${key} = $\${index + 2}\`)
      .join(', ')

    const query = \`
      UPDATE users
      SET \${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    \`

    const values = [id, ...Object.values(updates)]
    const result = await pool.query(query, values)

    return UserSchema.parse(result.rows[0])
  }

  async logAuditEvent(event: {
    userId?: number
    action: string
    resourceType: string
    resourceId?: number
    details?: any
    ipAddress?: string
    userAgent?: string
  }) {
    const query = \`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    \`

    await pool.query(query, [
      event.userId,
      event.action,
      event.resourceType,
      event.resourceId,
      JSON.stringify(event.details),
      event.ipAddress,
      event.userAgent
    ])
  }

  async cleanup() {
    await pool.end()
  }
}

export const db = new DatabaseService()

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down database connections...')
  await db.cleanup()
  process.exit(0)
})
\`\`\`

This database design includes:
• Proper normalization and relationships
• Comprehensive indexing for performance
• Data validation with Zod schemas
• Audit logging for security
• Connection pooling for scalability
• Type-safe queries with TypeScript
• Transaction support for data consistency

The schema is designed to scale and includes all the essential features for a modern web application.`,
        model: 'gpt-4',
        processingTime
      }
    }

    // Default response for other topics
    const responses = [
      `That's an interesting question! Based on my analysis, I can help you explore this topic in depth. Let me break this down for you:

First, let's consider the key aspects of your question. There are several important factors to consider:

1. **Technical Implementation**: The underlying technology and architecture matter significantly
2. **User Experience**: How users interact with the system is crucial for adoption
3. **Scalability**: The solution needs to grow with your needs
4. **Integration**: How well it works with existing systems

From my perspective, the best approach would be to:

• Start with a solid foundation using proven technologies
• Implement proper error handling and monitoring
• Focus on user experience and intuitive design
• Plan for scalability from day one

Would you like me to dive deeper into any of these aspects or provide specific implementation details?`,
      `Great question! I'm excited to help you explore this. Let me provide you with a comprehensive overview and practical guidance.

Here's what I recommend based on current best practices:

## Key Considerations:
• **Performance**: Ensure optimal response times and resource usage
• **Security**: Implement proper authentication and data protection
• **Maintainability**: Write clean, well-documented code
• **Testing**: Comprehensive test coverage for reliability

## Recommended Approach:
1. Start with a clear specification and requirements
2. Choose the right technology stack for your use case
3. Implement incrementally with proper testing
4. Monitor performance and iterate based on feedback

I can provide specific code examples, architecture recommendations, or help you work through any particular challenges you're facing. What aspect would you like to focus on first?`,
      `I love this question! It touches on some really important concepts in modern software development. Let me give you a thorough analysis and some actionable recommendations.

## Current Landscape:
The field is evolving rapidly with new tools and frameworks emerging regularly. It's important to stay informed about the latest developments while maintaining a solid foundation with proven technologies.

## My Recommendations:
Based on extensive experience with similar projects, here's what works best:

• **Foundation**: Strong fundamentals never go out of style
• **Innovation**: Balance cutting-edge solutions with stability
• **Community**: Active communities provide great support
• **Documentation**: Comprehensive docs are essential

## Implementation Strategy:
1. Assess your current setup and requirements
2. Research and evaluate available options
3. Start with a proof of concept
4. Scale gradually based on real-world usage

Would you like me to elaborate on any of these points or provide specific examples for your use case?`
    ]

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      model: ['gpt-4', 'claude-3-opus', 'gemini-pro'][Math.floor(Math.random() * 3)],
      processingTime
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const resetChat = () => {
    setMessages(DEMO_MESSAGES)
    setCopiedMessageId(null)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scalix AI Assistant</h3>
                    <p className="text-sm text-blue-100">Powered by GPT-4 & Claude</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Reset chat"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                            : 'bg-gradient-to-r from-green-500 to-blue-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>

                          {/* Message metadata */}
                          <div className={`flex items-center justify-between mt-2 text-xs ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            <div className="flex items-center space-x-2">
                              {message.model && (
                                <span className="px-2 py-1 bg-black/10 rounded text-xs">
                                  {message.model}
                                </span>
                              )}
                              {message.processingTime && (
                                <span className="px-2 py-1 bg-black/10 rounded text-xs">
                                  {message.processingTime.toFixed(1)}s
                                </span>
                              )}
                              {message.role === 'assistant' && (
                                <button
                                  onClick={() => copyToClipboard(message.content, message.id)}
                                  className="p-1 hover:bg-black/20 rounded transition-colors"
                                  title="Copy message"
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-xs text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about development, AI, or technology..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Try asking about React, APIs, databases, or any development topic!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
