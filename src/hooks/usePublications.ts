import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getAllPublications } from '@/sanity/lib/queries'

interface Publication {
  _id: string
  _type: string
  title: string
  slug: {
    current: string
  }
  hero?: {
    image?: any
    caption?: string
    credit?: string
  }
  year?: number
  regions?: Array<{
    _id: string
    title: string
    slug: string
  }>
  sectors?: Array<{
    _id: string
    title: string
    slug: string
    icon?: any
  }>
  toc?: Array<{
    _id: string
    _type: string
    title: string
    slug: string
    dek?: string
  }>
  pdf?: any
  seo?: {
    title?: string
    description?: string
    ogImage?: any
    noindex?: boolean
  }
}

export function useLatestPublications() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true)
        const allPublications = await client.fetch(getAllPublications)
        // Get latest publications (most recent year first)
        const latestPublications = allPublications
          .sort((a: Publication, b: Publication) => (b.year || 0) - (a.year || 0))
          .slice(0, 8) // Limit to 3 publications
        setPublications(latestPublications)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publications')
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  return { publications, loading, error }
}

export function useAllPublications() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true)
        const allPublications = await client.fetch(getAllPublications)
        setPublications(allPublications)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publications')
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  return { publications, loading, error }
}

// Utility function to get the publication URL
export function getPublicationUrl(publication: Publication): string {
  return `/publications/${publication.slug.current}`
}

// Utility function to get the primary region
export function getPrimaryRegion(publication: Publication): string {
  if (publication.regions && publication.regions.length > 0) {
    return publication.regions[0].title.toUpperCase()
  }
  return ''
}

// Utility function to get the primary sector
export function getPrimarySector(publication: Publication): string {
  if (publication.sectors && publication.sectors.length > 0) {
    return publication.sectors[0].title.toUpperCase()
  }
  return ''
}

// Utility function to get unique years from publications
export function getUniqueYears(publications: Publication[]): number[] {
  const years = Array.from(
    new Set(
      publications
        .map(publication => publication.year)
        .filter((year): year is number => typeof year === 'number')
    )
  ).sort((a, b) => b - a)
  
  return years
}

// Utility function to get PDF URL
export function getPdfUrl(publication: Publication): string | null {
  if (publication.pdf?.asset?.url) {
    return publication.pdf.asset.url
  }
  return null
}

// Utility function to get table of contents count
export function getTocCount(publication: Publication): number {
  return publication.toc?.length || 0
}
