import { NextRequest, NextResponse } from 'next/server'
import { PAYSTACK_CONFIG } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, currency = 'GHS', reference, metadata } = body

    // Validate required fields
    if (!email || !amount || !reference) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Paystack payment
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount), // Ensure amount is in kobo
        currency: 'GHS',
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Paystack API error:', data)
      return NextResponse.json(
        { success: false, message: data.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
