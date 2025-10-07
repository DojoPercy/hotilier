'use server'
import {defineLive} from 'next-sanity'
import {client} from './client'

const token = process.env.SANITY_VIEWER_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})


