import { getImageUrl } from '@/sanity/lib'
import { Metadata } from 'next'
import { getURL } from 'next/dist/shared/lib/utils'

export interface SEOData {
  title?: string
  description?: string
  ogImage?: any
  noindex?: boolean
  url?: string
}

export interface PageMetadata {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  noindex?: boolean
  url?: string
}

export function generateMetadata(data: SEOData, defaultTitle: string, defaultDescription: string, url?: string): Metadata {
  const title = data.title || defaultTitle
  const description = data.description || defaultDescription
  console.log('seo data', data)
  // Ensure ogImage is always a string
  const imageUrl = getImageUrl(data.ogImage, 900, 400)
 
  let ogImage = '/logo_final.png'
  if (imageUrl) {
    if (true) {
      ogImage = imageUrl
    } else if (data.ogImage && typeof data.ogImage === 'object' && 'url' in data.ogImage) {
      ogImage = data.ogImage.url
    }
  }
  
  const noindex = data.noindex || false
  const canonicalUrl = data.url || url || '/'

  return {
    title,
    description,
    keywords: 'energy, news, articles, interviews, publications, events, renewable energy, sustainability, finance, MEA, Middle East, Africa',
    authors: [{ name: 'Hotelier Africa' }],
    creator: 'Hotelier Africa',
    publisher: 'Hotelier Africa',
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Hotelier Africa',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hotelierafrica',
      creator: '@hotelierafrica',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export function generateHomeMetadata(): Metadata {
  return generateMetadata(
    {},
    ' The Hotelier Africa & Business Boardroom – A premier Abu Dhabi–based platform spotlighting leadership, governance, and business excellence across the Arabian region. Through rankings, reports, and awards, it unites executives and organizations driving transformation, integrity, and sustainable growth.',
    '/'
  )
}

export function generateArticlesMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Articles - Hotelier Africa',
    'Explore our comprehensive collection of energy articles covering renewable energy, sustainability, industry trends, and expert insights.',
    '/articles'
  )
}

export function generateArticleMetadata(article: any): Metadata {
  const seo = article.seo || {}
  const title = seo.title || article.title
  const description = seo.description || article.dek || `Read about ${article.title} on Hotelier Africa.`
  const url = article.slug?.current ? `/articles/${article.slug.current}` : '/articles'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateInterviewsMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Interviews - Hotelier Africa',
    'Discover exclusive interviews with energy industry leaders, experts, and innovators. Get insights from the people shaping the future of energy.',
    '/interviews'
  )
}

export function generateInterviewMetadata(interview: any): Metadata {
  const seo = interview.seo || {}
  const title = seo.title || `${interview.interviewee?.name || interview.title} - Interview`
  const description = seo.description || interview.dek || `Read our exclusive interview with ${interview.interviewee?.name || 'energy industry expert'}.`
  const url = interview.slug?.current ? `/interviews/${interview.slug.current}` : '/interviews'
  

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateEventsMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Events - Hotelier Africa',
    'Stay informed about upcoming energy events, conferences, summits, and industry gatherings. Find events in your region and sector.',
    '/events'
  )
}

export function generateEventMetadata(event: any): Metadata {
  const seo = event.seo || {}
  const title = seo.title || `${event.title} - Energy Event`
  const description = seo.description || `Join us at ${event.title}, a ${event.type} event in the energy industry.`
  const url = event.slug?.current ? `/events/${event.slug.current}` : '/events'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generatePublicationsMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Publications - Hotelier Africa',
    'Browse our collection of energy publications, reports, and special issues. Download PDFs and explore comprehensive energy research.',
    '/publications'
  )
}

export function generatePublicationMetadata(publication: any): Metadata {
  const seo = publication.seo || {}
  const title = seo.title || `${publication.title} - Publication`
  const description = seo.description || `Download ${publication.title}, a comprehensive energy publication with ${publication.toc?.length || 0} articles.`
  const url = publication.slug?.current ? `/publications/${publication.slug.current}` : '/publications'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateVideosMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Videos - Hotelier Africa',
    'Watch energy industry videos, interviews, and insights. Discover expert analysis and industry trends through our video content.',
    '/videos'
  )
}

export function generateVideoMetadata(video: any): Metadata {
  const seo = video.seo || {}
  const title = seo.title || `${video.title} - Video`
  const description = seo.description || video.description || `Watch ${video.title} on Hotelier Africa.`
  const url = video.slug?.current ? `/videos/${video.slug.current}` : '/videos'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateSectorMetadata(sector: any): Metadata {
  const seo = sector.seo || {}
  const title = seo.title || `${sector.title} - Energy Sector`
  const description = seo.description || `Explore ${sector.title} news, articles, and insights in the energy industry.`
  const url = sector.slug?.current ? `/sectors/${sector.slug.current}` : '/sectors'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateRegionMetadata(region: any): Metadata {
  const seo = region.seo || {}
  const title = seo.title || `${region.title} - Energy News`
  const description = seo.description || `Stay updated with energy news and insights from ${region.title}.`
  const url = region.slug?.current ? `/regions/${region.slug.current}` : '/regions'

  return generateMetadata(
    { ...seo, url },
    title,
    description,
    url
  )
}

export function generateAboutMetadata(): Metadata {
  return generateMetadata(
    {},
    'About Us - Hotelier Africa',
    'Learn about Hotelier Africa, your trusted source for energy news, insights, and analysis. Discover our mission and commitment to energy journalism.',
    '/about'
  )
}

export function generateContactMetadata(): Metadata {
  return generateMetadata(
    {},
    'Contact Us - Hotelier Africa',
    'Get in touch with Hotelier Africa. Contact our team for editorial inquiries, advertising opportunities, or general questions.',
    '/contact'
  )
}

export function generateAdvertiseMetadata(): Metadata {
  return generateMetadata(
    {},
    'Advertise - Hotelier Africa',
    'Advertise with Hotelier Africa and reach energy industry professionals, decision-makers, and stakeholders. Explore our advertising opportunities.',
    '/advertise'
  )
}

export function generateContractPublishingMetadata(): Metadata {
  return generateMetadata(
    {},
    'Contract Publishing - Hotelier Africa Magazine',
    'Professional contract publishing services by Hotelier Africa Magazine. Custom publishing solutions for leaders and organizations. Your story, published. Your leadership, elevated.',
    '/contract-publishing'
  )
}

export function generateMyAccountMetadata(): Metadata {
  return generateMetadata(
    {},
    'My Account - Hotelier Africa',
    'Manage your Hotelier Africa account, preferences, and subscriptions.',
    '/my-account'
  )
}

export function generateNotFoundMetadata(): Metadata {
  return {
    title: 'Page Not Found - Hotelier Africa',
    description: 'The page you are looking for could not be found.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export function generateErrorMetadata(): Metadata {
  return {
    title: 'Error - Hotelier Africa',
    description: 'An error occurred while loading this page.',
    robots: {
      index: false,
      follow: false,
    },
  }
}
