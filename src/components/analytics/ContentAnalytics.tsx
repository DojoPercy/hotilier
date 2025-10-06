'use client'

import React, { useState, useEffect } from 'react'
import { EyeIcon } from '@heroicons/react/24/outline'

interface ContentAnalyticsProps {
  contentId: string
  contentType: 'article' | 'page'
  title?: string
  showFullDashboard?: boolean
}

export function ContentAnalytics({ 
  contentId, 
  contentType, 
  title, 
  showFullDashboard = false 
}: ContentAnalyticsProps) {
  const [views, setViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchViews()
  }, [contentId, contentType])

  const fetchViews = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        contentId,
        contentType
      })

      const response = await fetch(`/api/analytics/performance?${params}`)
      const result = await response.json()

      if (result.success) {
        setViews(result.data.views || 0)
      }
    } catch (error) {
      console.error('Error fetching views:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (showFullDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Analytics for {title || `${contentType} ${contentId}`}
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <EyeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(views)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Views</h3>
      
      <div className="text-center">
        <EyeIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
        <div className="text-3xl font-bold text-gray-900">{formatNumber(views)}</div>
        <div className="text-sm text-gray-600">Total Views</div>
      </div>
    </div>
  )
}