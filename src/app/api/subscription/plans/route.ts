import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(request: NextRequest) {
  try {
    // Fetch active subscription plans
    const plans = await client.fetch(`
      *[_type == "subscriptionPlan" && isActive == true] | order(price asc) {
        _id,
        name,
        slug,
        description,
        price,
        currency,
        interval,
        features,
        isActive,
        isPopular,
        stripePriceId
      }
    `)

    return NextResponse.json({
      success: true,
      plans
    })

  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscription plans' 
      },
      { status: 500 }
    )
  }
}

