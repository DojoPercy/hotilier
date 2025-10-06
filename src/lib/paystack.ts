// Paystack configuration for Ghana
export const PAYSTACK_CONFIG = {
  // Test keys (replace with your actual keys)
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here',
  secretKey: process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY || 'sk_test_your_secret_key_here',
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || 'your_webhook_secret_here',
  
  // Currency settings for Ghana
  currency: 'GHS', // Ghanaian Cedi
  country: 'GH', // Ghana country code
  
  // Subscription plans (in GHS)
  plans: {
    monthly: {
      name: 'Monthly Access',
      amount: 2500, // 25.00 GHS in kobo
      interval: 'monthly',
      plan_code: 'monthly_plan_code' // Replace with actual plan code from Paystack dashboard
    },
    annual: {
      name: 'Annual Access', 
      amount: 25000, // 250.00 GHS in kobo
      interval: 'annually',
      plan_code: 'annual_plan_code' // Replace with actual plan code from Paystack dashboard
    }
  }
}

// Helper function to convert GHS to kobo
export function ghsToKobo(amount: number): number {
  return Math.round(amount * 100)
}

// Helper function to convert kobo to GHS
export function koboToGhs(amount: number): number {
  return amount / 100
}

// Paystack API endpoints
export const PAYSTACK_ENDPOINTS = {
  base: 'https://api.paystack.co',
  initialize: '/transaction/initialize',
  verify: '/transaction/verify',
  subscription: '/subscription',
  plan: '/plan',
  customer: '/customer'
}
