import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'minimal' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const LogoIcon = ({ size = 'md', className }: { size?: LogoProps['size']; className?: string }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground font-bold',
      sizeClasses[size],
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(
          size === 'sm' ? 'w-4 h-4' :
          size === 'md' ? 'w-6 h-6' :
          size === 'lg' ? 'w-8 h-8' :
          'w-10 h-10'
        )}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>
  )
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  className
}) => {
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  if (variant === 'minimal') {
    return <LogoIcon size={size} className={className} />
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <LogoIcon size={size} />
        <div>
          <h1 className={cn('font-bold tracking-tight text-foreground', textSizeClasses[size])}>
            Scalix
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Solutions
          </p>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LogoIcon size={size} />
      <span className={cn('font-bold tracking-tight text-foreground', textSizeClasses[size])}>
        Scalix
      </span>
    </div>
  )
}

// Specialized logos for different contexts
export const LogoAdmin: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo {...props} variant="default" />
)

export const LogoWeb: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <Logo {...props} variant="full" />
)

export const LogoElectron: React.FC<Omit<LogoProps, 'variant'>> = (props) => (
  <div className={cn('flex items-center space-x-2', props.className)}>
    <LogoIcon size={props.size} />
    <span className={cn('font-bold tracking-tight text-foreground', {
      'text-sm': props.size === 'sm',
      'text-lg': props.size === 'md',
      'text-xl': props.size === 'lg',
      'text-2xl': props.size === 'xl'
    })}>
      Scalix Desktop
    </span>
  </div>
)
