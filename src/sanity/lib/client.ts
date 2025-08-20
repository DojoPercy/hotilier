import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'zgs7rdoe',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false, // Set to false for real-time data
})

export const previewClient = createClient({
  projectId: 'zgs7rdoe',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Add this to your .env.local
})
