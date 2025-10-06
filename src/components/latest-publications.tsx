'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/sanity/lib'
import { useLatestPublications } from '@/hooks/usePublications'
import SidebarAd from './SidebarAd'

const LatestPublications = () => {
  const { publications, loading, error } = useLatestPublications()

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">Browse Our Publications</h2>
            <div className="w-16 h-0.5 bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-3/4"></div>
                  <div className="bg-gray-200 h-3 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !publications.length) {
    return null
  }

  // Show only the first 4 publications
  const visiblePublications = publications.slice(0, 8)

  return (
    <section className="py-16 bg-white">

      <div className="max-w-6xl mx-auto px-6 lg:px-8  ">

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Browse Our Publications</h2>
          <div className="w-20 h-1 bg-brand-blue mt-5"></div>
        </div>
        {/* Publications Grid */}
        <div className='flex lg:flex-row flex-col gap-8'>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {visiblePublications.map((publication) => (
              <Link
                key={publication._id}
                href={`/publications/${publication.slug.current}`}
                className="group block"
              >
                {/* Publication Cover */}
                <div className="relative h-[18rem] lg:h-64 overflow-hidden mb-4">
                  {publication.hero?.image ? (
                    <Image
                      src={getImageUrl(publication.hero.image, 500, 500) as string}
                      alt={publication.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}

                  {/* Publication Year Badge */}
                  {publication.year && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-gray-800">
                      {publication.year}
                    </div>
                  )}
                </div>

                {/* Publication Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors duration-200 line-clamp-2">
                    {publication.title}
                  </h3>

                  {/* Publication Details */}
                  <div className="flex flex-wrap gap-2">
                    {publication.sectors?.[0] && (
                      <span className="text-xs font-medium bg-brand-blue/10 text-brand-blue px-2 py-1">
                        {publication.sectors[0].title}
                      </span>
                    )}
                    {publication.regions?.[0] && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1">
                        {publication.regions[0].title}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar Ad */}
          <div className="mb-12">
            <SidebarAd
              className="mb-6"
              maxAds={2}
              showAdLabel={true}
              showControls={false}
              showIndicators={true}
              autoRotate={true}
              rotationInterval={6000}
            />
          </div>
        </div>

        {/* View All Publications Button */}
        {publications.length > 8 && (
          <div className="text-center">
            <Link href="/publications">
              <button className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 font-medium hover:bg-vibrant-blue transition-colors duration-200">
                View All Publications
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestPublications
