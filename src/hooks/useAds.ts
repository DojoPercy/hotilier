import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getHeroAds, getAdsByType, getAdsForPlacement, getSidebarAds } from '@/sanity/lib/ads-queries'

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
  priority: number
  isActive: boolean
}

interface AdPlacement {
  _id: string
  name: string
  location: string
  adType: string
  displaySettings: {
    showOnDesktop: boolean
    showOnMobile: boolean
    showOnTablet: boolean
    maxAdsToShow: number
    rotationInterval: number
    fadeTransition: boolean
  }
  ads: Ad[]
}

export function useHeroAds() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const heroAds = await client.fetch(getHeroAds)
        setAds(heroAds)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ads')
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  return { ads, loading, error }
}

export function useSidebarAds() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const sidebarAds = await client.fetch(getSidebarAds)
        setAds(sidebarAds)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sidebar ads')
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  return { ads, loading, error }
}

export function useAdsByType(adType: string) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        const typeAds = await client.fetch(getAdsByType, { adType })
        setAds(typeAds)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ads')
      } finally {
        setLoading(false)
      }
    }

    if (adType) {
      fetchAds()
    }
  }, [adType])

  return { ads, loading, error }
}

export function useAdPlacement(placementName: string) {
  const [placement, setPlacement] = useState<AdPlacement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        setLoading(true)
        const adPlacement = await client.fetch(getAdsForPlacement, { placementName })
        setPlacement(adPlacement)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ad placement')
      } finally {
        setLoading(false)
      }
    }

    if (placementName) {
      fetchPlacement()
    }
  }, [placementName])

  return { placement, loading, error }
}

// Utility function to filter ads by device type
export function filterAdsByDevice(ads: Ad[], deviceType: 'desktop' | 'mobile' | 'tablet'): Ad[] {
  return ads.filter(ad => {
    // If no targeting or no device types specified, show on all devices
    const targeting = (ad as any).targeting;
    if (!targeting || !targeting.deviceTypes || targeting.deviceTypes.length === 0) {
      return true
    }
    // Check if device type is in targeting
    return targeting.deviceTypes.includes(deviceType)
  })
}

// Utility function to filter ads by user type
export function filterAdsByUser(ads: Ad[], userType: 'guest' | 'subscriber' | 'premium'): Ad[] {
  return ads.filter(ad => {
    const targeting = (ad as any).targeting;
    // If no targeting or no user types specified, show to all users
    if (!targeting || !targeting.userTypes || targeting.userTypes.length === 0) {
      return true
    }
    // Check if user type is in targeting
    return targeting.userTypes.includes(userType)
  })
}

// Utility function to check if ad is currently active based on date
export function isAdActive(ad: Ad): boolean {
  if (!ad.isActive) return false

  const now = new Date();
  const targeting = (ad as any).targeting || {};
  const startDate = targeting.startDate ? new Date(targeting.startDate) : null;
  const endDate = targeting.endDate ? new Date(targeting.endDate) : null;

  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  
  return true
}

// Utility function to sort ads by priority
export function sortAdsByPriority(ads: Ad[]): Ad[] {
  return [...ads].sort((a, b) => b.priority - a.priority)
}
