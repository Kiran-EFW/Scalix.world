'use client'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { initializeAuth } from '@/lib/slices/authSlice'

function StoreInitializer() {
  useEffect(() => {
    // Initialize auth state from localStorage
    store.dispatch(initializeAuth())
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreInitializer />
      {children}
    </Provider>
  )
}
