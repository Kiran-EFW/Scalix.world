'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  User,
  Bot,
  Check
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  model?: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type)
    // Here you could send feedback to your analytics service
    console.log(`Feedback: ${type} for message ${message.id}`)
  }

  const formatContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Code blocks
        if (line.startsWith('```') && line.endsWith('```')) {
          return (
            <pre key={index} className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto my-2 text-sm">
              <code>{line.slice(3, -3)}</code>
            </pre>
          )
        }

        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**')
          return (
            <p key={index} className="mb-2">
              {parts.map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          )
        }

        // Lists
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <li key={index} className="mb-1 ml-4">
              {line.substring(2)}
            </li>
          )
        }

        // Regular paragraphs
        return line ? (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        ) : (
          <br key={index} />
        )
      })
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === 'user'
            ? 'bg-primary-600 text-white'
            : 'bg-primary-100 text-primary-600'
        }`}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            message.role === 'user'
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            {/* Message Header */}
            <div className={`flex items-center justify-between mb-2 text-xs ${
              message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
            }`}>
              <span className="font-medium">
                {message.role === 'user' ? 'You' : `Scalix AI${message.model ? ` (${message.model})` : ''}`}
              </span>
              <span>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Message Content */}
            <div className={`prose prose-sm max-w-none ${
              message.role === 'user' ? 'prose-invert' : ''
            }`}>
              {formatContent(message.content)}
            </div>

            {/* Streaming Indicator */}
            {message.isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block w-2 h-4 bg-primary-600 ml-1 animate-pulse"
              />
            )}
          </div>

          {/* Message Actions */}
          {!message.isStreaming && message.role === 'assistant' && (
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('positive')}
                  className={`h-8 px-2 ${
                    feedback === 'positive'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('negative')}
                  className={`h-8 px-2 ${
                    feedback === 'negative'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
