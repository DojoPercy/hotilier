'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/sanity/lib'
import { useRecentEvents, getEventUrl, getEventType, getEventLocation, formatEventDate, formatEventTime, getDaysUntilEvent } from '@/hooks/useEvents'

const RecentEvents = () => {
  const { events, loading, error } = useRecentEvents()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Auto-advance carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => 
//         prevIndex >= events.length - 1 ? 0 : prevIndex + 1
//       )
//     }, 4000) // Change slide every 4 seconds

//     return () => clearInterval(interval)
//   }, [isMobile, events.length])

  const nextSlide = () => {
    if (isMobile) {
      if (events.length <= 2) return
      setCurrentIndex((prevIndex) => 
        prevIndex >= events.length - 2 ? 0 : prevIndex + 1
      )
    } else {
      if (events.length <= 3) return
      setCurrentIndex((prevIndex) => 
        prevIndex >= events.length - 3 ? 0 : prevIndex + 1
      )
    }
  }

  const prevSlide = () => {
    if (isMobile) {
      if (events.length <= 2) return
      setCurrentIndex((prevIndex) => 
        prevIndex <= 0 ? events.length - 2 : prevIndex - 1
      )
    } else {
      if (events.length <= 3) return
      setCurrentIndex((prevIndex) => 
        prevIndex <= 0 ? events.length - 3 : prevIndex - 1
      )
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E212A] mb-2">Recent Events</h2>
            <div className="w-16 h-1 bg-brand-blue"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
                <div className="bg-gray-200 h-6 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !events.length) {
    return null
  }

  const visibleEvents = isMobile 
    ? events.slice(currentIndex, currentIndex + 1)
    : events.slice(currentIndex, currentIndex + 3)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 my-16">
          <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Recent Events</h2>
          <div className="w-20 h-1 bg-brand-blue mt-5"></div>
        </div>

        <div className="relative mt-20">
          {/* Navigation Arrows - Always show on mobile, conditional on desktop */}
          {(isMobile ? events.length > 2 : events.length > 3) && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {visibleEvents.map((event) => (
              <article key={event._id} className="group cursor-pointer">
                <Link href={getEventUrl(event)}>
                  <div className="relative overflow-hidden transition-transform duration-300">
                    <div className="relative h-[20rem] bg-gray-200">
                      {event.hero?.image ? (
                        <Image
                          src={getImageUrl(event.hero.image, 1200, 300) as string}
                          alt={event.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Event Type Badge */}
                      <div className="absolute top-4 left-4 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                        {getEventType(event)}
                      </div>
                      
                      {/* Days Until Event Badge */}
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {getDaysUntilEvent(event)} days
                      </div>
                    </div>

                    <div className="p-6 bg-light-gray max-h-[25rem] flex flex-col justify-between group-hover:bg-brand-blue group-hover:text-white">
                      <div>
                        {/* Event Date and Time */}
                        <div className="text-lg font-bold text-brand-blue uppercase tracking-wide group-hover:text-white mb-2">
                          {formatEventDate(event.start, event.end)}
                        </div>
                        
                        <div className="text-sm text-gray-600 group-hover:text-white mb-3">
                          {formatEventTime(event.start, event.end)}
                        </div>

                        {/* Event Title */}
                        <h3 className="text-xl lg:text-2xl font-bold text-[#1E212A] mb-3 line-clamp-2 group-hover:text-white transition-colors">
                          {event.title}
                        </h3>

                        {/* Event Location */}
                        <div className="flex items-center text-[#65676E] group-hover:text-white mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{getEventLocation(event)}</span>
                        </div>

                        {/* Partners */}
                        {event.partners && event.partners.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-[#65676E] group-hover:text-white mb-2">Partners:</p>
                            <div className="flex flex-wrap gap-2">
                              {event.partners.slice(0, 3).map((partner) => (
                                <span key={partner._id} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded group-hover:bg-white group-hover:text-brand-blue">
                                  {partner.name}
                                </span>
                              ))}
                              {event.partners.length > 3 && (
                                <span className="text-xs text-[#65676E] group-hover:text-white">
                                  +{event.partners.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <button className="w-full bg-brand-blue text-white py-3 mt-auto px-4 font-medium group-hover:bg-white group-hover:text-brand-blue transition-colors duration-200">
                        VIEW EVENT
                      </button>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Mobile Carousel Indicators */}
          {isMobile && events.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: events.length }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className='w-full flex justify-center'>
        <Link href="/events" className='w-[65%] lg:w-[15%] mx-auto'>
          <button className="w-full cursor-pointer bg-brand-blue text-white py-3 mt-16 px-4 font-medium hover:bg-white hover:text-brand-blue transition-colors duration-200 border-2 border-brand-blue">
            VIEW ALL EVENTS
          </button>
        </Link>
      </div>
    </section>
  )
}

export default RecentEvents
