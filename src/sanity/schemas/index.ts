// The Business Year — Content Taxonomy & Schemas (Sanity v3)
// -----------------------------------------------------------
// Notes
// - Uses TypeScript for strong typing.
// - Designed to mirror the information architecture visible on thebusinessyear.com:
//   Content Types: Articles, Interviews, Videos, Events, Press / Media, Power Lists, Publications (Issues)
//   Taxonomies: Sectors, Regions, Years, Tags
//   Entities: People (Interviewees), Organizations, Authors/Contributors, Partners
//   Advertising: Ads, Ad Placements, Performance Tracking
// - Includes basic SEO, hero media, rich text, relationships, and portable, reusable objects.

import { defineType, defineField, defineArrayMember } from 'sanity'
import { ad, adType, adPlacement, adPerformance } from './ads'
import { banner } from './banner'
import aiSummary from './aiSummary'
import { 
  analyticsEvent, 
  analyticsEventType, 
  contentPerformance, 
  analyticsSettings 
} from './analytics'
import { 
  accessType, 
  subscriptionPlan, 
  userSubscription 
} from './access'

// =====================
// Shared / Utility types
// =====================
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'SEO Title', type: 'string', validation: r => r.max(70) }),
    defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3, validation: r => r.max(160) }),
    defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'noindex', title: 'Noindex', type: 'boolean', initialValue: false }),
  ],
})

export const heroMedia = defineType({
  name: 'heroMedia',
  title: 'Hero Media',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'credit', title: 'Credit', type: 'string' }),
    defineField({ name: 'videoUrl', title: 'Optional Video URL (oEmbed)', type: 'url' }),
  ],
})

export const richBlock = defineType({
  name: 'richBlock',
  title: 'Rich Block',
  type: 'array',
  of: [
    defineArrayMember({ type: 'block' }),
    defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [
      { name: 'alt', title: 'Alt text', type: 'string' },
      { name: 'caption', title: 'Caption', type: 'string' },
      { name: 'credit', title: 'Credit', type: 'string' },
    ]}),
    defineArrayMember({
      type: 'object', name: 'embed', title: 'Embed', fields: [
        { name: 'title', type: 'string' },
        { name: 'url', type: 'url' },
        { name: 'provider', type: 'string' },
      ]
    })
  ]
})

// ==========
// Taxonomies
// ==========
export const sector = defineType({
  name: 'sector',
  title: 'Sector',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'icon', title: 'Icon (emoji or short label)', type: 'string' }),
  ]
})

// Pre-seed sectors list (optional import data)
export const SECTOR_SEED = [
  'Agriculture',
  'Diplomacy',
  'Economy',
  'Energy & Mining',
  'Finance',
  'Green Economy',
  'Health & Education',
  'Industry',
  'Real Estate & Construction',
  'Telecoms & IT',
  'Tourism',
  'Transport',
  'Sports',
] as const

export const region = defineType({
  name: 'region',
  title: 'Region',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'description', type: 'text' }),
  ]
})

export const tag = defineType({
  name: 'tag', 
  title: 'Tag', 
  type: 'document', 
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
  ]
})

// ==============
// Entity Schemas
// ==============
export const organization = defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'region', type: 'reference', to: [{ type: 'region' }] }),
    defineField({ name: 'sector', type: 'array', of: [{ type: 'reference', to: [{ type: 'sector' }] }] }),
    defineField({ name: 'summary', type: 'text' }),
  ]
})

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'role', title: 'Current Role/Title', type: 'string' }),
    defineField({ name: 'organization', type: 'reference', to: [{ type: 'organization' }] }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({ name: 'socials', type: 'object', fields: [
      { name: 'linkedin', type: 'url' },
      { name: 'x', title: 'X / Twitter', type: 'url' },
      { name: 'website', type: 'url' },
    ]})
  ]
})

export const author = defineType({
  name: 'author',
  title: 'Author / Contributor',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text' }),
    defineField({ name: 'email', type: 'email' }),
  ]
})

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'description', type: 'text' }),
  ]
})

// ==================
// Users (Auth0)
// ==================
export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'email', type: 'string', validation: r => r.required() }),

    defineField({ name: 'authProvider', title: 'Auth Provider', type: 'string' }),
    defineField({ name: 'auth0Sub', title: 'Auth0 Sub', type: 'string' }),
    defineField({ name: 'createdAt', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || 'User', subtitle }
    },
  },
})


// ==================
// Core Content Types
// ==================
const baseContentFields = [
  defineField({ name: 'title', type: 'string', validation: r => r.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
  defineField({ name: 'dek', title: 'Lead', type: 'text' }),
  defineField({ name: 'hero', type: 'heroMedia' }),
  defineField({ name: 'publishedAt', type: 'datetime' }),
  defineField({ name: 'updatedAt', type: 'datetime' }),
  defineField({ name: 'authors', type: 'array', of: [{ type: 'reference', to: [{ type: 'author' }] }] }),
  defineField({ name: 'sectors', type: 'array', of: [{ type: 'reference', to: [{ type: 'sector' }] }] }),
  defineField({ name: 'regions', type: 'array', of: [{ type: 'reference', to: [{ type: 'region' }] }] }),
  defineField({ name: 'tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'tag' }] }] }),
  defineField({ name: 'year', type: 'number', description: 'Display year (e.g., 2025)' }),
  defineField({ name: 'seo', type: 'seo' }),
  defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),
  defineField({ name: 'accessType', type: 'accessType', initialValue: 'free' }),
]

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    ...baseContentFields,
    defineField({ name: 'body', type: 'richBlock' }),
    defineField({ name: 'readingTime', type: 'number' }),
  ],
  preview: { select: { title: 'title', media: 'hero.image', subtitle: 'dek' } },
})

