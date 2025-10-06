import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib/client'
import { getPremiumContent } from '@/sanity/lib/queries'

interface PremiumContent {
  _id: string
  _type: 'article' | 'interview'
  title: string
  slug: { current: string }
  dek?: string
  publishedAt?: string
  accessType: 'login' | 'premium'
  hero?: {
    image?: any
    caption?: string
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
}

export function usePremiumContent(maxItems: number = 6) {
  const [content, setContent] = useState<PremiumContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await client.fetch(getPremiumContent)
        setContent(data.slice(0, maxItems))
      } catch (err) {
        console.error('Error fetching premium content:', err)
        setError('Failed to load premium content')
      } finally {
        setLoading(false)
      }
    }

    fetchPremiumContent()
  }, [maxItems])

  return {
    content,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      client.fetch(getPremiumContent)
        .then(data => {
          setContent(data.slice(0, maxItems))
          setLoading(false)
        })
        .catch(err => {
          console.error('Error refetching premium content:', err)
          setError('Failed to load premium content')
          setLoading(false)
        })
    }
  }
}
