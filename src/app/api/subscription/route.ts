import { NextRequest, NextResponse } from 'next/server'
import { sanitySubscriptionService } from '@/lib/sanity-subscription'
import { auth0 } from '@/lib/auth0'


// GET - Get user subscription details
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await sanitySubscriptionService.getSubscriptionDetails(session.user.email)
    
    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}

// POST - Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      paystackSubscriptionId, 
      paystackCustomerId, 
      paystackCustomerCode, 
      planCode, 
      status,
      currentPeriodStart,
      currentPeriodEnd,
      canceledAt 
    } = body

    const subscription = await sanitySubscriptionService.createUserSubscription({
      userEmail: session.user.email,
      paystackSubscriptionId,
      paystackCustomerId,
      paystackCustomerCode,
      planCode,
      status,
      currentPeriodStart,
      currentPeriodEnd,
      canceledAt
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}

// PUT - Update subscription status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, subscriptionId } = body

    let result

    switch (action) {
      case 'cancel':
        result = await sanitySubscriptionService.cancelSubscription(session.user.email)
        break
      case 'reactivate':
        result = await sanitySubscriptionService.reactivateSubscription(session.user.email)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}
