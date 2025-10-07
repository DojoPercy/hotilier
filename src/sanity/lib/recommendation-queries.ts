// Smart Content Recommendation Queries
// These queries implement a sophisticated recommendation algorithm that considers:
// 1. Shared taxonomies (sectors, regions, tags)
// 2. Content type diversity
// 3. Recency and relevance
// 4. User engagement patterns

// Base recommendation fields
export const recommendationFields = `
  _id,
  _type,
  title,
  slug,
  dek,
  publishedAt,
  year,
  isFeatured,
  hero {
    image,
    caption
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
  interviewee-> {
    _id,
    name,
    headshot,
    organization-> {
      _id,
      name
    }
  },
  organizationAtTime-> {
    _id,
    name
  }
`

// Get related content by shared taxonomies with scoring
export const getRelatedContentByTaxonomy = `
*[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && (
  count(sectors[@._ref in $sectorIds]) > 0 ||
  count(regions[@._ref in $regionIds]) > 0 ||
  count(tags[@._ref in $tagIds]) > 0
)] | order(
  // Scoring algorithm: prioritize by taxonomy matches and recency
  (
    count(sectors[@._ref in $sectorIds]) * 3 +
    count(regions[@._ref in $regionIds]) * 2 +
    count(tags[@._ref in $tagIds]) * 1 +
    select(isFeatured == true => 2, 0) +
    select(publishedAt > now() - 90*24*60*60*1000 => 1, 0) // Recent content bonus
  ) desc,
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get content by same author (for articles)
export const getContentByAuthor = `
*[_type in ["article", "interview"] && _id != $currentId && count(authors[@._ref in $authorIds]) > 0] | order(
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get content by same organization (for interviews)
export const getContentByOrganization = `
*[_type in ["interview", "article"] && _id != $currentId && (
  interviewee->organization._ref in $organizationIds ||
  organizationAtTime._ref in $organizationIds
)] | order(
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get trending content (most recent and featured)
export const getTrendingContent = `
*[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && defined(publishedAt)] | order(
  select(isFeatured == true => 3, 0) +
  select(publishedAt > now() - 30*24*60*60*1000 => 2, 0) + // Recent content
  select(publishedAt > now() - 7*24*60*60*1000 => 1, 0), // Very recent content
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get content from same year
export const getContentByYear = `
*[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && year == $year] | order(
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get diverse content types (ensure variety in recommendations)
export const getDiverseContentTypes = `
*[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && _type != $currentType] | order(
  select(isFeatured == true => 2, 0) +
  select(publishedAt > now() - 60*24*60*60*1000 => 1, 0),
  publishedAt desc
)[0...$limit] {
  ${recommendationFields}
}`

// Get related publications (issues) by sector/region
export const getRelatedPublications = `
*[_type == "publication" && (
  count(sectors[@._ref in $sectorIds]) > 0 ||
  count(regions[@._ref in $regionIds]) > 0
)] | order(
  year desc
)[0...$limit] {
  _id,
  _type,
  title,
  slug,
  hero {
    image,
    caption
  },
  year,
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
  }
}`

// Get related events by sector/region
export const getRelatedEvents = `
*[_type == "event" && (
  region._ref in $regionIds ||
  count(partners[@.sector._ref in $sectorIds]) > 0
) && start > now()] | order(
  start asc
)[0...$limit] {
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
  hero {
    image,
    caption
  }
}`

// Comprehensive recommendation query that combines multiple strategies
export const getSmartRecommendations = `
{
  "relatedByTaxonomy": *[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && (
    count(sectors[@._ref in $sectorIds]) > 0 ||
    count(regions[@._ref in $regionIds]) > 0 ||
    count(tags[@._ref in $tagIds]) > 0
  )] | order(
    (
      count(sectors[@._ref in $sectorIds]) * 3 +
      count(regions[@._ref in $regionIds]) * 2 +
      count(tags[@._ref in $tagIds]) * 1 +
      select(isFeatured == true => 2, 0) +
      select(publishedAt > now() - 90*24*60*60*1000 => 1, 0)
    ) desc,
    publishedAt desc
  )[0...3] {
    ${recommendationFields}
  },
  "trending": *[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && defined(publishedAt)] | order(
    select(isFeatured == true => 3, 0) +
    select(publishedAt > now() - 30*24*60*60*1000 => 2, 0) +
    select(publishedAt > now() - 7*24*60*60*1000 => 1, 0),
    publishedAt desc
  )[0...2] {
    ${recommendationFields}
  },
  "diverseTypes": *[_type in ["article", "interview", "video", "specialReport"] && _id != $currentId && _type != $currentType] | order(
    select(isFeatured == true => 2, 0) +
    select(publishedAt > now() - 60*24*60*60*1000 => 1, 0),
    publishedAt desc
  )[0...2] {
    ${recommendationFields}
  },
  "publications": *[_type == "publication" && (
    count(sectors[@._ref in $sectorIds]) > 0 ||
    count(regions[@._ref in $regionIds]) > 0
  )] | order(year desc)[0...1] {
    _id,
    _type,
    title,
    slug,
    hero {
      image,
      caption
    },
    year,
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
    }
  },
  "events": *[_type == "event" && (
    region._ref in $regionIds ||
    count(partners[@.sector._ref in $sectorIds]) > 0
  ) && start > now()] | order(start asc)[0...1] {
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
    hero {
      image,
      caption
    }
  }
}`
