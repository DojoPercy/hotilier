'use client'

import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import {  StarIcon, CalendarIcon, TagIcon, ArrowRightIcon, UserIcon, BuildingIcon } from 'lucide-react'
import { usePremiumContent } from '@/hooks/usePremiumContent'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'

interface PremiumContent {
  _id: string
  _type: 'article' | 'interview'
  title: string
  slug: { current: string }
  dek?: string
  publishedAt?: string
  accessType: 'login' | 'premium'
  hero?: {
    image?: any
    caption?: string
  }
  sectors?: Array<{
    _id: string
    title: string
    slug: string
  }>
  regions?: Array<{
    _id: string
    title: string
    slug: string
  }>
}

interface MemberExclusivesProps {
  className?: string
  maxItems?: number
}

export default function MemberExclusives({ 
  className = '', 
  maxItems = 3 
}: MemberExclusivesProps) {
  const { content, loading, error } = usePremiumContent(maxItems)

  const getContentUrl = (item: PremiumContent) => {
    switch (item._type) {
      case 'article':
        return `/articles/${item.slug.current}`
      case 'interview':
        return `/interviews/${item.slug.current}`
      default:
        return '#'
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return 'Article'
      case 'interview':
        return 'Interview'
      default:
        return 'Content'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={`bg-white py-16 ${className}`}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-12">
              <div className="h-7 bg-gray-200 rounded w-40 mb-3"></div>
              <div className="h-0.5 bg-gray-200 w-16"></div>
            </div>
            
            {/* Content grid skeleton */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="block">
                  <div className="h-56 bg-gray-200 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA skeleton */}
            <div className="flex justify-center">
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || content.length === 0) {
    return null
  }

  return (
    <div className={`bg-white py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Minimal Professional Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
            Member Exclusives
          </h2>
          <div className="w-16 h-0.5 bg-gray-300"></div>
        </div>

        {/* Minimal Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {content.map((item) => (
            <Link
              key={item._id}
              href={getContentUrl(item)}
              className="group block"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden mb-4">
                {item.hero?.image ? (
                  <Image
                    src={urlFor(item.hero.image).width(400).height(250).url()}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      {item._type === 'interview' ? (
                        <UserIcon className="w-10 h-10 mx-auto mb-2" />
                      ) : (
                        <BuildingIcon className="w-10 h-10 mx-auto mb-2" />
                      )}
                      <p className="text-xs font-medium">{getContentTypeLabel(item._type)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-3">
                {/* Member Exclusive Badge */}
                <div>
                  <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
                    Member Exclusive
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors duration-200">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Minimal Call to Action */}
        <div className="flex justify-center">
          <Link
            href="/subscribe"
            className="group inline-flex items-center gap-3 bg-brand-blue hover:bg-vibrant-blue text-white font-medium px-6 py-3 transition-all duration-200 hover:shadow-md"
          >
            <LockClosedIcon className="w-4 h-4" />
            <span>Join now to get full access</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
