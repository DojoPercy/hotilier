'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSidebarAds } from '@/hooks/useAds'
import { getImageUrl } from '@/sanity/lib/image'

interface SidebarAdProps {
  className?: string
  maxAds?: number
  showAdLabel?: boolean
  showControls?: boolean
  showIndicators?: boolean
  autoRotate?: boolean
  rotationInterval?: number
}

export default function SidebarAd({
  className = '',
  maxAds = 3,
  showAdLabel = true,
  showControls = false,
  showIndicators = false,
  autoRotate = true,
  rotationInterval = 5000
}: SidebarAdProps) {
  const { ads, loading, error } = useSidebarAds()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Filter and limit ads
  const filteredAds = ads
    .filter(ad => ad.isActive)
    .slice(0, maxAds)

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('sidebar-ad')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  // Auto-rotate ads
  useEffect(() => {
    if (!autoRotate || !isVisible || filteredAds.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= filteredAds.length - 1 ? 0 : prevIndex + 1
      )
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isVisible, filteredAds.length, rotationInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? filteredAds.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= filteredAds.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleAdClick = (ad: any) => {
    if (ad.targetUrl) {
      // Track click if tracking code exists
      if (ad.trackingCode) {
        // Implement tracking logic here
        console.log('Ad clicked:', ad.trackingCode)
      }
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div id="sidebar-ad" className={`bg-gray-100  p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error || filteredAds.length === 0) {
    return null
  }

  // Single ad mode
  if (filteredAds.length === 1) {
    const ad = filteredAds[0]
    const imageUrl = ad.desktopImage ? getImageUrl(ad.desktopImage, 300, 400) : ''

    if (!imageUrl) return null

    return (
      <div id="sidebar-ad" className={`bg-white  overflow-hidden shadow-sm ${className}`}>
        <div
          className="cursor-pointer transition-transform duration-300 "
          onClick={() => handleAdClick(ad)}
        >
          <Image
            src={imageUrl}
            alt={ad.altText || 'Advertisement'}
            width={300}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
        {showAdLabel && ad.client && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
            Ad
          </div>
        )}
      </div>
    )
  }

  // Multiple ads mode
  return (
    <div id="sidebar-ad" className={`bg-white  overflow-hidden shadow-sm relative ${className}`}>
      <div className="relative">
        {filteredAds.map((ad, index) => {
          const imageUrl = ad.desktopImage ? getImageUrl(ad.desktopImage, 300, 400) : ''
          const isActive = index === currentIndex

          if (!imageUrl) return null

          return (
            <div
              key={ad._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div
                className="cursor-pointer transition-transform duration-300  h-full"
                onClick={() => handleAdClick(ad)}
              >
                <Image
                  src={imageUrl}
                  alt={ad.altText || 'Advertisement'}
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                  unoptimized
                  priority={isActive}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      {showControls && filteredAds.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-20"
            aria-label="Previous ad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-20"
            aria-label="Next ad"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && filteredAds.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
          {filteredAds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Ad Label */}
      {showAdLabel && filteredAds[currentIndex]?.client && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
          Ad
        </div>
      )}
    </div>
  )
}
