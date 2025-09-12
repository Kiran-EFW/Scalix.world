import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  role: 'user' | 'admin' | 'super_admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('scalix_token', action.payload.token)
        localStorage.setItem('scalix_user', JSON.stringify(action.payload.user))
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('scalix_token')
        localStorage.removeItem('scalix_user')
      }
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('scalix_token')
        const userStr = localStorage.getItem('scalix_user')

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            state.user = user
            state.token = token
            state.isAuthenticated = true
          } catch (error) {
            // Invalid stored data, clear it
            localStorage.removeItem('scalix_token')
            localStorage.removeItem('scalix_user')
          }
        }
      }
    },
  },
})

export const { setCredentials, setUser, setLoading, setError, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
