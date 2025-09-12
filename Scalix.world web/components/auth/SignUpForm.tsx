'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { AlertTriangle } from 'lucide-react'

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onClose: () => void
}

export function SignUpForm({ onClose }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()

  // Development mode auto-fill
  const isDevelopment = process.env.NODE_ENV === 'development'
  const devEmail = 'admin@scalix.world'
  const devPassword = 'dev123456'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: isDevelopment ? {
      email: devEmail,
      password: devPassword,
      confirmPassword: devPassword,
      acceptTerms: true,
    } : {},
  })

  // Auto-fill form in development mode
  useEffect(() => {
    if (isDevelopment) {
      setValue('email', devEmail)
      setValue('password', devPassword)
      setValue('confirmPassword', devPassword)
      setValue('acceptTerms', true)
    }
  }, [isDevelopment, setValue])

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await signUp(data.email, data.password)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
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
                Form auto-filled with development credentials. Any details will work.
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
          placeholder={isDevelopment ? "dev123456 (auto-filled)" : "Create a password"}
          {...register('password')}
          className={errors.password ? 'border-red-300' : ''}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={isDevelopment ? "dev123456 (auto-filled)" : "Confirm your password"}
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-300' : ''}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="acceptTerms" className="text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-500 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-500 underline">
              Privacy Policy
            </a>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
