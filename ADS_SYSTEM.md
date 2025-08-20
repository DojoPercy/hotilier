# Energy Nexus Ads System

## Overview
The Energy Nexus ads system is built on Sanity CMS and provides a comprehensive solution for managing advertisements across the website. The system supports responsive ads, targeting, scheduling, and performance tracking.

## Schema Structure

### 1. Ad Types (`adType`)
Defines the different types of ads available:
- **Hero Ad** - Main banner ads on homepage
- **Sidebar Ad** - Sidebar advertisements
- **Banner Ad** - Standard banner ads
- **Article Ad** - In-article advertisements
- **Footer Ad** - Footer advertisements
- **Popup Ad** - Popup/modal advertisements
- **Newsletter Ad** - Newsletter-specific ads

### 2. Advertisement (`ad`)
The main ad document with the following fields:

#### Basic Information
- `title` - Internal name for the ad
- `adType` - Type of advertisement
- `client` - Client or advertiser name
- `campaign` - Campaign identifier

#### Scheduling
- `startDate` - When the ad should start showing
- `endDate` - When the ad should stop showing
- `isActive` - Whether the ad is currently active
- `priority` - Priority order (1-10, higher numbers show first)

#### Content
- `targetUrl` - Where the ad should link to
- `desktopImage` - Image for desktop devices
- `mobileImage` - Image for mobile devices
- `altText` - Alt text for accessibility

#### Targeting
- `targeting.regions` - Target specific regions
- `targeting.sectors` - Target specific business sectors
- `targeting.userTypes` - Target user types (guest, subscriber, premium)
- `targeting.deviceTypes` - Target device types (desktop, mobile, tablet)

#### Tracking & Limits
- `trackingCode` - Analytics or tracking code
- `impressionLimit` - Maximum impressions (0 = unlimited)
- `clickLimit` - Maximum clicks (0 = unlimited)

### 3. Ad Placement (`adPlacement`)
Manages where ads appear on the website:

- `name` - Placement name (e.g., "Homepage Hero")
- `location` - Where this placement appears
- `adType` - Type of ads for this placement
- `ads` - Array of ads that can appear here
- `displaySettings` - Display configuration

#### Display Settings
- `showOnDesktop` - Show on desktop devices
- `showOnMobile` - Show on mobile devices
- `showOnTablet` - Show on tablet devices
- `maxAdsToShow` - Maximum number of ads to display
- `rotationInterval` - Rotation interval in milliseconds
- `fadeTransition` - Use fade transitions

### 4. Ad Performance (`adPerformance`)
Tracks ad performance metrics:

- `ad` - Reference to the ad
- `date` - Date of performance data
- `impressions` - Number of impressions
- `clicks` - Number of clicks
- `deviceType` - Device type for tracking
- `userType` - User type for tracking

## Components

### AdSlideshow Component
A responsive slideshow component that:
- Automatically detects device type (desktop/mobile)
- Renders appropriate images for each device
- Supports fade transitions
- Includes navigation controls and indicators
- Handles ad clicks and tracking
- Supports auto-play with configurable intervals

#### Props
```typescript
interface AdSlideshowProps {
  ads: Ad[]
  placementName?: string
  className?: string
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showControls?: boolean
  fadeTransition?: boolean
}
```

### HeroAds Component
A wrapper component that:
- Fetches hero ads from Sanity
- Handles loading and error states
- Renders the AdSlideshow with hero-specific settings

## Hooks

### useHeroAds()
Fetches all active hero ads from Sanity.

### useAdsByType(adType: string)
Fetches ads by specific type.

### useAdPlacement(placementName: string)
Fetches ads for a specific placement with display settings.

## Queries

### Base Queries
- `getAllActiveAds` - Get all active ads
- `getAdsByType` - Get ads by type
- `getHeroAds` - Get hero ads specifically
- `getAdsWithDateFilter` - Get ads with date filtering

### Targeting Queries
- `getAdsByDeviceType` - Filter by device type
- `getAdsByUserType` - Filter by user type
- `getAdsByRegion` - Filter by region
- `getAdsBySector` - Filter by sector

### Placement Queries
- `getAdsForPlacement` - Get ads for specific placement
- `getAdPlacementSettings` - Get placement display settings
- `getAllAdPlacements` - Get all ad placements

### Performance Queries
- `getAdPerformance` - Get performance data for an ad
- `getAdPerformanceSummary` - Get performance summary

## Usage Examples

### Basic Hero Ads Implementation
```tsx
import { useHeroAds } from '@/hooks/useAds'
import AdSlideshow from '@/components/AdSlideshow'

function HomePage() {
  const { ads, loading, error } = useHeroAds()

  if (loading) return <div>Loading...</div>
  if (error) return null
  if (!ads.length) return null

  return (
    <AdSlideshow
      ads={ads}
      placementName="hero"
      autoPlay={true}
      interval={5000}
    />
  )
}
```

### Custom Ad Placement
```tsx
import { useAdPlacement } from '@/hooks/useAds'

function Sidebar() {
  const { placement, loading } = useAdPlacement('sidebar')

  if (loading || !placement) return null

  return (
    <AdSlideshow
      ads={placement.ads}
      placementName={placement.name}
      interval={placement.displaySettings.rotationInterval}
      fadeTransition={placement.displaySettings.fadeTransition}
    />
  )
}
```

## Sanity Studio Setup

### 1. Create Ad Types
First, create the ad type definitions in Sanity Studio.

### 2. Create Advertisements
Create ads with:
- Desktop and mobile images
- Targeting settings
- Scheduling information
- Tracking codes

### 3. Create Ad Placements
Set up placements for different areas of the website.

### 4. Assign Ads to Placements
Link ads to their appropriate placements.

## Best Practices

### Image Optimization
- Use appropriate image sizes for desktop and mobile
- Optimize images for web (WebP format recommended)
- Include proper alt text for accessibility

### Targeting
- Use targeting to show relevant ads to users
- Consider user type, device, and location
- Test targeting rules thoroughly

### Performance
- Monitor ad performance regularly
- Set appropriate impression and click limits
- Use tracking codes for analytics

### User Experience
- Don't overwhelm users with too many ads
- Ensure ads are clearly marked as advertisements
- Respect user preferences and privacy

## Future Enhancements

### Planned Features
- A/B testing for ads
- Advanced targeting options
- Real-time performance dashboards
- Ad revenue tracking
- User preference management
- GDPR compliance tools

### Integration Possibilities
- Google AdSense integration
- Facebook Pixel integration
- Custom analytics platforms
- Email marketing integration
