'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { 
  CreditCardIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  ArrowRightIcon,
  StarIcon,
  CrownIcon
} from 'lucide-react'
import Link from 'next/link'

interface SubscriptionData {
  _id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  plan: {
    name: string
    price: number
    currency: string
    interval: string
  }
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt?: string
}

export default function SubscriptionTab() {
  const { user } = useUser()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription')
      const data = await response.json()
      
      if (data.subscription) {
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setError('Failed to fetch subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })
      
      if (response.ok) {
        await fetchSubscription() // Refresh data
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' })
      })
      
      if (response.ok) {
        await fetchSubscription() // Refresh data
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-green text-white'
      case 'canceled':
        return 'bg-gray-500 text-white'
      case 'past_due':
        return 'bg-yellow-500 text-white'
      case 'unpaid':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'canceled':
        return <AlertCircleIcon className="w-4 h-4" />
      case 'past_due':
        return <AlertCircleIcon className="w-4 h-4" />
      case 'unpaid':
        return <AlertCircleIcon className="w-4 h-4" />
      default:
        return <AlertCircleIcon className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 poppins-bold mb-2">Subscription</h3>
        <p className="text-gray-600">Manage your subscription and billing information</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-red-900 mb-2">Error Loading Subscription</h4>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchSubscription}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : subscription ? (
        <div className="space-y-6">
          {/* Current Subscription Card */}
          <div className="bg-gradient-to-r from-brand-blue to-vibrant-blue rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <CrownIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">{subscription.plan.name}</h4>
                  <p className="text-white/80">Premium Access</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(subscription.status)}`}>
                {getStatusIcon(subscription.status)}
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Price</p>
                <p className="text-2xl font-bold">
                  ₵{subscription.plan.price / 100}
                  <span className="text-lg font-normal">/{subscription.plan.interval}</span>
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Next Billing</p>
                <p className="text-lg font-semibold">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h5>
            <div className="flex flex-col sm:flex-row gap-4">
              {subscription.status === 'active' ? (
                <button
                  onClick={handleCancelSubscription}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
                >
                  <AlertCircleIcon className="w-4 h-4" />
                  Cancel Subscription
                </button>
              ) : subscription.status === 'canceled' ? (
                <button
                  onClick={handleReactivateSubscription}
                  className="inline-flex items-center gap-2 bg-emerald-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-green/90 transition-colors duration-200"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Reactivate Subscription
                </button>
              ) : null}
              
              <Link
                href="/about/annual_subcription"
                className="inline-flex items-center gap-2 border border-brand-blue text-brand-blue px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors duration-200"
              >
                <StarIcon className="w-4 h-4" />
                Change Plan
              </Link>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Monthly Subscription</p>
                    <p className="text-sm text-gray-600">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₵{subscription.plan.price / 100}</p>
                  <p className="text-sm text-emerald-green">Paid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h4>
          <p className="text-gray-600 mb-6">
            Subscribe to get unlimited access to premium content, exclusive interviews, and industry insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-vibrant-blue transition-colors duration-200"
            >
              <StarIcon className="w-5 h-5" />
              Subscribe Now
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/about/annual_subcription"
              className="inline-flex items-center gap-2 border border-brand-blue text-brand-blue px-8 py-4 rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors duration-200"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
