// Banner-related GROQ queries for the Energy Nexus project

// Base banner fields
export const bannerFields = `
  _id,
  _type,
  title,
  isActive,
  priority,
  bannerType,
  customTitle,
  customSubtitle,
  ctaText,
  backgroundImage,
  backgroundImageMobile,
  overlayColor,
  textColor,
  categoryColor,
  ctaButtonColor,
  position,
  showCategory,
  notes,
  selectedArticle-> {
    _id,
    title,
    slug,
    dek,
    hero {
      image,
      caption,
      credit
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
    },
    publishedAt,
    authors[]-> {
      _id,
      name,
      headshot
    }
  }
`

// Get all active banners
export const getAllActiveBanners = `*[_type == "banner" && isActive == true] | order(priority desc) {
  ${bannerFields}
}`

// Get banners by type
export const getBannersByType = `*[_type == "banner" && isActive == true && bannerType == $bannerType] | order(priority desc) {
  ${bannerFields}
}`

// Get hero banners specifically
export const getHeroBanners = `*[_type == "banner" && isActive == true && bannerType == "hero"] | order(priority desc) {
  ${bannerFields}
}`

// Get category banners
export const getCategoryBanners = `*[_type == "banner" && isActive == true && bannerType == "category"] | order(priority desc) {
  ${bannerFields}
}`

// Get featured banners
export const getFeaturedBanners = `*[_type == "banner" && isActive == true && bannerType == "featured"] | order(priority desc) {
  ${bannerFields}
}`

// Get banner by ID
export const getBannerById = `*[_type == "banner" && _id == $bannerId][0] {
  ${bannerFields}
}`

// Get banners by article
export const getBannersByArticle = `*[_type == "banner" && isActive == true && selectedArticle._ref == $articleId] | order(priority desc) {
  ${bannerFields}
}`

// Get banners by sector
export const getBannersBySector = `*[_type == "banner" && isActive == true && $sectorId in selectedArticle->sectors[]._ref] | order(priority desc) {
  ${bannerFields}
}`

// Get banners by region
export const getBannersByRegion = `*[_type == "banner" && isActive == true && $regionId in selectedArticle->regions[]._ref] | order(priority desc) {
  ${bannerFields}
}`

// Get single hero banner (for homepage)
export const getSingleHeroBanner = `*[_type == "banner" && isActive == true && bannerType == "hero"] | order(priority desc)[0] {
  ${bannerFields}
}`

// Get banners with custom background images
export const getBannersWithCustomBackground = `*[_type == "banner" && isActive == true && defined(backgroundImage)] | order(priority desc) {
  ${bannerFields}
}`

// Get banners with mobile-specific images
export const getBannersWithMobileImages = `*[_type == "banner" && isActive == true && defined(backgroundImageMobile)] | order(priority desc) {
  ${bannerFields}
}`
