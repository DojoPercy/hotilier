'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { useFeaturedInterviews, getInterviewUrl, getPrimaryRegion, getPrimarySector } from '@/hooks/useInterviews'

const FeaturedInterviews = () => {
  const { interviews, loading, error } = useFeaturedInterviews()

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-brand-blue mb-2">Featured Interviews</h2>
            <div className="w-20 h-1 bg-white"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white bg-opacity-20 h-64 rounded-lg mb-4"></div>
                <div className="bg-white bg-opacity-20 h-4 w-24 rounded mb-2"></div>
                <div className="bg-white bg-opacity-20 h-6 w-full rounded mb-2"></div>
                <div className="bg-white bg-opacity-20 h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !interviews.length) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-brand-blue mb-2">Featured Interviews</h2>
          <div className="w-20 h-1 bg-brand-blue"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {interviews.map((interview, index) => (
            <article 
              key={interview._id} 
              className={`group cursor-pointer ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <Link href={getInterviewUrl(interview)}>
                <div className={`bg-light-gray overflow-hidden  transition-transform duration-300  ${
                  index === 0 ? 'lg:flex lg:h-full' : ''
                }`}>
                  {/* Interview Image */}
                  <div className={`relative bg-gray-200 ${
                    index === 0 ? 'lg:w-1/2 lg:h-auto' : ' h-70'
                  } h-64`}>
                    {interview.interviewee?.headshot ? (
                      <Image
                        src={urlFor(interview.interviewee.headshot).url()}
                        alt={interview.interviewee.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : interview.hero?.image ? (
                      <Image
                        src={urlFor(interview.hero.image).url()}
                        alt={interview.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Interview Content */}
                  <div className={`p-6 ${
                    index === 0 ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-start' : ''
                  }`}>
                    {/* Location and Sector */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getPrimaryRegion(interview) && (
                          <span className="text-brand-blue text-sm font-semibold uppercase">
                            {getPrimaryRegion(interview)}
                          </span>
                        )}
                        {getPrimaryRegion(interview) && getPrimarySector(interview) && (
                          <span className="text-gray-400">-</span>
                        )}
                        {getPrimarySector(interview) && (
                          <span className="text-brand-blue text-sm font-semibold uppercase">
                            {getPrimarySector(interview)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interviewee Name */}
                    <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors duration-300 ${
                      index === 0 ? 'text-2xl lg:text-4xl' : 'text-xl'
                    }`}>
                      {interview.interviewee?.name || interview.title}
                    </h3>

                    {/* Interview Type */}
                    <p className="text-sm text-gray-600 mb-2">Interview</p>

                    {/* Role and Organization */}
                    {(interview.interviewee?.role || interview.roleAtTime) && (
                      <p className="text-lg text-gray-700 mb-3 line-clamp-2">
                        {interview.roleAtTime || interview.interviewee?.role}
                        {(interview.organizationAtTime?.name || interview.interviewee?.organization?.name) && (
                          <span className="block text-gray-600">
                            {interview.organizationAtTime?.name || interview.interviewee?.organization?.name}
                          </span>
                        )}
                      </p>
                    )}

                    {/* Quote/Description */}
                    {interview.dek && index === 0&& (
                      <blockquote className="text-gray-600 text-xl pt-5  mb-4 line-clamp-3  ">
                        "{interview.pullQuotes?.[0]}"
                      </blockquote>
                    )}

                    {/* View More Button */}
                    <button className="w-1/2 mt-auto bg-brand-blue text-white py-2 px-4 font-medium hover:bg-white hover:text-brand-blue transition-all duration-300 border-2 border-brand-blue group-hover:border-brand-blue">
                      VIEW MORE
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Interviews Button */}
        <div className="text-center">
          <Link href="/interviews">
            <button className="bg-brand-blue text-white py-3 px-8  font-medium hover:bg-white hover:text-brand-blue transition-colors duration-300 border-2 border-brand-blue hover:border-brand-blue">
              VIEW ALL INTERVIEWS
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedInterviews

