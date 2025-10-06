'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useState, useEffect } from 'react'

export type AccessType = 'free' | 'login' | 'premium'

interface UserSubscription {
  _id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  plan: {
    _id: string
    name: string
    slug: string
  }
  currentPeriodEnd: string
}

export function useAccess() {
  const { user, isLoading } = useUser()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)

  // Check if user has active subscription
  const hasActiveSubscription = subscription?.status === 'active' && 
    new Date(subscription.currentPeriodEnd) > new Date()

  // Check access for content
  const checkAccess = (accessType: AccessType): {
    hasAccess: boolean
    requiresLogin: boolean
    requiresSubscription: boolean
    canViewPartial: boolean
  } => {
    switch (accessType) {
      case 'free':
        return {
          hasAccess: true,
          requiresLogin: false,
          requiresSubscription: false,
          canViewPartial: true
        }
      
      case 'login':
        return {
          hasAccess: !!user,
          requiresLogin: !user,
          requiresSubscription: false,
          canViewPartial: true
        }
      
      case 'premium':
        return {
          hasAccess: !!user && hasActiveSubscription,
          requiresLogin: !user,
          requiresSubscription: !hasActiveSubscription,
          canViewPartial: true
        }
      
      default:
        return {
          hasAccess: false,
          requiresLogin: true,
          requiresSubscription: true,
          canViewPartial: false
        }
    }
  }

  // Fetch user subscription
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null)
      return
    }

    try {
      setSubscriptionLoading(true)
      const response = await fetch('/api/user/subscription')
      const data = await response.json()
      
      if (data.success && data.subscription) {
        setSubscription(data.subscription)
      } else {
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setSubscription(null)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  useEffect(() => {
    if (user && !subscriptionLoading) {
      fetchSubscription()
    } else if (!user) {
      setSubscription(null)
    }
  }, [user])

  return {
    user,
    isLoading,
    subscription,
    subscriptionLoading,
    hasActiveSubscription,
    checkAccess,
    fetchSubscription
  }
}

