// Common Sanity GROQ queries for the Energy Nexus project

// Base fields that are common across content types
export const baseFields = `
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  updatedAt,
  year,
  isFeatured,
  accessType,
  seo {
    title,
    description,
    ogImage,
    noindex
  },
  hero {
    image,
    caption,
    credit,
    videoUrl
  }
`

// Article queries
export const articleFields = `
  ${baseFields},
  body,
  readingTime,
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  }
`

export const getAllArticles = `*[_type == "article"] | order(publishedAt desc) {
  ${articleFields}
}`

export const getArticleBySlug = `*[_type == "article" && slug.current == $slug][0] {
  ${articleFields}
}`

export const getFeaturedArticles = `*[_type == "article" && isFeatured == true] | order(publishedAt desc) {
  ${articleFields}
}`

export const getTop7LatestArticles = `*[_type == "article" && defined(publishedAt)] | order(publishedAt desc)[0...7] {
  ${articleFields}
}`

// Interview queries
export const interviewFields = `
  ${baseFields},
  interviewee-> {
    _id,
    name,
    slug,
    headshot,
    role,
    organization-> {
      _id,
      name,
      logo
    },
    bio
  },
  roleAtTime,
  organizationAtTime-> {
    _id,
    name,
    logo
  },
  transcript,
  pullQuotes,
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  }
`

export const getAllInterviews = `*[_type == "interview"] | order(publishedAt desc) {
  ${interviewFields}
}`

export const getInterviewBySlug = `*[_type == "interview" && slug.current == $slug][0] {
  ${interviewFields}
}`

// Video queries
export const videoFields = `
  ${baseFields},
  platform,
  videoId,
  description,
  duration,
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  }
`

export const getAllVideos = `*[_type == "video"] | order(publishedAt desc) {
  ${videoFields}
}`

// Publication queries
export const publicationFields = `
  _id,
  _type,
  title,
  slug,
  hero {
    image,
    caption,
    credit
  },
  year,
  regions[]-> {
    _id,
    title,
    slug
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  toc[]-> {
    _id,
    _type,
    title,
    slug,
    dek
  },
  pdf,
  seo {
    title,
    description,
    ogImage,
    noindex
  }
`

export const getAllPublications = `*[_type == "publication"] | order(year desc) {
  ${publicationFields}
}`

export const getPublicationBySlug = `*[_type == "publication" && slug.current == $slug][0] {
  ${publicationFields}
}`

// Event queries
export const eventFields = `
  _id,
  _type,
  title,
  slug,
  type,
  start,
  end,
  location,
  region-> {
    _id,
    title,
    slug
  },
  partners[]-> {
    _id,
    name,
    logo,
    website
  },
  description,
  hero {
    image,
    caption,
    credit
  },
  registrationUrl,
  seo {
    title,
    description,
    ogImage,
    noindex
  }
`

export const getAllEvents = `*[_type == "event"] | order(start asc) {
  ${eventFields}
}`

export const getEventBySlug = `*[_type == "event" && slug.current == $slug][0] {
  ${eventFields}
}`

export const getUpcomingEvents = `*[_type == "event" && start > now()] | order(start asc) {
  ${eventFields}
}`

// Taxonomy queries
export const getAllSectors = `*[_type == "sector"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  icon
}`

export const getAllRegions = `*[_type == "region"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`

export const getAllTags = `*[_type == "tag"] | order(title asc) {
  _id,
  title,
  slug
}`

// Site settings
export const getSiteSettings = `*[_type == "siteSettings"][0] {
  siteTitle,
  tagline,
  logo,
  primaryRegion-> {
    _id,
    title,
    slug
  },
  navigation[] {
    label,
    href
  }
}`

// Search functionality
export const searchContent = `*[_type in ["article", "interview", "video", "specialReport"] && (
  title match $searchTerm + "*" ||
  dek match $searchTerm + "*" ||
  body[0].children[0].text match $searchTerm + "*"
)] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  hero {
    image
  }
}`

