'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl, urlFor } from '@/sanity/lib'
import { useSingleHeroBanner, getBannerTitle, getBannerSubtitle, getBannerBackgroundImage, getBannerUrl, getColorClasses, getBackgroundColorClasses } from '@/hooks/useBanners'

const MainHero = () => {
  const { banner, loading, error } = useSingleHeroBanner()
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

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500"></div>
        </div>
      </div>
    )
  }

  if (error || !banner) {
    return null
  }

  const backgroundImage = getBannerBackgroundImage(banner, isMobile)
  const title = getBannerTitle(banner)
  const subtitle = getBannerSubtitle(banner)
  const bannerUrl = getBannerUrl(banner)

  // Position classes
  const positionClasses = {
    'left': 'justify-start',
    'center': 'justify-center',
    'right': 'justify-end'
  }

  // Overlay background classes
  const overlayClasses = {
    'white': 'bg-white',
    'black': 'bg-black',
    'transparent': 'bg-transparent'
  }
const linkBanner = getBannerUrl(banner);
console.log(linkBanner);
  return (
    <div className="relative h-96 md:h-[720px] overflow-hidden mx-[5px] my-5 shadow-lg">
      {/* Background Image */}
      {backgroundImage ? (
        <Image
          src={getImageUrl(backgroundImage, 1920, 1080) as string}
          alt={title}
          unoptimized
          fill
          className="object-cover"
          priority
        />
      ) : null}
        

      

      {/* Content */}
      <div className="relative h-full flex items-center container max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 gap-7 ">
        <div className={`container mx-auto px-4 flex ${positionClasses[banner.position as keyof typeof positionClasses] || 'justify-start'}`}>
          <div className={`max-w-xl p-6 bg-white shadow-lg my-1`}>
            {/* Category/Subtitle */}
            {banner.showCategory && subtitle && (
              <div className={`text-sm lg:text-xl font-bold uppercase tracking-wide mb-2 text-brand-blue`}>
                {subtitle}
              </div>
            )}

            {/* Title */}
            <h1 className={`text-2xl py-2 md:text-4xl font-bold mb-4 leading-tight ${getColorClasses(banner.textColor)}`}>
              {title}
            </h1>

            {/* CTA Button */}
            <Link href={linkBanner}>
              <button className={`px-10 mt-6 py-4  font-medium transition-colors duration-200 bg-brand-blue text-white hover:opacity-90`}>
                {banner.ctaText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainHero