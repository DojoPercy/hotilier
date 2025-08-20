'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getImageUrl } from '@/sanity/lib'

interface Ad {
  _id: string
  title: string
  adType: string
  targetUrl: string
  desktopImage: any
  mobileImage: any
  altText: string
  trackingCode?: string
  client?: string
  campaign?: string
}

interface AdSlideshowProps {
  ads: Ad[]
  placementName?: string
  className?: string
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showControls?: boolean
  fadeTransition?: boolean
}

// Custom hook to detect viewport size
function useViewport() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkViewport()

    // Add event listener
    window.addEventListener('resize', checkViewport)

    // Cleanup
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  return { isMobile }
}

export default function AdSlideshow({
  ads,
  placementName = 'default',
  className = '',
  autoPlay = true,
  interval = 5000,
  showIndicators = false,
  showControls = false,
  fadeTransition = true
}: AdSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { isMobile } = useViewport()

  // Intersection Observer for visibility
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`ad-slideshow-${placementName}`)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [placementName])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isVisible || ads.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, ads.length, isVisible])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
  }, [ads.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ads.length)
  }, [ads.length])

  const handleAdClick = useCallback((ad: Ad) => {
    if (ad.trackingCode) {
      console.log('Ad clicked:', ad.title, 'Tracking:', ad.trackingCode)
    }
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
    }
  }, [])

  if (!ads || ads.length === 0) return null

  // Single ad mode
  if (ads.length === 1) {
    const ad = ads[0]
    const desktopUrl = ad.desktopImage ? getImageUrl(ad.desktopImage, 1200, 300) : ''
    const mobileUrl = ad.mobileImage ? getImageUrl(ad.mobileImage, 400, 200) : ''
    const imageUrl = isMobile && mobileUrl ? mobileUrl : desktopUrl

    if (!imageUrl) return null

    return (
      <div id={`ad-slideshow-${placementName}`} className={`relative overflow-hidden ${className}`}>
        <div
          className="cursor-pointer transition-transform duration-300"
          onClick={() => handleAdClick(ad)}
        >
          <Image
            src={imageUrl}
            alt={ad.altText || 'Advertisement'}
            width={isMobile ? 400 : 1200}
            height={isMobile ? 200 : 300}
            unoptimized
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    )
  }

  // Slideshow mode
  return (
    <div
      id={`ad-slideshow-${placementName}`}
      className={`relative overflow-hidden ${className} h-[200px] lg:h-[250px]`}
    >
      {/* Slides */}
      <div className="relative h-full">
        {ads.map((ad, index) => {
          const desktopUrl = ad.desktopImage ? getImageUrl(ad.desktopImage, 900, 300) : ''
          const mobileUrl = ad.mobileImage ? getImageUrl(ad.mobileImage, 400, 200) : ''
          const imageUrl = isMobile && mobileUrl ? mobileUrl : desktopUrl
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
                className="cursor-pointer transition-transform duration-300 h-full flex items-center justify-center"
                onClick={() => handleAdClick(ad)}
              >
                <Image
                  src={imageUrl}
                  alt={ad.altText || 'Advertisement'}
                  width={isMobile ? 400 : 900}
                  height={isMobile ? 200 : 300}
                  unoptimized
                  className="w-full h-auto max-h-full object-contain"
                  priority={isActive}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls
      {showControls && ads.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-70 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-70 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {/* {showIndicators && ads.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}  */}

      {/* Ad Label */}
      {ads[currentIndex]?.client && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
          Ad
        </div>
      )}
    </div>
  )
}
