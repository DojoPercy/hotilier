import { defineType, defineField } from 'sanity'

// Access Type for Content Gating
export const accessType = defineType({
  name: 'accessType',
  title: 'Access Type',
  type: 'string',
  options: {
    list: [
      { title: 'Free', value: 'free' },
      { title: 'Login Required', value: 'login' },
      { title: 'Premium Subscription', value: 'premium' },
    ],
    layout: 'dropdown'
  },
  initialValue: 'free',
  validation: r => r.required()
})

// Subscription Plan Types
export const subscriptionPlan = defineType({
  name: 'subscriptionPlan',
  title: 'Subscription Plan',
  type: 'document',
  fields: [
    defineField({ 
      name: 'name', 
      type: 'string', 
      validation: r => r.required(),
      description: 'Plan name (e.g., "Annual Subscription")'
    }),
    defineField({ 
      name: 'slug', 
      type: 'slug', 
      options: { source: 'name' },
      validation: r => r.required()
    }),
    defineField({ 
      name: 'description', 
      type: 'text',
      description: 'Plan description'
    }),
    defineField({ 
      name: 'price', 
      type: 'number',
      validation: r => r.required(),
      description: 'Price in cents (e.g., 9999 for $99.99)'
    }),
    defineField({ 
      name: 'currency', 
      type: 'string',
      options: {
        list: [
          { title: 'USD', value: 'usd' },
          { title: 'EUR', value: 'eur' },
          { title: 'GBP', value: 'gbp' },
          { title: 'GHS (Ghana Cedi)', value: 'ghs' },
        ]
      },
      initialValue: 'ghs',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'interval', 
      type: 'string',
      options: {
        list: [
          { title: 'Monthly', value: 'month' },
          { title: 'Yearly', value: 'year' },
          { title: 'One-time', value: 'one_time' },
        ]
      },
      validation: r => r.required()
    }),
    defineField({ 
      name: 'features', 
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of features included in this plan'
    }),
    defineField({ 
      name: 'isActive', 
      type: 'boolean', 
      initialValue: true,
      description: 'Whether this plan is currently available'
    }),
    defineField({ 
      name: 'isPopular', 
      type: 'boolean', 
      initialValue: false,
      description: 'Mark as popular/recommended plan'
    }),
    defineField({ 
      name: 'paystackPlanCode', 
      type: 'string',
      description: 'Paystack Plan Code for this plan'
    }),
    defineField({ 
      name: 'paystackPlanId', 
      type: 'string',
      description: 'Paystack Plan ID for this plan'
    })
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      currency: 'currency',
      interval: 'interval'
    },
    prepare({ title, price, currency, interval }) {
      const formattedPrice = (price / 100).toFixed(2)
      return {
        title: title,
        subtitle: `${currency.toUpperCase()} ${formattedPrice}/${interval}`
      }
    }
  }
})

// User Subscription (for tracking user subscriptions)
export const userSubscription = defineType({
  name: 'userSubscription',
  title: 'User Subscription',
  type: 'document',
  fields: [
    defineField({ 
      name: 'user', 
      type: 'reference', 
      to: [{ type: 'user' }],
      validation: r => r.required()
    }),
    defineField({ 
      name: 'plan', 
      type: 'reference', 
      to: [{ type: 'subscriptionPlan' }],
      validation: r => r.required()
    }),
    defineField({ 
      name: 'status', 
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Canceled', value: 'canceled' },
          { title: 'Past Due', value: 'past_due' },
          { title: 'Unpaid', value: 'unpaid' },
        ]
      },
      initialValue: 'active',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'paystackSubscriptionId', 
      type: 'string',
      description: 'Paystack Subscription ID'
    }),
    defineField({ 
      name: 'paystackCustomerId', 
      type: 'string',
      description: 'Paystack Customer ID'
    }),
    defineField({ 
      name: 'paystackCustomerCode', 
      type: 'string',
      description: 'Paystack Customer Code'
    }),
    defineField({ 
      name: 'currentPeriodStart', 
      type: 'datetime',
      description: 'Start of current billing period'
    }),
    defineField({ 
      name: 'currentPeriodEnd', 
      type: 'datetime',
      description: 'End of current billing period'
    }),
    defineField({ 
      name: 'canceledAt', 
      type: 'datetime',
      description: 'When the subscription was canceled'
    }),
    defineField({ 
      name: 'createdAt', 
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  preview: {
    select: {
      user: 'user.name',
      plan: 'plan.name',
      status: 'status',
      periodEnd: 'currentPeriodEnd'
    },
    prepare({ user, plan, status, periodEnd }) {
      const endDate = periodEnd ? new Date(periodEnd).toLocaleDateString() : 'No end date'
      return {
        title: `${user} - ${plan}`,
        subtitle: `${status} • Until ${endDate}`
      }
    }
  }
})

