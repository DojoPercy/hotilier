'use client'

import React, { useState, useEffect } from 'react'
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface SubscriptionPlan {
  _id: string
  name: string
  slug: string
  description?: string
  price: number
  currency: string
  interval: string
  features: string[]
  isActive: boolean
  isPopular: boolean
  stripePriceId?: string
}

interface SubscriptionPlansProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void
  className?: string
}

export function SubscriptionPlans({ onSelectPlan, className = '' }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/plans')
      const data = await response.json()
      
      if (data.success) {
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string, interval: string) => {
    const formattedPrice = (price / 100).toFixed(2)
    const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : '£'
    
    if (interval === 'one_time') {
      return `${currencySymbol}${formattedPrice}`
    }
    
    return `${currencySymbol}${formattedPrice}/${interval === 'year' ? 'year' : 'month'}`
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (onSelectPlan) {
      onSelectPlan(plan)
    } else {
      // Default action - redirect to checkout
      window.location.href = `/subscribe/checkout?plan=${plan.slug}`
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          This article is only available to subscribers
        </h2>
        <p className="text-xl text-gray-600">
          Subscribe now for unlimited access
        </p>
      </div>

      {/* Subscription Plans Section */}
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide">
            Step 1. Select Your Plan
          </h3>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>

        {/* Plan Options */}
        <div className="space-y-4 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                plan.isPopular 
                  ? 'border-2 border-brand-blue bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 border-2 rounded-full ${
                  plan.isPopular 
                    ? 'border-brand-blue bg-brand-blue relative' 
                    : 'border-gray-300'
                }`}>
                  {plan.isPopular && (
                    <div className="absolute inset-0.5 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    All access - {plan.interval === 'year' ? 'Annual' : 'Monthly'}
                  </h4>
                  <p className="text-sm text-gray-600">Unlimited access to EnergyNexus.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">See details</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(plan.price, plan.currency, plan.interval)}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* OR Separator */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 uppercase font-medium">OR</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => handleSelectPlan(plans.find(p => p.isPopular) || plans[0])}
            className="bg-brand-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Subscribe Now
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Start your free trial today
          </p>
        </div>
      </div>

      {/* Additional info */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 mb-4">
          All subscriptions include a 7-day free trial. Cancel anytime.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <span>✓ Secure payment processing</span>
          <span>✓ Cancel anytime</span>
          <span>✓ 24/7 customer support</span>
        </div>
      </div>
    </div>
  )
}

