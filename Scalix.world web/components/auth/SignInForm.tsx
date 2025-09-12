'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onClose: () => void
}

export function SignInForm({ onClose }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  // Development mode auto-fill
  const isDevelopment = process.env.NODE_ENV === 'development'
  const devEmail = 'admin@scalix.world'
  const devPassword = 'dev123456'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: isDevelopment ? {
      email: devEmail,
      password: devPassword,
    } : {},
  })

  // Auto-fill form in development mode
  useEffect(() => {
    if (isDevelopment) {
      setValue('email', devEmail)
      setValue('password', devPassword)
    }
  }, [isDevelopment, setValue])

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await signIn(data.email, data.password)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isDevelopment && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Development Mode</p>
              <p className="text-xs text-yellow-700 mt-1">
                Form auto-filled with development credentials. Any email/password will work.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder={isDevelopment ? "admin@scalix.world (auto-filled)" : "Enter your email"}
          {...register('email')}
          className={errors.email ? 'border-red-300' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder={isDevelopment ? "dev123456 (auto-filled)" : "Enter your password"}
          {...register('password')}
          className={errors.password ? 'border-red-300' : ''}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
