import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getTop7LatestArticles, getFeaturedArticles } from '@/sanity/lib/queries'

interface Article {
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
  authors?: Array<{
    _id: string
    name: string
    headshot?: any
  }>
  tags?: Array<{
    _id: string
    title: string
    slug: string
  }>
}

export function useLatestArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const latestArticles = await client.fetch(getTop7LatestArticles)
        setArticles(latestArticles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return { articles, loading, error }
}

export function useFeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const featuredArticles = await client.fetch(getFeaturedArticles)
        setArticles(featuredArticles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return { articles, loading, error }
}

// Utility function to get the article URL
export function getArticleUrl(article: Article): string {
  return `/articles/${article.slug.current}`
}

// Utility function to get the primary sector/category
export function getPrimarySector(article: Article): string {
  if (article.sectors && article.sectors.length > 0) {
    return article.sectors[0].title.toUpperCase()
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

// Utility function to get reading time
export function getReadingTime(text: string): number {
  if (!text) return 0
  const wordsPerMinute = 200
  const words = text.split(' ').length
  return Math.ceil(words / wordsPerMinute)
}
