import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getHeroBanners, getBannersByType, getSingleHeroBanner } from '@/sanity/lib/banner-queries'

interface Banner {
  _id: string
  title: string
  isActive: boolean
  priority: number
  bannerType: string
  customTitle?: string
  customSubtitle?: string
  ctaText: string
  backgroundImage?: any
  backgroundImageMobile?: any
  overlayColor: string
  textColor: string
  categoryColor: string
  ctaButtonColor: string
  position: string
  showCategory: boolean
  notes?: string
  selectedArticle: {
    _id: string
    title: string
    slug: string | { current: string }
    dek?: string
    hero?: {
      image?: any
      caption?: string
      credit?: string
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
    publishedAt?: string
    authors?: Array<{
      _id: string
      name: string
      headshot?: any
    }>
  }
}


export function useHeroBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const heroBanners = await client.fetch(getHeroBanners)
        setBanners(heroBanners)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banners')
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  return { banners, loading, error }
}

export function useSingleHeroBanner() {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true)
        const heroBanner = await client.fetch(getSingleHeroBanner)
        setBanner(heroBanner)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banner')
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [])

  return { banner, loading, error }
}

export function useBannersByType(bannerType: string) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const typeBanners = await client.fetch(getBannersByType, { bannerType })
        setBanners(typeBanners)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch banners')
      } finally {
        setLoading(false)
      }
    }

    if (bannerType) {
      fetchBanners()
    }
  }, [bannerType])

  return { banners, loading, error }
}

// Utility function to get the display title for a banner
export function getBannerTitle(banner: Banner): string {
  return banner.customTitle || banner.selectedArticle.title
}

// Utility function to get the display subtitle/category for a banner
export function getBannerSubtitle(banner: Banner): string {
  if (banner.customSubtitle) {
    return banner.customSubtitle
  }
  
  // Try to get from article sectors
  if (banner.selectedArticle.sectors && banner.selectedArticle.sectors.length > 0) {
    return banner.selectedArticle.sectors[0].title.toUpperCase()
  }
  
  return ''
}

// Utility function to get the background image for a banner
export function getBannerBackgroundImage(banner: Banner, isMobile: boolean = false): any {
  if (isMobile && banner.backgroundImageMobile) {
    return banner.backgroundImageMobile
  }
  
  if (banner.backgroundImage) {
    return banner.backgroundImage
  }
  
  // Fallback to article hero image
  return banner.selectedArticle.hero?.image
}

// Utility function to get the banner URL
export function getBannerUrl(banner: Banner): string {
  let slugString = ''

  if (typeof banner.selectedArticle.slug === 'string') {
    slugString = banner.selectedArticle.slug
  } else if (
    banner.selectedArticle.slug &&
    typeof banner.selectedArticle.slug.current === 'string'
  ) {
    slugString = banner.selectedArticle.slug.current
  }

  console.log('Slug:', slugString)
  return `/articles/${slugString}`
}


// Utility function to get color classes based on color selection
export function getColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    'red': 'text-red-600',
    'blue': 'text-blue-600',
    'green': 'text-green-600',
    'orange': 'text-orange-600',
    'black': 'text-black',
    'white': 'text-white'
  }
  
  return colorMap[color] || 'text-black'
}

// Utility function to get background color classes
export function getBackgroundColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    'red': 'bg-red-600',
    'blue': 'bg-blue-600',
    'green': 'bg-green-600',
    'orange': 'bg-orange-600',
    'black': 'bg-black',
    'white': 'bg-white'
  }
  
  return colorMap[color] || 'bg-white'
}
