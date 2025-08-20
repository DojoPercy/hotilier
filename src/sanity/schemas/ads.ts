import { defineType, defineField } from 'sanity'

// Ad Types
export const adType = defineType({
  name: 'adType',
  title: 'Ad Type',
  type: 'string',
  options: {
    list: [
      { title: 'Hero Ad', value: 'hero' },
      { title: 'Sidebar Ad', value: 'sidebar' },
      { title: 'Banner Ad', value: 'banner' },
      { title: 'Article Ad', value: 'article' },
      { title: 'Footer Ad', value: 'footer' },
      { title: 'Popup Ad', value: 'popup' },
      { title: 'Newsletter Ad', value: 'newsletter' },
    ],
    layout: 'dropdown'
  },
  validation: r => r.required()
})

// Ad Schema
export const ad = defineType({
  name: 'ad',
  title: 'Advertisement',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      type: 'string', 
      validation: r => r.required(),
      description: 'Internal name for the ad'
    }),
    defineField({ 
      name: 'adType', 
      type: 'adType',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'client', 
      type: 'string',
      description: 'Client or advertiser name'
    }),
    defineField({ 
      name: 'campaign', 
      type: 'string',
      description: 'Campaign name or identifier'
    }),
    defineField({ 
      name: 'startDate', 
      type: 'datetime',
      description: 'When this ad should start showing'
    }),
    defineField({ 
      name: 'endDate', 
      type: 'datetime',
      description: 'When this ad should stop showing'
    }),
    defineField({ 
      name: 'isActive', 
      type: 'boolean', 
      initialValue: true,
      description: 'Whether this ad is currently active'
    }),
    defineField({ 
      name: 'priority', 
      type: 'number', 
      initialValue: 1,
      description: 'Priority order (higher numbers show first)',
      validation: r => r.min(1).max(10)
    }),
    defineField({ 
      name: 'targetUrl', 
      type: 'url',
      description: 'Where the ad should link to',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'desktopImage', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Image for desktop devices',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'mobileImage', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Image for mobile devices',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'altText', 
      type: 'string',
      description: 'Alt text for accessibility',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'trackingCode', 
      type: 'string',
      description: 'Analytics or tracking code'
    }),
    defineField({ 
      name: 'impressionLimit', 
      type: 'number',
      description: 'Maximum number of impressions (0 = unlimited)',
      initialValue: 0
    }),
    defineField({ 
      name: 'clickLimit', 
      type: 'number',
      description: 'Maximum number of clicks (0 = unlimited)',
      initialValue: 0
    }),
    defineField({ 
      name: 'targeting', 
      type: 'object',
      fields: [
        { name: 'regions', type: 'array', of: [{ type: 'reference', to: [{ type: 'region' }] }] },
        { name: 'sectors', type: 'array', of: [{ type: 'reference', to: [{ type: 'sector' }] }] },
        { name: 'userTypes', type: 'array', of: [{ type: 'string', options: { list: ['guest', 'subscriber', 'premium'] } }] },
        { name: 'deviceTypes', type: 'array', of: [{ type: 'string', options: { list: ['desktop', 'mobile', 'tablet'] } }] },
      ]
    }),
    defineField({ 
      name: 'notes', 
      type: 'text',
      description: 'Internal notes about this ad'
    })
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      adType: 'adType',
      isActive: 'isActive',
      desktopImage: 'desktopImage'
    },
    prepare({ title, client, adType, isActive, desktopImage }) {
      return {
        title: title,
        subtitle: `${client || 'No Client'} • ${adType} • ${isActive ? 'Active' : 'Inactive'}`,
        media: desktopImage
      }
    }
  }
})

// Ad Placement Schema
export const adPlacement = defineType({
  name: 'adPlacement',
  title: 'Ad Placement',
  type: 'document',
  fields: [
    defineField({ 
      name: 'name', 
      type: 'string', 
      validation: r => r.required(),
      description: 'Name of the placement (e.g., "Homepage Hero", "Article Sidebar")'
    }),
    defineField({ 
      name: 'location', 
      type: 'string',
      validation: r => r.required(),
      description: 'Where this placement appears'
    }),
    defineField({ 
      name: 'adType', 
      type: 'adType',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'ads', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'ad' }] }],
      description: 'Ads that can appear in this placement'
    }),
    defineField({ 
      name: 'isActive', 
      type: 'boolean', 
      initialValue: true
    }),
    defineField({ 
      name: 'displaySettings', 
      type: 'object',
      fields: [
        { name: 'showOnDesktop', type: 'boolean', initialValue: true },
        { name: 'showOnMobile', type: 'boolean', initialValue: true },
        { name: 'showOnTablet', type: 'boolean', initialValue: true },
        { name: 'maxAdsToShow', type: 'number', initialValue: 1 },
        { name: 'rotationInterval', type: 'number', initialValue: 5000, description: 'Rotation interval in milliseconds' },
        { name: 'fadeTransition', type: 'boolean', initialValue: true },
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      location: 'location',
      adType: 'adType',
      isActive: 'isActive'
    },
    prepare({ title, location, adType, isActive }) {
      return {
        title: title,
        subtitle: `${location} • ${adType} • ${isActive ? 'Active' : 'Inactive'}`
      }
    }
  }
})

// Ad Performance Schema (for tracking)
export const adPerformance = defineType({
  name: 'adPerformance',
  title: 'Ad Performance',
  type: 'document',
  fields: [
    defineField({ 
      name: 'ad', 
      type: 'reference', 
      to: [{ type: 'ad' }],
      validation: r => r.required()
    }),
    defineField({ 
      name: 'date', 
      type: 'date',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'impressions', 
      type: 'number', 
      initialValue: 0
    }),
    defineField({ 
      name: 'clicks', 
      type: 'number', 
      initialValue: 0
    }),
    defineField({ 
      name: 'deviceType', 
      type: 'string',
      options: { list: ['desktop', 'mobile', 'tablet'] }
    }),
    defineField({ 
      name: 'userType', 
      type: 'string',
      options: { list: ['guest', 'subscriber', 'premium'] }
    })
  ]
})
