'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Send, Mic, Paperclip, Square } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      adjustTextareaHeight()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  const handleVoiceInput = () => {
    // In a real implementation, this would integrate with Web Speech API
    setIsRecording(!isRecording)
    console.log('Voice input toggled:', !isRecording)
  }

  const handleFileUpload = () => {
    // In a real implementation, this would open a file picker
    console.log('File upload clicked')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="flex items-end space-x-3 bg-white border border-gray-300 rounded-2xl p-3 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
        {/* File Upload Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleFileUpload}
          disabled={disabled}
          className="p-2 h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 min-h-[40px]">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent border-0 outline-none resize-none text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              minHeight: '20px',
              maxHeight: '200px'
            }}
          />
        </div>

        {/* Voice Input Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleVoiceInput}
          disabled={disabled}
          className={`p-2 h-8 w-8 ${
            isRecording
              ? 'text-red-500 hover:text-red-700 bg-red-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isRecording ? (
            <Square className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-primary-600 hover:bg-primary-700 text-white p-2 h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-12 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Listening...</span>
        </motion.div>
      )}

      {/* Character Count */}
      {message.length > 1000 && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {message.length}/2000 characters
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to send,
        <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs ml-1">Shift + Enter</kbd> for new line
      </div>
    </motion.form>
  )
}