// Special Report queries
export const specialReportFields = `
  ${baseFields},
  summary,
  pdf
`

export const getTop3SpecialReports = `*[_type == "specialReport" && defined(publishedAt)] | order(publishedAt desc)[0...3] {
  ${specialReportFields}
}`

export const getSpecialReportBySlug = `*[_type == "specialReport" && slug.current == $slug][0] {
  ${specialReportFields}
}`

// Content by taxonomy
export const getContentBySector = `*[_type in ["article", "interview", "video"] && $sectorId in sectors[]._ref] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  hero {
    image
  }
}`

export const getContentByRegion = `*[_type in ["article", "interview", "video"] && $regionId in regions[]._ref] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  hero {
    image
  }
}`

// Premium content queries for Member Exclusives
export const getPremiumContent = `*[_type in ["article", "interview"] && accessType in ["login", "premium"]] | order(publishedAt desc)[0...6] {
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  accessType,
  hero {
    image,
    caption
  },
  sectors[]-> {
    _id,
    title,
    slug
  },
  regions[]-> {
    _id,
    title,
    slug
  }
}`

// Appointment queries
export const appointmentFields = `
  ${baseFields},
  person-> {
    _id,
    name,
    slug,
    headshot,
    bio,
    role
  },
  position,
  organization-> {
    _id,
    name,
    logo,
    website
  },
  previousPosition,
  previousOrganization-> {
    _id,
    name
  },
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  }
`

export const getAllAppointments = `*[_type == "appointment"] | order(publishedAt desc) {
  ${appointmentFields}
}`

export const getAppointmentBySlug = `*[_type == "appointment" && slug.current == $slug][0] {
  ${appointmentFields}
}`

export const getLatestAppointments = `*[_type == "appointment" && defined(publishedAt)] | order(publishedAt desc)[0...10] {
  ${appointmentFields}
}`

// New Opening queries
export const newOpeningFields = `
  ${baseFields},
  property-> {
    _id,
    name,
    logo,
    website
  },
  location,
  region-> {
    _id,
    title,
    slug
  },
  category,
  investmentValue,
  estimatedOpening,
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  }
`

export const getAllNewOpenings = `*[_type == "newOpening"] | order(publishedAt desc) {
  ${newOpeningFields}
}`

export const getNewOpeningBySlug = `*[_type == "newOpening" && slug.current == $slug][0] {
  ${newOpeningFields}
}`

export const getLatestNewOpenings = `*[_type == "newOpening" && defined(publishedAt)] | order(publishedAt desc)[0...10] {
  ${newOpeningFields}
}`

// Contract Publishing queries
export const contractPublishingFields = `
  ${baseFields},
  client-> {
    _id,
    name,
    logo,
    website
  },
  authors[]-> {
    _id,
    name,
    slug,
    headshot,
    bio
  },
  sectors[]-> {
    _id,
    title,
    slug,
    icon
  },
  regions[]-> {
    _id,
    title,
    slug
  },
  tags[]-> {
    _id,
    title,
    slug
  },
  body,
  pdf
`

export const getAllContractPublishing = `*[_type == "contractPublishing"] | order(publishedAt desc) {
  ${contractPublishingFields}
}`

export const getContractPublishingBySlug = `*[_type == "contractPublishing" && slug.current == $slug][0] {
  ${contractPublishingFields}
}`

export const getLatestContractPublishing = `*[_type == "contractPublishing" && defined(publishedAt)] | order(publishedAt desc)[0...10] {
  ${contractPublishingFields}
}`

// Article Category queries
export const getArticlesByCategory = `*[_type == "article" && category._ref == $categoryId] | order(publishedAt desc) {
  ${articleFields}
}`

export const getLatestArticlesByCategory = `*[_type == "article" && category._ref == $categoryId && defined(publishedAt)] | order(publishedAt desc)[0...10] {
  ${articleFields}
}`
