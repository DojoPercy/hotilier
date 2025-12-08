import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

// GET endpoint to retrieve content performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build base filters
    let filters = ['_type == "analyticsEvent"']
    
    if (contentId) {
      filters.push(`contentId == "${contentId}"`)
    }
    
    if (contentType) {
      filters.push(`contentType == "${contentType}"`)
    }
    
    if (startDate) {
      filters.push(`timestamp >= "${startDate}"`)
    }
    
    if (endDate) {
      filters.push(`timestamp <= "${endDate}"`)
    }
    
    const baseQuery = `*[${filters.join(' && ')}]`
    
    // Get all events for the specified filters
    const events = await writeClient.fetch(`${baseQuery} {
      _id,
      eventType,
      contentId,
      contentType,
      timestamp,
      pageTitle
    }`)
    
    // Simple aggregation - just count views
    const views = events.length
    
    return NextResponse.json({ 
      success: true, 
      data: {
        views,
        events
      }
    })
    
  } catch (error) {
    console.error('Analytics performance error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve performance data' 
      },
      { status: 500 }
    )
  }
}