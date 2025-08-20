import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib'
import { getAllEvents, getUpcomingEvents } from '@/sanity/lib/queries'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  type: string
  start: string
  end?: string
  location?: string
  region?: {
    _id: string
    title: string
    slug: string
  }
  partners?: Array<{
    _id: string
    name: string
    logo?: any
    website?: string
  }>
  description?: any
  hero?: {
    image?: any
    caption?: string
    credit?: string
  }
  registrationUrl?: string
}

export function useRecentEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const allEvents = await client.fetch(getAllEvents)
        // Get upcoming events and sort by start date
        const upcomingEvents = allEvents
          .filter((event: Event) => new Date(event.start) > new Date())
          .sort((a: Event, b: Event) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 6) // Limit to 6 events
        setEvents(upcomingEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return { events, loading, error }
}

export function useUpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const upcomingEvents = await client.fetch(getUpcomingEvents)
        setEvents(upcomingEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return { events, loading, error }
}

export function getEventUrl(event: Event): string {
  return `/events/${event.slug.current}`
}

export function getEventType(event: Event): string {
  return event.type || 'Event'
}

export function getEventLocation(event: Event): string {
  if (event.location && event.region?.title) {
    return `${event.location}, ${event.region.title}`
  }
  return event.location || event.region?.title || 'Location TBD'
}

export function formatEventDate(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  
  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  if (!end || start.toDateString() === end.toDateString()) {
    return startFormatted
  }

  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return `${startFormatted} - ${endFormatted}`
}

export function formatEventTime(startDate: string, endDate?: string): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  if (!end) {
    return startTime
  }

  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${startTime} - ${endTime}`
}

export function isEventUpcoming(event: Event): boolean {
  return new Date(event.start) > new Date()
}

export function isEventToday(event: Event): boolean {
  const today = new Date()
  const eventDate = new Date(event.start)
  return today.toDateString() === eventDate.toDateString()
}

export function getDaysUntilEvent(event: Event): number {
  const today = new Date()
  const eventDate = new Date(event.start)
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
