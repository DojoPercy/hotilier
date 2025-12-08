import { NextRequest, NextResponse } from 'next/server'
import { paystackAPI } from '@/lib/paystack-api'
import { sanitySubscriptionService } from '@/lib/sanity-subscription'

// POST - Create Paystack plans and sync with Sanity
export async function POST(request: NextRequest) {
  try {
    // This should be protected with admin authentication in production
    const plans = [
      {
        name: 'Monthly Access',
        interval: 'monthly' as const,
        amount: 2500, // 25.00 GHS in kobo
        currency: 'GHS',
        description: 'Perfect for trying out our premium content'
      },
      {
        name: 'Annual Access',
        interval: 'annually' as const,
        amount: 25000, // 250.00 GHS in kobo
        currency: 'GHS',
        description: 'Best value for committed readers'
      }
    ]

    const createdPlans = []

    for (const plan of plans) {
      try {
        // Create plan in Paystack
        const paystackPlan = await paystackAPI.createPlan(plan)
        
        // Create corresponding plan in Sanity
        const sanityPlan = await sanitySubscriptionService.createSubscriptionPlans()
        
        createdPlans.push({
          paystack: paystackPlan.data,
          sanity: sanityPlan
        })
        
        console.log(`Created plan: ${plan.name}`)
      } catch (error) {
        console.error(`Error creating plan ${plan.name}:`, error)
        // Continue with other plans even if one fails
      }
    }

    return NextResponse.json({ 
      message: 'Plans created successfully',
      plans: createdPlans 
    })
  } catch (error) {
    console.error('Error creating plans:', error)
    return NextResponse.json({ error: 'Failed to create plans' }, { status: 500 })
  }
}

// GET - List all Paystack plans
export async function GET() {
  try {
    const plans = await paystackAPI.getPlans()
    return NextResponse.json({ plans: plans.data })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}
