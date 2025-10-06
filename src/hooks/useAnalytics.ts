'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useCallback, useEffect, useRef, useState } from 'react'

// Simple types for analytics events
export type AnalyticsEventType = 'page_view' | 'article_view'
export type ContentType = 'article' | 'page'

export interface AnalyticsEvent {
  eventType: AnalyticsEventType
  contentId?: string
  contentType?: ContentType
  pageTitle?: string
}

// Simple hook for analytics tracking
export function useAnalytics() {
  const { user } = useUser()
  const [isEnabled, setIsEnabled] = useState(true)
  const hasTrackedPageView = useRef<boolean>(false)

  // Track an analytics event
  const track = useCallback(async (event: AnalyticsEvent) => {
    if (!isEnabled) return

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.statusText)
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error)
    }
  }, [isEnabled])

  // Track page view
  const trackPageView = useCallback((contentId?: string, contentType?: ContentType, pageTitle?: string) => {
    if (hasTrackedPageView.current) return
    
    hasTrackedPageView.current = true
    
    track({
      eventType: 'page_view',
      contentId,
      contentType,
      pageTitle: pageTitle || document.title
    })
  }, [track])

  // Track article view
  const trackArticleView = useCallback((articleId: string, articleTitle?: string) => {
    track({
      eventType: 'article_view',
      contentId: articleId,
      contentType: 'article',
      pageTitle: articleTitle || document.title
    })
  }, [track])

  return {
    track,
    trackPageView,
    trackArticleView,
    isEnabled,
    setIsEnabled
  }
}

// Hook for tracking page views automatically
export function usePageTracking(contentId?: string, contentType?: ContentType, pageTitle?: string) {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(contentId, contentType, pageTitle)
  }, [trackPageView, contentId, contentType, pageTitle])
}

// Hook for tracking article views
export function useArticleTracking(articleId: string, articleTitle?: string) {
  const { trackArticleView } = useAnalytics()

  useEffect(() => {
    trackArticleView(articleId, articleTitle)
  }, [trackArticleView, articleId, articleTitle])
}