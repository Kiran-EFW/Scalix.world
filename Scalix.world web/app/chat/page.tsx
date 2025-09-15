'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

// Type definitions for chat functionality
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: Date
}
import {
  MessageSquare,
  Settings,
  User,
  Bot,
  Sparkles,
  Zap,
  Brain,
  Code,
  Globe,
  Crown,
  Star
} from 'lucide-react'

const aiModels = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
    icon: Brain,
    maxTokens: 8192,
    contextWindow: '8K tokens',
    plan: 'pro', // Pro users only
    proFeature: true
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Excellent for analysis and writing',
    icon: Sparkles,
    maxTokens: 4096,
    contextWindow: '4K tokens',
    plan: 'pro', // Pro users only
    proFeature: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for general tasks',
    icon: Zap,
    maxTokens: 4096,
    contextWindow: '4K tokens',
    plan: 'free', // Available to all
    proFeature: false
  },
  {
    id: 'codellama',
    name: 'Code Llama',
    description: 'Specialized for code generation',
    icon: Code,
    maxTokens: 4096,
    contextWindow: '4K tokens',
    plan: 'free', // Available to all
    proFeature: false
  }
]

const welcomeMessages = {
  free: [
    "Hello! I'm your AI assistant powered by Scalix. How can I help you today?",
    "Welcome to Scalix Chat! I'm here to assist with any questions or tasks you have.",
    "Hi there! Ready to explore the power of AI? Let's get started!",
    "Greetings! I'm your intelligent companion. What would you like to work on?"
  ],
  pro: [
    "Welcome to Scalix Chat Pro! I'm your premium AI assistant with access to GPT-4 and Claude 3. How can I assist you today?",
    "Hello Pro user! I'm powered by the most advanced AI models. What complex task can I help you with?",
    "Greetings! As a Pro subscriber, you have access to our most capable AI models. Ready to tackle something challenging?",
    "Welcome back! Your Pro AI assistant is here with GPT-4, Claude 3, and unlimited creative potential. What shall we create?"
  ]
}

