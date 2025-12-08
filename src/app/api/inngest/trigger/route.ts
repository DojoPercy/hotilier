import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/inngest/client'
import { auth0 } from '@/lib/auth0'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { event, data } = await request.json()

    // Validate event name
    const validEvents = [
      'realtime-content-processing',
      'batch-content-processing',
      'content-quality-assessment',
      'user-content-interaction',
      'personalized-recommendations'
    ]

    if (!validEvents.includes(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    // Add user context to the event data
    const eventData = {
      ...data,
      userId: session.user.sub,
      userEmail: session.user.email,
      timestamp: new Date().toISOString()
    }

    // Send event to Inngest
    const result = await inngest.send({
      name: event,
      data: eventData
    })

    return NextResponse.json({ 
      success: true, 
      eventId: result.ids[0],
      message: 'Event triggered successfully' 
    })

  } catch (error) {
    console.error('Error triggering Inngest event:', error)
    return NextResponse.json(
      { error: 'Failed to trigger event' }, 
      { status: 500 }
    )
  }
}
