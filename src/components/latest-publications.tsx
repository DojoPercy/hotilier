'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/sanity/lib'
import { useLatestPublications } from '@/hooks/usePublications'

const LatestPublications = () => {
  const { publications, loading, error } = useLatestPublications()

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E212A] mb-2">Browse Our Publications</h2>
            <div className="w-16 h-1 bg-brand-blue"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 mb-4 rounded"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
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
  const visiblePublications = publications.slice(0, 4)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Browse Our Publications</h2>
          <div className="w-20 h-1 bg-brand-blue mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {visiblePublications.map((publication) => (
            <div key={publication._id} className="group cursor-pointer">
              <Link href={`/publications/${publication.slug.current}`}>
                <div className="relative overflow-hidden transition-transform duration-300 ">
                  {/* Publication Cover */}
                  <div className="relative h-[25rem] bg-gray-200  shadow-lg overflow-hidden">
                    {publication.hero?.image ? (
                      <Image
                        src={getImageUrl(publication.hero.image, 1200, 600) as string}
                        alt={publication.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Publication Year Badge */}
                    {publication.year && (
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1  text-sm font-semibold text-gray-800">
                        {publication.year}
                      </div>
                    )}
                  </div>

                  {/* Publication Title */}
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-[#1E212A] group-hover:text-brand-blue transition-colors duration-200 line-clamp-2">
                      {publication.title}
                    </h3>
                    
                    {/* Publication Details */}
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {publication.sectors?.[0] && (
                        <span className="text-xs bg-brand-blue text-white px-2 py-1 ">
                          {publication.sectors[0].title}
                        </span>
                      )}
                      {publication.regions?.[0] && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 -full">
                          {publication.regions[0].title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Publications Button */}
        {publications.length > 4 && (
          <div className="text-center mt-12">
            <Link href="/publications">
              <button className="bg-brand-blue text-white px-8 py-3  font-medium hover:bg-brand-blue transition-colors duration-200">
                View All Publications
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default LatestPublications
