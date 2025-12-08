import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { auth0 } from '@/lib/auth0'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Find user subscription
    const subscription = await client.fetch(`
      *[_type == "userSubscription" && user._ref == *[_type == "user" && auth0Sub == "${session.user.sub}"][0]._id && status == "active"][0] {
        _id,
        status,
        currentPeriodStart,
        currentPeriodEnd,
        plan-> {
          _id,
          name,
          slug,
          price,
          currency,
          interval
        }
      }
    `)

    return NextResponse.json({
      success: true,
      subscription: subscription || null
    })

  } catch (error) {
    console.error('Error fetching user subscription:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscription' 
      },
      { status: 500 }
    )
  }
}
