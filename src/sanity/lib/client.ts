import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'v4050nk7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'arabian-production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
})

export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'v4050nk7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'arabian-production',
  apiVersion: '2024-03-18',
  useCdn: false,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
  token: process.env.SANITY_VIEWER_TOKEN,
})

// Write client for mutations (requires write token)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'v4050nk7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'arabian-production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN,
})