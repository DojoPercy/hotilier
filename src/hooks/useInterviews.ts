import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getAllInterviews } from '@/sanity/lib/queries'

interface Interview {
  _id: string
  _type: string
  title: string
  slug: {
    current: string
  }
  dek?: string
  publishedAt?: string
  updatedAt?: string
  isFeatured: boolean
  paywall: boolean
  hero?: {
    image?: any
    caption?: string
    credit?: string
  }
  authors?: Array<{
    _id: string;
    name: string;
    headshot?: any;
  }>
  interviewee?: {
    _id: string
    name: string
    headshot?: any
    role?: string
    organization?: {
      _id: string
      name: string
      logo?: any
    }
  }
  roleAtTime?: string
  organizationAtTime?: {
    _id: string
    name: string
    logo?: any
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
  tags?: Array<{
    _id: string
    title: string
    slug: string
  }>
  pullQuotes?: string[]
}

export function useFeaturedInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        const allInterviews = await client.fetch(getAllInterviews)
        // Filter for featured interviews and limit to 5
        const featuredInterviews = allInterviews
          .filter((interview: Interview) => interview.isFeatured)
          .slice(0, 5)
        setInterviews(featuredInterviews)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch interviews')
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  return { interviews, loading, error }
}

// Utility function to get the interview URL
export function getInterviewUrl(interview: Interview): string {
  return `/interviews/${interview.slug.current}`
}

// Utility function to get the primary region
export function getPrimaryRegion(interview: Interview): string {
  if (interview.regions && interview.regions.length > 0) {
    return interview.regions[0].title.toUpperCase()
  }
  return ''
}

// Utility function to get the primary sector
export function getPrimarySector(interview: Interview): string {
  if (interview.sectors && interview.sectors.length > 0) {
    return interview.sectors[0].title.toUpperCase()
  }
  return ''
}

// Utility function to format date
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
