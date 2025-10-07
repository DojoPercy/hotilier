import { defineType, defineField } from 'sanity'

// Simple Analytics Event Types
export const analyticsEventType = defineType({
  name: 'analyticsEventType',
  title: 'Analytics Event Type',
  type: 'string',
  options: {
    list: [
      { title: 'Page View', value: 'page_view' },
      { title: 'Article View', value: 'article_view' },
    ],
    layout: 'dropdown'
  },
  validation: r => r.required()
})

// Removed complex device and user type tracking - keeping it simple

// Simple Analytics Event Schema
export const analyticsEvent = defineType({
  name: 'analyticsEvent',
  title: 'Analytics Event',
  type: 'document',
  fields: [
    defineField({ 
      name: 'eventType', 
      type: 'analyticsEventType',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'contentId', 
      type: 'string',
      description: 'ID of the content being tracked'
    }),
    defineField({ 
      name: 'contentType', 
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Page', value: 'page' },
        ]
      },
      description: 'Type of content being tracked'
    }),
    defineField({ 
      name: 'timestamp', 
      type: 'datetime',
      validation: r => r.required(),
      initialValue: () => new Date().toISOString()
    }),
    defineField({ 
      name: 'pageTitle', 
      type: 'string',
      description: 'Title of the page/article'
    })
  ],
  preview: {
    select: {
      eventType: 'eventType',
      contentType: 'contentType',
      contentId: 'contentId',
      timestamp: 'timestamp',
      pageTitle: 'pageTitle'
    },
    prepare({ eventType, contentType, contentId, timestamp, pageTitle }) {
      const date = timestamp ? new Date(timestamp).toLocaleDateString() : 'No date'
      return {
        title: `${eventType} - ${pageTitle || contentId}`,
        subtitle: `${contentType} • ${date}`
      }
    }
  }
})

// Simple Content Performance Summary Schema
export const contentPerformance = defineType({
  name: 'contentPerformance',
  title: 'Content Performance',
  type: 'document',
  fields: [
    defineField({ 
      name: 'contentId', 
      type: 'string',
      validation: r => r.required(),
      description: 'ID of the content'
    }),
    defineField({ 
      name: 'contentType', 
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Page', value: 'page' },
        ]
      },
      validation: r => r.required()
    }),
    defineField({ 
      name: 'title', 
      type: 'string',
      description: 'Content title for easy reference'
    }),
    defineField({ 
      name: 'date', 
      type: 'date',
      validation: r => r.required(),
      description: 'Date for this performance summary'
    }),
    defineField({ 
      name: 'views', 
      type: 'number', 
      initialValue: 0,
      description: 'Total page views'
    }),
    defineField({ 
      name: 'lastUpdated', 
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'When this summary was last updated'
    })
  ],
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      date: 'date',
      views: 'views'
    },
    prepare({ title, contentType, date, views }) {
      return {
        title: title || `${contentType} Performance`,
        subtitle: `${views} views • ${date}`
      }
    }
  }
})

// Simple Analytics Settings
export const analyticsSettings = defineType({
  name: 'analyticsSettings',
  title: 'Analytics Settings',
  type: 'document',
  fields: [
    defineField({ 
      name: 'isEnabled', 
      type: 'boolean', 
      initialValue: true,
      description: 'Enable analytics tracking'
    })
  ]
})

