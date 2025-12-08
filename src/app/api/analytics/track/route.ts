import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { z } from 'zod'

// Simple validation schema for analytics events
const analyticsEventSchema = z.object({
  eventType: z.enum(['page_view', 'article_view']),
  contentId: z.string().optional(),
  contentType: z.enum(['article', 'page']).optional(),
  pageTitle: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = analyticsEventSchema.parse(body)
    
    // Create simple analytics event document
    const eventData = {
      _type: 'analyticsEvent',
      eventType: validatedData.eventType,
      contentId: validatedData.contentId,
      contentType: validatedData.contentType,
      timestamp: new Date().toISOString(),
      pageTitle: validatedData.pageTitle
    }
    
    // Save to Sanity
    const result = await writeClient.create(eventData)
    
    return NextResponse.json({ 
      success: true, 
      eventId: result._id 
    })
    
  } catch (error) {
    console.error('Analytics tracking error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track analytics event' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve analytics data (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')
    const eventType = searchParams.get('eventType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Build query filters
    let filters = ['_type == "analyticsEvent"']
    
    if (contentId) {
      filters.push(`contentId == "${contentId}"`)
    }
    
    if (contentType) {
      filters.push(`contentType == "${contentType}"`)
    }
    
    if (eventType) {
      filters.push(`eventType == "${eventType}"`)
    }
    
    if (startDate) {
      filters.push(`timestamp >= "${startDate}"`)
    }
    
    if (endDate) {
      filters.push(`timestamp <= "${endDate}"`)
    }
    
    const query = `*[${filters.join(' && ')}] | order(timestamp desc) [0...${limit}] {
      _id,
      eventType,
      contentId,
      contentType,
      timestamp,
      pageTitle
    }`
    
    const events = await writeClient.fetch(query)
    
    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    })
    
  } catch (error) {
    console.error('Analytics retrieval error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve analytics data' 
      },
      { status: 500 }
    )
  }
}