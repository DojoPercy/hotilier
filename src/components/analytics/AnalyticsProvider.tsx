'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAnalytics, AnalyticsEventType, ContentType } from '@/hooks/useAnalytics'

interface AnalyticsContextType {
  track: (event: {
    eventType: AnalyticsEventType
    contentId?: string
    contentType?: ContentType
    pageTitle?: string
  }) => Promise<void>
  trackPageView: (contentId?: string, contentType?: ContentType, pageTitle?: string) => void
  trackArticleView: (articleId: string, articleTitle?: string) => void
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analytics = useAnalytics()

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }
  return context
}