import { useState, useEffect, useCallback, useRef } from 'react'
import { realtimeListener, RealtimeEvent, RealtimeListenerOptions } from '@/lib/realtimeListener'

export interface UseRealtimeDataOptions<T> extends RealtimeListenerOptions {
  initialData?: T[]
  onError?: (error: Error) => void
  enabled?: boolean
}

export interface UseRealtimeDataReturn<T> {
  data: T[]
  loading: boolean
  error: Error | null
  lastUpdate: Date | null
  listenerId: string | null
  refresh: () => void
}

export function useRealtimeData<T = any>(
  options: UseRealtimeDataOptions<T>
): UseRealtimeDataReturn<T> {
  const [data, setData] = useState<T[]>(options.initialData || [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [listenerId, setListenerId] = useState<string | null>(null)
  
  const listenerIdRef = useRef<string | null>(null)
  const isSubscribedRef = useRef(false)

  const handleRealtimeEvent = useCallback((event: RealtimeEvent<T>) => {
    setData(prevData => {
      const newData = [...prevData]
      
      switch (event.type) {
        case 'added':
          // Add new item at the beginning (assuming ordered by timestamp desc)
          newData.unshift(event.data)
          break
          
        case 'modified':
          // Update existing item
          const modifiedIndex = newData.findIndex(item => 
            (item as any).id === event.id
          )
          if (modifiedIndex !== -1) {
            newData[modifiedIndex] = event.data
          }
          break
          
        case 'removed':
          // Remove item
          const removedIndex = newData.findIndex(item => 
            (item as any).id === event.id
          )
          if (removedIndex !== -1) {
            newData.splice(removedIndex, 1)
          }
          break
      }
      
      return newData
    })
    
    setLastUpdate(new Date())
    setError(null)
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
    // Trigger a refresh by re-subscribing
    if (listenerIdRef.current) {
      realtimeListener.unsubscribe(listenerIdRef.current)
      listenerIdRef.current = null
    }
    isSubscribedRef.current = false
  }, [])

  useEffect(() => {
    if (!options.enabled) {
      return
    }

    const subscribe = async () => {
      try {
        setLoading(true)
        setError(null)

        const id = await realtimeListener.subscribe(options, handleRealtimeEvent)
        listenerIdRef.current = id
        setListenerId(id)
        isSubscribedRef.current = true
        setLoading(false)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to subscribe to real-time updates')
        setError(error)
        options.onError?.(error)
        setLoading(false)
      }
    }

    if (!isSubscribedRef.current) {
      subscribe()
    }

    return () => {
      if (listenerIdRef.current) {
        realtimeListener.unsubscribe(listenerIdRef.current)
        listenerIdRef.current = null
        setListenerId(null)
        isSubscribedRef.current = false
      }
    }
  }, [
    options.collection,
    options.userId,
    options.limit,
    options.orderBy,
    options.orderDirection,
    options.where,
    options.enabled,
    handleRealtimeEvent,
    options.onError
  ])

  return {
    data,
    loading,
    error,
    lastUpdate,
    listenerId,
    refresh
  }
}

// Specialized hooks for common use cases
export function useRealtimeProjects(userId: string, enabled: boolean = true) {
  return useRealtimeData({
    collection: 'projects',
    userId,
    orderBy: 'createdTimestamp',
    orderDirection: 'desc',
    limit: 50,
    enabled
  })
}

export function useRealtimeApiKeys(userId: string, enabled: boolean = true) {
  return useRealtimeData({
    collection: 'api_keys',
    userId,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit: 20,
    enabled
  })
}

export function useRealtimeErrorLogs(enabled: boolean = true) {
  return useRealtimeData({
    collection: 'error_logs',
    orderBy: 'timestamp',
    orderDirection: 'desc',
    limit: 100,
    enabled
  })
}

export function useRealtimeTeamMembers(userId: string, enabled: boolean = true) {
  return useRealtimeData({
    collection: 'team_members',
    userId,
    orderBy: 'joinedAt',
    orderDirection: 'desc',
    limit: 50,
    enabled
  })
}

export function useRealtimeUsageData(userId: string, enabled: boolean = true) {
  return useRealtimeData({
    collection: 'usage_analytics',
    userId,
    orderBy: 'timestamp',
    orderDirection: 'desc',
    limit: 100,
    enabled
  })
}

// Hook for real-time connection status
export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isFirestoreAvailable, setIsFirestoreAvailable] = useState(false)

  useEffect(() => {
    const checkStatus = () => {
      const available = realtimeListener.isFirestoreAvailable()
      setIsFirestoreAvailable(available)
      setIsConnected(available)
    }

    checkStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    isConnected,
    isFirestoreAvailable,
    activeListeners: realtimeListener.getActiveListeners()
  }
}
