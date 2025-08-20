import { Metadata } from 'next'

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
  
  // Ensure ogImage is always a string
  let ogImage = '/og-default.jpg'
  if (data.ogImage) {
    if (typeof data.ogImage === 'string') {
      ogImage = data.ogImage
    } else if (data.ogImage && typeof data.ogImage === 'object' && 'url' in data.ogImage) {
      ogImage = data.ogImage.url
    }
  }
  
  const noindex = data.noindex || false
  const canonicalUrl = data.url || url || '/'

  return {
    title,
    description,
    keywords: 'energy, news, articles, interviews, publications, events, renewable energy, sustainability',
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Energy Nexus',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
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
    'Energy Nexus - Latest Energy News, Articles & Insights',
    'Stay updated with the latest energy news, articles, interviews, and insights from the energy industry. Discover renewable energy trends, sustainability news, and expert analysis.',
    '/'
  )
}

export function generateArticlesMetadata(seo?: SEOData): Metadata {
  return generateMetadata(
    seo || {},
    'Articles - Energy Nexus',
    'Explore our comprehensive collection of energy articles covering renewable energy, sustainability, industry trends, and expert insights.',
    '/articles'
  )
}

export function generateArticleMetadata(article: any): Metadata {
  const seo = article.seo || {}
  const title = seo.title || article.title
  const description = seo.description || article.dek || `Read about ${article.title} on Energy Nexus.`
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
    'Interviews - Energy Nexus',
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
    'Events - Energy Nexus',
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
    'Publications - Energy Nexus',
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

export function generateAboutMetadata(): Metadata {
  return generateMetadata(
    {},
    'About Us - Energy Nexus',
    'Learn about Energy Nexus, your trusted source for energy news, insights, and analysis. Discover our mission and commitment to energy journalism.',
    '/about'
  )
}

export function generateContactMetadata(): Metadata {
  return generateMetadata(
    {},
    'Contact Us - Energy Nexus',
    'Get in touch with Energy Nexus. Contact our team for editorial inquiries, advertising opportunities, or general questions.',
    '/contact'
  )
}

export function generateAdvertiseMetadata(): Metadata {
  return generateMetadata(
    {},
    'Advertise - Energy Nexus',
    'Advertise with Energy Nexus and reach energy industry professionals, decision-makers, and stakeholders. Explore our advertising opportunities.',
    '/advertise'
  )
}

export function generateContractPublishingMetadata(): Metadata {
  return generateMetadata(
    {},
    'Contract Publishing - The Boardroom Magazine',
    'Professional contract publishing services by The Boardroom Magazine. Custom publishing solutions for leaders and organizations. Your story, published. Your brand, elevated.',
    '/contract-publishing'
  )
}
