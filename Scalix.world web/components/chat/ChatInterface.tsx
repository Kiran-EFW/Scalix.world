'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import {
  Send,
  StopCircle,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  model?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: Date
}

interface ChatInterfaceProps {
  conversation: Conversation
  selectedModel: any
  onUpdateMessages: (conversationId: string, messages: Message[]) => void
}

export function ChatInterface({ conversation, selectedModel, onUpdateMessages }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages, streamingMessage])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      model: selectedModel.id
    }

    // Add user message
    const updatedMessages = [...conversation.messages, userMessage]
    onUpdateMessages(conversation.id, updatedMessages)

    setIsLoading(true)
    setStreamingMessage('')

    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          model: selectedModel.id,
          conversationId: conversation.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()

      // Simulate streaming by showing the response word by word
      let currentResponse = ''
      const words = data.content.split(' ')

      for (let i = 0; i < words.length; i++) {
        currentResponse += words[i] + ' '
        setStreamingMessage(currentResponse)
        await new Promise(resolve => setTimeout(resolve, 30)) // Faster streaming
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: data.id,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(data.timestamp),
        model: data.model
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      onUpdateMessages(conversation.id, finalMessages)

    } catch (error) {
      console.error('Error sending message:', error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please check your connection and try again.',
        timestamp: new Date(),
        model: selectedModel.id
      }

      const finalMessages = [...updatedMessages, errorMessage]
      onUpdateMessages(conversation.id, finalMessages)
    } finally {
      setIsLoading(false)
      setStreamingMessage('')
    }
  }

  const handleStopGeneration = () => {
    setIsLoading(false)
    setStreamingMessage('')
  }

  const handleRegenerate = () => {
    if (conversation.messages.length > 0) {
      const lastUserMessage = [...conversation.messages]
        .reverse()
        .find(msg => msg.role === 'user')

      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content)
      }
    }
  }

  // Simulate AI response (replace with actual API call to your backend)
  const simulateAIResponse = async (userMessage: string, model: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple response logic based on model and message content
    if (model === 'codellama' && userMessage.toLowerCase().includes('code')) {
      return `Here's a code example for you:

\`\`\`javascript
function greetUser(name) {
  return \`Hello, \${name}! Welcome to Scalix Chat.\`;
}

// Usage
console.log(greetUser('Developer'));
\`\`\`

This function demonstrates basic string interpolation and function usage in JavaScript. Would you like me to explain any part of this code or help you with a specific programming task?`
    }

    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return `Hello! I'm ${selectedModel.name} running on Scalix, your local AI platform. I'm here to help you with any questions or tasks you have. 

What would you like to work on today? I can help with:
- Writing and explaining code
- Answering questions
- Creative tasks
- Problem-solving
- And much more!`
    }

    if (userMessage.toLowerCase().includes('scalix')) {
      return `Scalix is an amazing local-first AI platform that puts privacy and control back in your hands! 

Key benefits:
🚀 **Local Processing**: All AI computations happen on your device
🔒 **Privacy-First**: Your data never leaves your environment
⚡ **Fast & Efficient**: No internet latency for AI responses
💰 **Cost-Effective**: No API usage fees
🎨 **Multiple Models**: Support for various AI models

I'm powered by Scalix and can help you with any task you need assistance with. What would you like to explore?`
    }

    // Default response
    return `I understand you're asking about "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}". 

As ${selectedModel.name} running on Scalix, I'm here to help! I can assist with:
- Code writing and debugging
- Answering questions on various topics
- Creative writing and content generation
- Problem-solving and analysis
- And many other tasks!

Could you provide more details about what you'd like help with?`
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {conversation.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming Message */}
          {streamingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingMessage,
                  timestamp: new Date(),
                  model: selectedModel.id,
                  isStreaming: true
                }}
              />
            </motion.div>
          )}

          {/* Loading Indicator */}
          {isLoading && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-4xl">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Action Buttons */}
          {conversation.messages.length > 0 && (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Regenerate</span>
              </Button>

              {isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopGeneration}
                  className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Stop</span>
                </Button>
              )}
            </div>
          )}

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder={`Ask ${selectedModel.name} anything...`}
          />

          {/* Footer Info */}
          <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Powered by {selectedModel.name}</span>
              <span>•</span>
              <span>Local AI Processing</span>
              <span>•</span>
              <span>Privacy-First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
