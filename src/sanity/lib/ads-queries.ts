// Ad-related GROQ queries for the Energy Nexus project

// Base ad fields
export const adFields = `
  _id,
  _type,
  title,
  adType,
  client,
  campaign,
  startDate,
  endDate,
  isActive,
  priority,
  targetUrl,
  desktopImage,
  mobileImage,
  altText,
  trackingCode,
  impressionLimit,
  clickLimit,
  targeting {
    regions[]-> {
      _id,
      title,
      slug
    },
    sectors[]-> {
      _id,
      title,
      slug
    },
    userTypes,
    deviceTypes
  },
  notes
`

// Get all active ads
export const getAllActiveAds = `*[_type == "ad" && isActive == true] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads by type
export const getAdsByType = `*[_type == "ad" && isActive == true && adType == $adType] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads for specific placement
export const getAdsForPlacement = `*[_type == "adPlacement" && name == $placementName && isActive == true][0] {
  _id,
  name,
  location,
  adType,
  displaySettings,
  ads[]-> {
    ${adFields}
  }
}`

// Get hero ads specifically
export const getHeroAds = `*[_type == "ad" && isActive == true && adType == "hero"] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get sidebar ads specifically
export const getSidebarAds = `*[_type == "ad" && isActive == true && adType == "sidebar"] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads with date filtering
export const getAdsWithDateFilter = `*[_type == "ad" && isActive == true && 
  (startDate <= now() || !defined(startDate)) && 
  (endDate >= now() || !defined(endDate))
] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads by device type
export const getAdsByDeviceType = `*[_type == "ad" && isActive == true && 
  (count(targeting.deviceTypes) == 0 || $deviceType in targeting.deviceTypes)
] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads by user type
export const getAdsByUserType = `*[_type == "ad" && isActive == true && 
  (count(targeting.userTypes) == 0 || $userType in targeting.userTypes)
] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads by region
export const getAdsByRegion = `*[_type == "ad" && isActive == true && 
  (count(targeting.regions) == 0 || $regionId in targeting.regions[]._ref)
] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ads by sector
export const getAdsBySector = `*[_type == "ad" && isActive == true && 
  (count(targeting.sectors) == 0 || $sectorId in targeting.sectors[]._ref)
] | order(priority desc, startDate desc) {
  ${adFields}
}`

// Get ad placement settings
export const getAdPlacementSettings = `*[_type == "adPlacement" && name == $placementName && isActive == true][0] {
  _id,
  name,
  location,
  adType,
  displaySettings {
    showOnDesktop,
    showOnMobile,
    showOnTablet,
    maxAdsToShow,
    rotationInterval,
    fadeTransition
  }
}`

// Get all ad placements
export const getAllAdPlacements = `*[_type == "adPlacement" && isActive == true] | order(name asc) {
  _id,
  name,
  location,
  adType,
  displaySettings,
  ads[]-> {
    _id,
    title,
    adType,
    isActive
  }
}`

// Get ad performance data
export const getAdPerformance = `*[_type == "adPerformance" && ad._ref == $adId] | order(date desc) {
  _id,
  date,
  impressions,
  clicks,
  deviceType,
  userType
}`

// Get ad performance summary
export const getAdPerformanceSummary = `*[_type == "adPerformance" && ad._ref == $adId] {
  date,
  impressions,
  clicks
} | {
  totalImpressions: sum(impressions),
  totalClicks: sum(clicks),
  ctr: round(sum(clicks) / sum(impressions) * 100, 2)
}[0]`
