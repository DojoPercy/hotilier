# Energy Nexus Banner System

## Overview
The Energy Nexus banner system allows you to create content-driven banners by selecting specific articles from your Sanity CMS. These banners display article content with customizable styling, similar to the EU-GCC Relations banner example you provided.

## Schema Structure

### Banner Schema
The main banner document with the following fields:

#### Basic Information
- `title` - Internal name for the banner
- `isActive` - Whether the banner is currently active
- `priority` - Priority order (1-10, higher numbers show first)
- `bannerType` - Type of banner (hero, category, featured)

#### Content Selection
- `selectedArticle` - **Required** - The article to feature in this banner
- `customTitle` - Override the article title (optional)
- `customSubtitle` - Custom subtitle or category text (e.g., "ECONOMY")
- `ctaText` - Call-to-action button text (default: "VIEW MORE")

#### Visual Customization
- `backgroundImage` - Custom background image (optional - falls back to article hero image)
- `backgroundImageMobile` - Mobile-specific background image (optional)
- `overlayColor` - Color of the text overlay box (white, black, transparent)
- `textColor` - Color of the main text (black, white, red, blue)
- `categoryColor` - Color of the category/tag text (red, blue, green, orange)
- `ctaButtonColor` - Color of the CTA button (red, blue, green, orange)
- `position` - Position of the text overlay (left, center, right)
- `showCategory` - Show the category/tag text

## Components

### MainHero Component
A responsive banner component that:
- Fetches the highest priority hero banner from Sanity
- Displays the selected article with customizable styling
- Automatically detects device type and shows appropriate images
- Supports different overlay positions and colors
- Links directly to the selected article

#### Features
- **Article Selection** - Choose any article from your CMS
- **Custom Styling** - Control colors, positioning, and text
- **Responsive Design** - Works on desktop and mobile
- **Fallback Images** - Uses article hero image if no custom background
- **Category Display** - Shows article sector as category tag

## Hooks

### useSingleHeroBanner()
Fetches the highest priority active hero banner.

### useHeroBanners()
Fetches all active hero banners.

### useBannersByType(bannerType: string)
Fetches banners by specific type.

## Queries

### Base Queries
- `getHeroBanners` - Get all hero banners
- `getBannersByType` - Get banners by type
- `getSingleHeroBanner` - Get the highest priority hero banner
- `getCategoryBanners` - Get category banners
- `getFeaturedBanners` - Get featured banners

### Utility Queries
- `getBannerById` - Get banner by ID
- `getBannersByArticle` - Get banners featuring a specific article
- `getBannersBySector` - Get banners by article sector
- `getBannersByRegion` - Get banners by article region

## Usage Examples

### Basic Hero Banner Implementation
```tsx
import { useSingleHeroBanner } from '@/hooks/useBanners'
import MainHero from '@/components/main_hero'

function HomePage() {
  return <MainHero />
}
```

### Custom Banner Component
```tsx
import { useBannersByType } from '@/hooks/useBanners'

function CategoryPage() {
  const { banners, loading } = useBannersByType('category')

  if (loading || !banners.length) return null

  return (
    <div>
      {banners.map(banner => (
        <BannerComponent key={banner._id} banner={banner} />
      ))}
    </div>
  )
}
```

## Sanity Studio Setup

### 1. Create Articles
First, create articles in your Sanity Studio that you want to feature in banners.

### 2. Create Banners
Create banners with:
- Select an article from the dropdown
- Choose banner type (hero, category, featured)
- Customize styling options
- Set priority and active status

### 3. Configure Display
- Set overlay position (left, center, right)
- Choose colors for text, category, and button
- Add custom background images if needed
- Configure mobile-specific images

## Banner Types

### Hero Banner
- Main homepage banner
- Highest priority display
- Full-width with large text overlay
- Links to featured article

### Category Banner
- Used on category/sector pages
- Shows articles from specific sectors
- Smaller, more focused design

### Featured Banner
- Highlights special content
- Can be used in sidebars or content areas
- Flexible positioning options

## Styling Options

### Colors
- **Text Colors**: Black, White, Red, Blue
- **Category Colors**: Red, Blue, Green, Orange
- **Button Colors**: Red, Blue, Green, Orange
- **Overlay Colors**: White, Black, Transparent

### Positions
- **Left**: Text overlay on the left side
- **Center**: Text overlay in the center
- **Right**: Text overlay on the right side

### Responsive Behavior
- Automatically detects mobile devices
- Shows mobile-specific background images
- Adjusts text size and positioning
- Maintains readability on all screen sizes

## Best Practices

### Content Selection
- Choose articles with compelling headlines
- Ensure articles have good hero images
- Consider article relevance to your audience
- Use articles with clear categories/sectors

### Visual Design
- Ensure good contrast between text and background
- Use appropriate colors for your brand
- Test readability on different devices
- Keep text concise and impactful

### Performance
- Optimize background images for web
- Use appropriate image sizes for different devices
- Consider loading times for banner images
- Test banner performance regularly

## Integration with Existing System

### With Ads System
- Banners and ads can coexist
- Banners show content, ads show promotions
- Different placement strategies
- Separate management in Sanity Studio

### With Articles
- Banners automatically link to articles
- Article metadata is displayed
- Categories are pulled from article sectors
- Hero images are used as fallbacks

## Future Enhancements

### Planned Features
- A/B testing for banners
- Scheduled banner rotation
- Advanced targeting options
- Performance analytics
- Banner templates
- Multi-language support

### Integration Possibilities
- Email newsletter banners
- Social media preview banners
- Print publication banners
- Event-specific banners