export default function ChatPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const hasProAccess = user?.plan === 'pro' || user?.plan === 'team' || user?.plan === 'enterprise'

  // Filter available models based on user plan
  const availableModels = aiModels.filter(model =>
    !model.proFeature || hasProAccess
  )

  const [selectedModel, setSelectedModel] = useState(availableModels[0])
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize with a welcome conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const messageSet = hasProAccess ? welcomeMessages.pro : welcomeMessages.free
      const welcomeMessage = messageSet[Math.floor(Math.random() * messageSet.length)]
      const initialConversation = {
        id: 'welcome',
        title: hasProAccess ? 'Welcome to Scalix Chat Pro' : 'Welcome to Scalix Chat',
        messages: [{
          id: 'welcome-msg',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }],
        model: selectedModel.id,
        createdAt: new Date()
      }
      setConversations([initialConversation])
      setCurrentConversation(initialConversation)
    }
  }, [hasProAccess])

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      model: selectedModel.id,
      createdAt: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    setIsSidebarOpen(false)
  }

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
    setIsSidebarOpen(false)
  }

  const updateConversationMessages = (conversationId: string, messages: ChatMessage[]) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, messages, title: generateTitle(messages) }
        : conv
    ))
    setCurrentConversation(prev => prev && prev.id === conversationId
      ? { ...prev, messages, title: generateTitle(messages) }
      : prev
    )
  }

  const generateTitle = (messages: ChatMessage[]) => {
    if (messages.length === 0) return 'New Chat'
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    if (!firstUserMessage) return 'New Chat'

    const content = firstUserMessage.content
    // Generate a title from the first 50 characters of the user's message
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasProAccess ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-primary-100'
                }`}>
                  {hasProAccess ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Scalix Chat {hasProAccess && <span className="text-yellow-600">Pro</span>}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {hasProAccess ? 'Premium AI Assistant' : 'AI Assistant'}
                  </p>
                </div>
                {hasProAccess && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                    <Star className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-800">Pro</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <selectedModel.icon className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium">{selectedModel.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showModelSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                    >
                      <div className="p-3">
                        {/* Pro User Header */}
                        {hasProAccess && (
                          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">Pro Features Unlocked</span>
                          </div>
                        )}

                        {/* Free Models */}
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Available to All Users
                          </div>
                          {aiModels.filter(model => !model.proFeature).map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model)
                                setShowModelSelector(false)
                              }}
                              className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                                selectedModel.id === model.id ? 'bg-primary-50 border border-primary-200' : ''
                              }`}
                            >
                              <model.icon className="w-5 h-5 text-primary-600" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{model.name}</div>
                                <div className="text-xs text-gray-500">{model.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Pro Models */}
                        {aiModels.filter(model => model.proFeature).length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center space-x-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>Pro Features</span>
                            </div>
                            {aiModels.filter(model => model.proFeature).map((model) => {
                              const isAvailable = hasProAccess
                              return (
                                <div key={model.id}>
                                  {isAvailable ? (
                                    <button
                                      onClick={() => {
                                        setSelectedModel(model)
                                        setShowModelSelector(false)
                                      }}
                                      className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                                        selectedModel.id === model.id ? 'bg-primary-50 border border-primary-200' : ''
                                      }`}
                                    >
                                      <model.icon className="w-5 h-5 text-primary-600" />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{model.name}</div>
                                        <div className="text-xs text-gray-500">{model.description}</div>
                                      </div>
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    </button>
                                  ) : (
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200 text-left opacity-60">
                                      <model.icon className="w-5 h-5 text-gray-400" />
                                      <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-600">{model.name}</div>
                                        <div className="text-xs text-gray-400">{model.description}</div>
                                      </div>
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    </div>
                                  )}
                                </div>
                              )
                            })}

                            {/* Upgrade Prompt for Free Users */}
                            {!hasProAccess && (
                              <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                                <div className="flex items-start space-x-3">
                                  <Crown className="w-5 h-5 text-primary-600 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-primary-900 mb-1">
                                      Unlock Pro AI Models
                                    </div>
                                    <div className="text-xs text-primary-700 mb-2">
                                      Access GPT-4 and Claude 3 for advanced AI capabilities
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1"
                                      onClick={() => {
                                        setShowModelSelector(false)
                                        // Navigate to pricing page
                                        window.location.href = '/pricing'
                                      }}
                                    >
                                      Upgrade to Pro
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* New Chat Button */}
              <Button
                onClick={createNewConversation}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Sidebar - Conversations */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed md:relative z-20 w-80 bg-white border-r border-gray-200 h-full md:block"
            >
              {/* Pro User Banner */}
              {hasProAccess && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200 p-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm text-yellow-900">Pro User</div>
                      <div className="text-xs text-yellow-700">Unlimited AI access</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border-b border-gray-200">
                <Button
                  onClick={createNewConversation}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>New Chat</span>
                </Button>
              </div>

              {/* Pro Features Section */}
              {hasProAccess && (
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50/50 to-primary-100/50">
                  <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
                    Pro Features
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Brain className="w-4 h-4 text-primary-600" />
                      <span>GPT-4 Access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span>Claude 3 Access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Zap className="w-4 h-4 text-primary-600" />
                      <span>Priority Processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Star className="w-4 h-4 text-primary-600" />
                      <span>Advanced Models</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Recent Conversations
                  </div>
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => selectConversation(conversation)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                          currentConversation?.id === conversation.id ? 'bg-primary-50 border border-primary-200' : ''
                        }`}
                      >
                        <div className="font-medium text-sm truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {conversation.createdAt.toLocaleDateString()}
                        </div>
                        {hasProAccess && (
                          <div className="flex items-center space-x-1 mt-2">
                            <div className={`w-2 h-2 rounded-full ${
                              availableModels.find(m => m.id === conversation.model)
                                ? 'bg-primary-600' : 'bg-gray-400'
                            }`} />
                            <span className="text-xs text-gray-500 capitalize">
                              {conversation.model.replace('-', ' ')}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation && (
            <ChatInterface
              conversation={currentConversation}
              selectedModel={selectedModel}
              onUpdateMessages={updateConversationMessages}
            />
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
