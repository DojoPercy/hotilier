import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'ypnn99dw',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false, 
})

export const previewClient = createClient({
  projectId: 'ypnn99dw',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Add this to your .env.local
})
