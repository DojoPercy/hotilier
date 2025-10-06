'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'

interface StreamingUpdate {
  contentId: string
  status: 'processing' | 'generating-recommendations' | 'completed' | 'failed'
  message: string
  progress?: number
  data?: any
}

export function useInngestStreaming(contentId?: string) {
  const { user } = useUser()
  const [updates, setUpdates] = useState<StreamingUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!user || !contentId) return

    // Create a unique channel for this user and content
    const streamChannel = `user-${user.sub}-content-${contentId}`
    
    // Set up real-time connection (this would use WebSockets or Server-Sent Events)
    const eventSource = new EventSource(`/api/inngest/stream?channel=${streamChannel}`)
    
    eventSource.onopen = () => {
      setIsConnected(true)
    }
    
    eventSource.onmessage = (event) => {
      try {
        const update: StreamingUpdate = JSON.parse(event.data)
        setUpdates(prev => [...prev, update])
      } catch (error) {
        console.error('Error parsing streaming update:', error)
      }
    }
    
    eventSource.onerror = () => {
      setIsConnected(false)
    }
    
    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [user, contentId])

  const triggerContentProcessing = async (contentId: string, contentType: string, slug: string) => {
    if (!user) return

    const response = await fetch('/api/inngest/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'realtime-content-processing',
        data: {
          contentId,
          contentType,
          slug,
          userId: user.sub,
          streamChannel: `user-${user.sub}-content-${contentId}`
        }
      })
    })

    return response.json()
  }

  return {
    updates,
    isConnected,
    triggerContentProcessing,
    latestUpdate: updates[updates.length - 1]
  }
}

// Hook for batch content processing
export function useBatchContentProcessing() {
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const processBatch = async (contentItems: any[]) => {
    if (!user) return

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/inngest/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'batch-content-processing',
          data: {
            contentItems,
            userId: user.sub
          }
        })
      })

      const result = await response.json()
      setResults(result.results)
    } catch (error) {
      console.error('Batch processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processBatch,
    isProcessing,
    results
  }
}
