import { db } from './firebase'

// Real-time listener types
export type RealtimeEventType = 'added' | 'modified' | 'removed'

export interface RealtimeEvent<T = any> {
  type: RealtimeEventType
  id: string
  data: T
  timestamp: Date
}

export interface RealtimeListenerOptions {
  collection: string
  userId?: string
  limit?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  where?: Array<{ field: string; operator: any; value: any }>
}

export type RealtimeCallback<T = any> = (event: RealtimeEvent<T>) => void

class RealtimeListenerManager {
  private static instance: RealtimeListenerManager
  private listeners: Map<string, () => void> = new Map()
  private firestoreAvailable: boolean = false

  private constructor() {
    this.checkFirestoreAvailability()
  }

  public static getInstance(): RealtimeListenerManager {
    if (!RealtimeListenerManager.instance) {
      RealtimeListenerManager.instance = new RealtimeListenerManager()
    }
    return RealtimeListenerManager.instance
  }

  private async checkFirestoreAvailability(): Promise<void> {
    try {
      if (db) {
        // Test Firestore connection
        const { collection, getDocs, limit } = await import('firebase/firestore')
        const testRef = collection(db, 'test')
        await getDocs(testRef, limit(1))
        this.firestoreAvailable = true
        console.log('✅ Realtime Listener: Firestore connected')
      }
    } catch (error) {
      this.firestoreAvailable = false
      console.log('⚠️ Realtime Listener: Using mock data fallback')
    }
  }

  public async subscribe<T = any>(
    options: RealtimeListenerOptions,
    callback: RealtimeCallback<T>
  ): Promise<string> {
    const listenerId = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      if (this.firestoreAvailable && db) {
        const { 
          collection, 
          onSnapshot, 
          query, 
          where, 
          orderBy, 
          limit: firestoreLimit 
        } = await import('firebase/firestore')

        const collectionRef = collection(db, options.collection)
        let q = collectionRef

        // Apply where conditions
        if (options.where) {
          options.where.forEach(condition => {
            q = query(q, where(condition.field, condition.operator, condition.value))
          })
        }

        // Apply ordering
        if (options.orderBy) {
          q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'))
        }

        // Apply limit
        if (options.limit) {
          q = query(q, firestoreLimit(options.limit))
        }

        // Add user filter if provided
        if (options.userId) {
          q = query(q, where('userId', '==', options.userId))
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const eventType = change.type === 'added' ? 'added' : 
                             change.type === 'modified' ? 'modified' : 'removed'
            
            const event: RealtimeEvent<T> = {
              type: eventType,
              id: change.doc.id,
              data: {
                id: change.doc.id,
                ...change.doc.data(),
                // Convert Firestore timestamps to Date objects
                ...Object.fromEntries(
                  Object.entries(change.doc.data()).map(([key, value]) => [
                    key,
                    value && typeof value === 'object' && 'toDate' in value
                      ? value.toDate()
                      : value
                  ])
                )
              },
              timestamp: new Date()
            }

            callback(event)
          })
        }, (error) => {
          console.error('❌ Realtime listener error:', error)
          // Fallback to mock data on error
          this.setupMockListener(listenerId, options, callback)
        })

        this.listeners.set(listenerId, unsubscribe)
        console.log('✅ Realtime listener subscribed:', listenerId)
        return listenerId

      } else {
        // Fallback to mock data
        return this.setupMockListener(listenerId, options, callback)
      }
    } catch (error) {
      console.error('❌ Failed to setup realtime listener:', error)
      // Fallback to mock data
      return this.setupMockListener(listenerId, options, callback)
    }
  }

  private setupMockListener<T = any>(
    listenerId: string,
    options: RealtimeListenerOptions,
    callback: RealtimeCallback<T>
  ): string {
    // Mock real-time updates using intervals
    const interval = setInterval(() => {
      // Simulate random updates for demo purposes
      if (Math.random() < 0.1) { // 10% chance of update
        const mockEvent: RealtimeEvent<T> = {
          type: 'modified',
          id: `mock_${Date.now()}`,
          data: {
            id: `mock_${Date.now()}`,
            message: 'Mock real-time update',
            timestamp: new Date(),
            userId: options.userId || 'admin'
          } as T,
          timestamp: new Date()
        }
        callback(mockEvent)
      }
    }, 5000) // Check every 5 seconds

    const unsubscribe = () => clearInterval(interval)
    this.listeners.set(listenerId, unsubscribe)
    console.log('⚠️ Mock realtime listener setup:', listenerId)
    return listenerId
  }

  public unsubscribe(listenerId: string): boolean {
    const unsubscribe = this.listeners.get(listenerId)
    if (unsubscribe) {
      unsubscribe()
      this.listeners.delete(listenerId)
      console.log('✅ Realtime listener unsubscribed:', listenerId)
      return true
    }
    return false
  }

  public unsubscribeAll(): void {
    this.listeners.forEach((unsubscribe, listenerId) => {
      unsubscribe()
      console.log('✅ Realtime listener unsubscribed:', listenerId)
    })
    this.listeners.clear()
  }

  public getActiveListeners(): string[] {
    return Array.from(this.listeners.keys())
  }

  public isFirestoreAvailable(): boolean {
    return this.firestoreAvailable
  }
}

// Export singleton instance
export const realtimeListener = RealtimeListenerManager.getInstance()

// Helper functions for common use cases
export const subscribeToProjects = (userId: string, callback: RealtimeCallback) => {
  return realtimeListener.subscribe({
    collection: 'projects',
    userId,
    orderBy: 'createdTimestamp',
    orderDirection: 'desc',
    limit: 50
  }, callback)
}

export const subscribeToApiKeys = (userId: string, callback: RealtimeCallback) => {
  return realtimeListener.subscribe({
    collection: 'api_keys',
    userId,
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit: 20
  }, callback)
}

export const subscribeToErrorLogs = (callback: RealtimeCallback) => {
  return realtimeListener.subscribe({
    collection: 'error_logs',
    orderBy: 'timestamp',
    orderDirection: 'desc',
    limit: 100
  }, callback)
}

export const subscribeToTeamMembers = (userId: string, callback: RealtimeCallback) => {
  return realtimeListener.subscribe({
    collection: 'team_members',
    userId,
    orderBy: 'joinedAt',
    orderDirection: 'desc',
    limit: 50
  }, callback)
}

export const subscribeToUsageData = (userId: string, callback: RealtimeCallback) => {
  return realtimeListener.subscribe({
    collection: 'usage_analytics',
    userId,
    orderBy: 'timestamp',
    orderDirection: 'desc',
    limit: 100
  }, callback)
}

// React hook for real-time updates
export const useRealtimeListener = <T = any>(
  options: RealtimeListenerOptions,
  callback: RealtimeCallback<T>,
  deps: any[] = []
) => {
  const { useEffect, useRef } = require('react')
  
  const listenerIdRef = useRef<string | null>(null)

  useEffect(() => {
    const subscribe = async () => {
      if (listenerIdRef.current) {
        realtimeListener.unsubscribe(listenerIdRef.current)
      }
      
      listenerIdRef.current = await realtimeListener.subscribe(options, callback)
    }

    subscribe()

    return () => {
      if (listenerIdRef.current) {
        realtimeListener.unsubscribe(listenerIdRef.current)
        listenerIdRef.current = null
      }
    }
  }, deps)

  return listenerIdRef.current
}

export default realtimeListener
