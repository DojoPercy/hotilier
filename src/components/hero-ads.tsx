'use client'

import React from 'react'
import { useHeroAds } from '@/hooks/useAds'
import AdSlideshow from './AdSlideshow'

const HeroAds = () => {
  const { ads, loading, error } = useHeroAds()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 bg-[#F4F4F7]">
        <div className="animate-pulse bg-gray-300 w-full max-w-4xl h-48 rounded-lg"></div>
      </div>
    )
  }

  if (error) {
    console.error('Error loading hero ads:', error)
    return null
  }

  if (!ads || ads.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-[#F4F4F7]">
      <AdSlideshow
        ads={ads}
        placementName="hero"
        className="w-full max-w-4xl"
        autoPlay={true}
        interval={30000}
        showIndicators={true}
        showControls={true}
        fadeTransition={true}
      />
    </div>
  )
}

export default HeroAds