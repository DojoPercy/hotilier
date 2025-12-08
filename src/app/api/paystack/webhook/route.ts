import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sanitySubscriptionService } from '@/lib/sanity-subscription'
import { paystackAPI } from '@/lib/paystack-api'

// Paystack webhook secret from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature || !PAYSTACK_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Paystack webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'subscription.create':
        await handleSubscriptionCreate(event.data)
        break

      case 'subscription.disable':
        await handleSubscriptionDisable(event.data)
        break

      case 'invoice.create':
        await handleInvoiceCreate(event.data)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data)
        break

      case 'invoice.payment_successful':
        await handleInvoicePaymentSuccessful(event.data)
        break

      case 'charge.success':
        await handleChargeSuccess(event.data)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle subscription creation
async function handleSubscriptionCreate(data: any) {
  console.log('Subscription created:', data)
  
  try {
    // Get subscription details from Paystack
    const subscriptionDetails = await paystackAPI.getSubscription(data.subscription_code)
    
    // Create user subscription in Sanity
    await sanitySubscriptionService.createUserSubscription({
      userEmail: data.customer.email,
      paystackSubscriptionId: data.subscription_code,
      paystackCustomerId: data.customer.id.toString(),
      paystackCustomerCode: data.customer.customer_code,
      planCode: data.plan.plan_code,
      status: 'active',
      currentPeriodStart: subscriptionDetails.data.next_payment_date,
      currentPeriodEnd: subscriptionDetails.data.next_payment_date,
    })
    
    console.log('Subscription created successfully for:', data.customer.email)
  } catch (error) {
    console.error('Error handling subscription creation:', error)
  }
}

// Handle subscription disable
async function handleSubscriptionDisable(data: any) {
  console.log('Subscription disabled:', data)
  
  try {
    // Update subscription status in Sanity
    const subscription = await sanitySubscriptionService.getUserSubscription(data.customer.email)
    
    if (subscription) {
      await sanitySubscriptionService.updateSubscriptionStatus(
        subscription._id,
        'canceled',
        { canceledAt: new Date().toISOString() }
      )
    }
    
    console.log('Subscription disabled for:', data.customer.email)
  } catch (error) {
    console.error('Error handling subscription disable:', error)
  }
}

// Handle invoice creation
async function handleInvoiceCreate(data: any) {
  console.log('Invoice created:', data)
  
  // You might want to send a payment reminder email here
  // or update your database with the invoice details
}

// Handle invoice payment failure
async function handleInvoicePaymentFailed(data: any) {
  console.log('Invoice payment failed:', data)
  
  try {
    // Update subscription status to past_due
    const subscription = await sanitySubscriptionService.getUserSubscription(data.customer.email)
    
    if (subscription) {
      await sanitySubscriptionService.updateSubscriptionStatus(
        subscription._id,
        'past_due'
      )
    }
    
    console.log('Payment failed for subscription:', data.subscription.subscription_code)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSuccessful(data: any) {
  console.log('Invoice payment successful:', data)
  
  try {
    // Update subscription status to active
    const subscription = await sanitySubscriptionService.getUserSubscription(data.customer.email)
    
    if (subscription) {
      await sanitySubscriptionService.updateSubscriptionStatus(
        subscription._id,
        'active',
        {
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: data.subscription.next_payment_date
        }
      )
    }
    
    console.log('Payment successful for subscription:', data.subscription.subscription_code)
  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

// Handle successful charge (one-time payments)
async function handleChargeSuccess(data: any) {
  console.log('Charge successful:', data)
  
  try {
    // For one-time payments, you might want to:
    // 1. Create a subscription record
    // 2. Grant access to premium content
    // 3. Send confirmation email
    
    console.log('One-time payment successful for:', data.customer.email)
  } catch (error) {
    console.error('Error handling charge success:', error)
  }
}
