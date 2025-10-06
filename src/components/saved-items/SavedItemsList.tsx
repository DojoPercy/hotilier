'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, ExternalLink } from 'lucide-react'
import { PaywallOverlay } from '@/components/paywall'

interface SavedItem {
  _id: string
  createdAt: string
  notes?: string
  content: {
    _id: string
    _type: string
    title: string
    slug: { current: string }
    accessType?: 'free' | 'login' | 'premium'
    dek?: string
    publishedAt?: string
    authors?: Array<{
      _id: string
      name: string
    }>
    sectors?: Array<{
      _id: string
      title: string
    }>
  }
}

interface SavedItemsListProps {
  items: SavedItem[]
  onDelete?: (itemId: string) => void
  className?: string
  viewMode?: 'grid' | 'list'
}

export function SavedItemsList({ items, onDelete, className = '', viewMode = 'list' }: SavedItemsListProps) {
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())

  const handleDelete = async (itemId: string) => {
    if (deletingItems.has(itemId)) return

    try {
      setDeletingItems(prev => new Set(prev).add(itemId))
      
      const response = await fetch(`/api/saved-items/delete?itemId=${itemId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete(itemId)
        } else {
          // If no callback provided, reload the page
          window.location.reload()
        }
      } else {
        console.error('Failed to delete saved item:', data.error)
        alert('Failed to delete saved item. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting saved item:', error)
      alert('Failed to delete saved item. Please try again.')
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }
  const getContentUrl = (item: SavedItem) => {
    const { _type, slug } = item.content
    switch (_type) {
      case 'interview':
        return `/interviews/${slug.current}`
      case 'event':
        return `/events/${slug.current}`
      case 'specialReport':
        return `/special-reports/${slug.current}`
      case 'publication':
        return `/publications/${slug.current}`
      case 'video':
        return `/videos/${slug.current}`
      case 'article':
        return `/articles/${slug.current}`
      default:
        return '#'
    }
  }

  const getCategoryLabel = (item: SavedItem) => {
    const { _type, sectors } = item.content
    if (sectors && sectors.length > 0) {
      return sectors[0].title
    }
    
    switch (_type) {
      case 'interview':
        return 'Interview'
      case 'event':
        return 'Event'
      case 'specialReport':
        return 'Special Report'
      case 'publication':
        return 'Publication'
      case 'video':
        return 'Video'
      case 'article':
        return 'News'
      default:
        return 'Content'
    }
  }

  const getAuthorName = (item: SavedItem) => {
    const { authors } = item.content
    if (authors && authors.length > 0) {
      return `By ${authors[0].name.toLowerCase()}`
    }
    return ''
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (items.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No saved content yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Save articles and content to access them here later.
          </p>
        </div>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className={`${className}`}>
        <div className="grid gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue">
                    {getCategoryLabel(item)}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingItems.has(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove from saved items"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-brand-blue transition-colors">
                  {item.content.title}
                </h3>
                
                {item.content.dek && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {item.content.dek}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{getAuthorName(item)}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={getContentUrl(item)}
                    className="inline-flex items-center gap-2 text-brand-blue hover:text-vibrant-blue font-medium text-sm transition-colors"
                  >
                    Read More
                    <ExternalLink size={14} />
                  </Link>

                  {item.content.accessType && item.content.accessType !== 'free' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.content.accessType === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.content.accessType === 'premium' ? 'Premium' : 'Login Required'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Category */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {getCategoryLabel(item)}
                  </span>
                </div>

                {/* Title with External Link Icon */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {item.content.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Link
                      href={getContentUrl(item)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{getAuthorName(item)}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {/* Access Type Indicator */}
                {item.content.accessType && item.content.accessType !== 'free' && (
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.content.accessType === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.content.accessType === 'premium' ? 'Premium' : 'Login Required'}
                    </span>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingItems.has(item._id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove from saved items"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
