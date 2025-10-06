'use client'

import { useState } from 'react'
import { SavedItemsList } from '@/components/saved-items'
import { SearchIcon, FilterIcon, SortAscIcon, GridIcon, ListIcon } from 'lucide-react'

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
    authors?: Array<{ _id: string; name: string }>
    sectors?: Array<{ _id: string; title: string }>
  }
}

interface SavedItemsTabProps {
  items: SavedItem[]
  onDelete: (itemId: string) => void
}

export default function SavedItemsTab({ items, onDelete }: SavedItemsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | 'articles' | 'interviews'>('all')

  const filteredItems = items.filter(item => {
    const matchesSearch = item.content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.dek?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterBy === 'all' || item.content._type === filterBy
    return matchesSearch && matchesFilter
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'title':
        return a.content.title.localeCompare(b.content.title)
      default:
        return 0
    }
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 poppins-bold mb-2">Saved Items</h3>
        <p className="text-gray-600">
          {items.length} saved {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
          />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                title="Filter content by type"
                aria-label="Filter content by type"
              >
                <option value="all">All Content</option>
                <option value="articles">Articles</option>
                <option value="interviews">Interviews</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SortAscIcon className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                title="Sort content"
                aria-label="Sort content"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-brand-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
              aria-label="Switch to grid view"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-brand-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
              aria-label="Switch to list view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {sortedItems.length} of {items.length} items
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Content */}
      {sortedItems.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          <SavedItemsList 
            items={sortedItems} 
            onDelete={onDelete}
            viewMode={viewMode}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No items found' : 'No saved items yet'}
          </h4>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? `No items match "${searchQuery}". Try adjusting your search.`
              : 'Start saving articles and interviews to see them here.'
            }
          </p>
          {!searchQuery && (
            <a
              href="/articles"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-vibrant-blue transition-colors duration-200"
            >
              Browse Articles
            </a>
          )}
        </div>
      )}
    </div>
  )
}