export const interview = defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  fields: [
    ...baseContentFields,
    defineField({ name: 'interviewee', type: 'reference', to: [{ type: 'person' }], validation: r => r.required() }),
    defineField({ name: 'roleAtTime', title: 'Role at Interview Time', type: 'string' }),
    defineField({ name: 'organizationAtTime', type: 'reference', to: [{ type: 'organization' }] }),
    defineField({ name: 'transcript', type: 'richBlock' }),
    defineField({ name: 'pullQuotes', type: 'array', of: [{ type: 'text' }] }),
  ],
})

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    ...baseContentFields,
    defineField({ name: 'platform', type: 'string', options: { list: ['YouTube', 'Vimeo', 'Other'] } }),
    defineField({ name: 'videoId', title: 'Video ID or URL', type: 'string' }),
    defineField({ name: 'description', type: 'richBlock' }),
    defineField({ name: 'duration', type: 'number' }),
  ],
})

export const press = defineType({
  name: 'press',
  title: 'Press / Media',
  type: 'document',
  fields: [
    ...baseContentFields,
    defineField({ name: 'externalUrl', title: 'External URL', type: 'url' }),
    defineField({ name: 'body', type: 'richBlock' }),
  ],
})

export const powerList = defineType({
  name: 'powerList',
  title: 'Power List',
  type: 'document',
  fields: [
    ...baseContentFields,
    defineField({name: 'category', type: 'reference', to: [{ type: 'powerListCategory' }], validation: r => r.required()}),
    defineField({ name: 'pdf', type: 'file', options: { accept: 'application/pdf' } }),
    defineField({ name: 'summary', type: 'richBlock' }),
  ]
})

export const powerListCategory = defineType({
  name: 'powerListCategory',
  title: 'Power List Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
  ]
})
export const publication = defineType({
  name: 'publication',
  title: 'Publication (Issue)',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'hero', type: 'heroMedia' }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'regions', type: 'array', of: [{ type: 'reference', to: [{ type: 'region' }] }] }),
    defineField({ name: 'sectors', type: 'array', of: [{ type: 'reference', to: [{ type: 'sector' }] }] }),
    defineField({ name: 'toc', title: 'Table of Contents', type: 'array', of: [{ type: 'reference', to: [ { type: 'article' }, { type: 'interview' } ] }] }),
    defineField({ name: 'pdf', type: 'file', options: { accept: 'application/pdf' } }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['Conference', 'Summit', 'Roundtable', 'Webinar', 'Awards', 'Other'] } }),
    defineField({ name: 'start', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'end', type: 'datetime' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'region', type: 'reference', to: [{ type: 'region' }] }),
    defineField({ name: 'partners', type: 'array', of: [{ type: 'reference', to: [{ type: 'partner' }] }] }),
    defineField({ name: 'description', type: 'richBlock' }),
    defineField({ name: 'hero', type: 'heroMedia' }),
    defineField({ name: 'registrationUrl', type: 'url' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})

// =====================
// Pages & Settings
// =====================
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'body', type: 'richBlock' }),
    defineField({ name: 'seo', type: 'seo' }),
  ]
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', type: 'string' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'primaryRegion', type: 'reference', to: [{ type: 'region' }] }),
    defineField({ name: 'navigation', title: 'Navigation (manual)', type: 'array', of: [{
      type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ]
    }] }),
  ]
})


// ==================
// User Saved Items
// ==================
export const savedItem = defineType({
  name: 'savedItem',
  title: 'Saved Item',
  type: 'document',
  fields: [
    // Reference to the user who saved the item
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: r => r.required(),
    }),
    // Reference to any content type that can be saved
    defineField({
      name: 'content',
      title: 'Content',
      type: 'reference',
      to: [
        { type: 'article' },
        { type: 'interview' },
        { type: 'event' },
        { type: 'video' },
        { type: 'press' },
        { type: 'powerList' },
        { type: 'publication' },
      ],
      validation: r => r.required(),
    }),
    defineField({ name: 'createdAt', title: 'Saved At', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'notes', title: 'Notes (optional)', type: 'text' }),
  ],
  preview: {
    select: {
      title: 'content.title',
      subtitle: 'user.email',
      media: 'content.hero.image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Saved Item',
        subtitle,
        media,
      }
    },
  },
})


// ============================
// Subscription Plans are defined in access.ts

// =====================
// Export schema bundle
// =====================
export default [
  // Shared
  seo, heroMedia, richBlock,
  // Taxonomies
  sector, region, tag,
  // Entities
  organization, person, author, partner,
  // Content
  article, interview, video, press, powerList, powerListCategory, publication, event,
  // AI Features
  aiSummary,
  // Advertising
  adType, ad, adPlacement, adPerformance,
  // Banners
  banner,
  // Analytics
  analyticsEventType, analyticsEvent, contentPerformance, analyticsSettings,
  // Access Control
  accessType, subscriptionPlan, userSubscription,
  // Users
  user, savedItem,
  // Pages & Settings
  page, siteSettings,
]
