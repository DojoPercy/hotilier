'use client'

import React, { useState, useEffect } from 'react'
import { EyeIcon } from '@heroicons/react/24/outline'

interface AnalyticsData {
  views: number
  events: Array<{
    _id: string
    eventType: string
    contentId: string
    contentType: string
    timestamp: string
    pageTitle: string
  }>
}

interface AnalyticsDashboardProps {
  contentId?: string
  contentType?: string
  startDate?: string
  endDate?: string
}

export function AnalyticsDashboard({
  contentId,
  contentType,
  startDate,
  endDate
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [contentId, contentType, startDate, endDate])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (contentId) params.append('contentId', contentId)
      if (contentType) params.append('contentType', contentType)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/analytics/performance?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Failed to fetch analytics data')
      console.error('Analytics fetch error:', err)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button 
          onClick={fetchAnalyticsData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-gray-500">
        No analytics data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
       
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-brand-blue text-white rounded-md text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Views Metric */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-brand-blue text-white">
            <EyeIcon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Views</p>
            <p className="text-2xl font-semibold text-gray-900">{formatNumber(data.views)}</p>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Views</h3>
        <div className="space-y-2">
          {data.events.slice(0, 10).map((event) => (
            <div key={event._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {event.pageTitle || event.contentId}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {event.eventType} • {event.contentType}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}