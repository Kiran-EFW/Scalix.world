// Design System for Scalix - API Subscription Management Platform
export const designTokens = {
  // Color Palette - Professional Blue/Purple theme
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },

  // Spacing
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Layout
  layout: {
    maxWidth: {
      '7xl': '80rem',
      '6xl': '72rem',
      '5xl': '64rem',
      '4xl': '56rem',
      '3xl': '48rem',
      '2xl': '42rem',
      xl: '36rem',
      lg: '32rem',
      md: '28rem',
      sm: '24rem',
      xs: '20rem',
    },
    sidebar: {
      width: '16rem', // 64 in Tailwind (256px)
      collapsedWidth: '4rem', // 16 in Tailwind (64px)
    },
  },
}

// Consistent component styles
export const componentStyles = {
  // Page backgrounds
  pageBackground: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen',

  // Card styles
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-gray-200',
    hover: 'bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200',
    elevated: 'bg-white rounded-xl shadow-lg border border-gray-200',
  },

  // Button styles
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 font-medium rounded-lg transition-all duration-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
  },

  // Input styles
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
    error: 'w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200',
  },

  // Navigation
  nav: {
    item: {
      active: 'bg-blue-50 text-blue-700 border-r-2 border-blue-500',
      inactive: 'text-gray-700 hover:bg-gray-100',
      base: 'flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200',
    },
  },

  // Status indicators
  status: {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-gray-100 text-gray-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
  },
}

// API Subscription Management specific styles
export const subscriptionStyles = {
  plan: {
    free: 'border-gray-200 bg-gray-50',
    pro: 'border-blue-200 bg-blue-50',
    enterprise: 'border-purple-200 bg-purple-50',
  },

  usage: {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100',
  },

  model: {
    gpt4: 'bg-green-100 text-green-800',
    claude: 'bg-purple-100 text-purple-800',
    gemini: 'bg-blue-100 text-blue-800',
    local: 'bg-gray-100 text-gray-800',
  },
}

// Consistent layout patterns
export const layoutPatterns = {
  page: {
    header: 'mb-8',
    section: 'mb-6',
    card: 'p-6',
  },

  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    stats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  },

  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    column: 'flex flex-col',
  },
}
