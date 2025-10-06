import { client } from '@/sanity/lib/client'
import { paystackAPI } from './paystack-api'

// Sanity subscription management service
export class SanitySubscriptionService {
  
  // Create or update user subscription in Sanity
  async createUserSubscription(subscriptionData: {
    userEmail: string
    paystackSubscriptionId: string
    paystackCustomerId: string
    paystackCustomerCode: string
    planCode: string
    status: 'active' | 'canceled' | 'past_due' | 'unpaid'
    currentPeriodStart: string
    currentPeriodEnd: string
    canceledAt?: string
  }) {
    try {
      // First, find or create the user
      const user = await this.findOrCreateUser(subscriptionData.userEmail)
      
      // Find the subscription plan
      const plan = await this.findSubscriptionPlan(subscriptionData.planCode)
      
      if (!plan) {
        throw new Error(`Subscription plan not found: ${subscriptionData.planCode}`)
      }

      // Check if user already has a subscription
      const existingSubscription = await this.getUserSubscription(subscriptionData.userEmail)
      
      if (existingSubscription) {
        // Update existing subscription
        return await client
          .patch(existingSubscription._id)
          .set({
            plan: { _type: 'reference', _ref: plan._id },
            status: subscriptionData.status,
            paystackSubscriptionId: subscriptionData.paystackSubscriptionId,
            paystackCustomerId: subscriptionData.paystackCustomerId,
            paystackCustomerCode: subscriptionData.paystackCustomerCode,
            currentPeriodStart: subscriptionData.currentPeriodStart,
            currentPeriodEnd: subscriptionData.currentPeriodEnd,
            canceledAt: subscriptionData.canceledAt,
          })
          .commit()
      } else {
        // Create new subscription
        return await client.create({
          _type: 'userSubscription',
          user: { _type: 'reference', _ref: user._id },
          plan: { _type: 'reference', _ref: plan._id },
          status: subscriptionData.status,
          paystackSubscriptionId: subscriptionData.paystackSubscriptionId,
          paystackCustomerId: subscriptionData.paystackCustomerId,
          paystackCustomerCode: subscriptionData.paystackCustomerCode,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          canceledAt: subscriptionData.canceledAt,
          createdAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error creating user subscription:', error)
      throw error
    }
  }

  // Find or create user by email
  async findOrCreateUser(email: string, userData?: { name?: string; auth0Sub?: string }) {
    try {
      // Try to find existing user
      const existingUsers = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email }
      )

      if (existingUsers) {
        return existingUsers
      }

      // Create new user if not found
      return await client.create({
        _type: 'user',
        email,
        name: userData?.name || '',
        authProvider: 'auth0',
        auth0Sub: userData?.auth0Sub || '',
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error finding/creating user:', error)
      throw error
    }
  }

  // Find subscription plan by Paystack plan code
  async findSubscriptionPlan(planCode: string) {
    try {
      return await client.fetch(
        `*[_type == "subscriptionPlan" && paystackPlanCode == $planCode][0]`,
        { planCode }
      )
    } catch (error) {
      console.error('Error finding subscription plan:', error)
      throw error
    }
  }

  // Get user subscription by email
  async getUserSubscription(userEmail: string) {
    try {
      return await client.fetch(
        `*[_type == "userSubscription" && user->email == $email][0]{
          _id,
          _type,
          user->{_id, email, name},
          plan->{_id, name, price, currency, interval},
          status,
          paystackSubscriptionId,
          paystackCustomerId,
          paystackCustomerCode,
          currentPeriodStart,
          currentPeriodEnd,
          canceledAt,
          createdAt
        }`,
        { email: userEmail }
      )
    } catch (error) {
      console.error('Error getting user subscription:', error)
      throw error
    }
  }

  // Update subscription status
  async updateSubscriptionStatus(
    subscriptionId: string, 
    status: 'active' | 'canceled' | 'past_due' | 'unpaid',
    additionalData?: {
      currentPeriodStart?: string
      currentPeriodEnd?: string
      canceledAt?: string
    }
  ) {
    try {
      const updateData: any = { status }
      
      if (additionalData) {
        Object.assign(updateData, additionalData)
      }

      return await client
        .patch(subscriptionId)
        .set(updateData)
        .commit()
    } catch (error) {
      console.error('Error updating subscription status:', error)
      throw error
    }
  }

  // Cancel subscription
  async cancelSubscription(userEmail: string) {
    try {
      const subscription = await this.getUserSubscription(userEmail)
      
      if (!subscription) {
        throw new Error('No active subscription found')
      }

      // Cancel in Paystack
      await paystackAPI.disableSubscription(subscription.paystackSubscriptionId)

      // Update in Sanity
      return await this.updateSubscriptionStatus(
        subscription._id,
        'canceled',
        { canceledAt: new Date().toISOString() }
      )
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Reactivate subscription
  async reactivateSubscription(userEmail: string) {
    try {
      const subscription = await this.getUserSubscription(userEmail)
      
      if (!subscription) {
        throw new Error('No subscription found')
      }

      // Reactivate in Paystack
      await paystackAPI.enableSubscription(subscription.paystackSubscriptionId)

      // Update in Sanity
      return await this.updateSubscriptionStatus(
        subscription._id,
        'active',
        { canceledAt: undefined }
      )
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      throw error
    }
  }

  // Create subscription plans in Sanity (for initial setup)
  async createSubscriptionPlans() {
    try {
      const plans = [
        {
          name: 'Monthly Access',
          slug: { current: 'monthly-access' },
          description: 'Perfect for trying out our premium content',
          price: 2500, // 25.00 GHS in kobo
          currency: 'ghs',
          interval: 'month',
          features: [
            'Unlimited access to all articles',
            'Premium interviews & reports',
            'Exclusive industry insights',
            'Mobile & desktop access',
            'Email support'
          ],
          isActive: true,
          isPopular: false,
          paystackPlanCode: 'monthly_plan_code', // Replace with actual Paystack plan code
        },
        {
          name: 'Annual Access',
          slug: { current: 'annual-access' },
          description: 'Best value for committed readers',
          price: 25000, // 250.00 GHS in kobo
          currency: 'ghs',
          interval: 'year',
          features: [
            'Everything in Monthly',
            'Priority customer support',
            'Early access to new features',
            'Exclusive member events',
            'Download articles for offline reading',
            'Advanced analytics dashboard',
            'Ai Summarizer'
          ],
          isActive: true,
          isPopular: true,
          paystackPlanCode: 'annual_plan_code', // Replace with actual Paystack plan code
        }
      ]

      const createdPlans = []
      for (const plan of plans) {
        const existingPlan = await client.fetch(
          `*[_type == "subscriptionPlan" && slug.current == $slug][0]`,
          { slug: plan.slug.current }
        )

        if (!existingPlan) {
          const createdPlan = await client.create({
            _type: 'subscriptionPlan',
            ...plan,
          })
          createdPlans.push(createdPlan)
        }
      }

      return createdPlans
    } catch (error) {
      console.error('Error creating subscription plans:', error)
      throw error
    }
  }

  // Check if user has active subscription
  async hasActiveSubscription(userEmail: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userEmail)
      return subscription && subscription.status === 'active'
    } catch (error) {
      console.error('Error checking active subscription:', error)
      return false
    }
  }

  // Get subscription details for user
  async getSubscriptionDetails(userEmail: string) {
    try {
      return await this.getUserSubscription(userEmail)
    } catch (error) {
      console.error('Error getting subscription details:', error)
      throw error
    }
  }
}

// Singleton instance
export const sanitySubscriptionService = new SanitySubscriptionService()
