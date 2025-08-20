# Energy Nexus Latest Articles System

## Overview
The Latest Articles system displays the top 7 most recent articles from your Sanity CMS in a responsive carousel format, similar to the design shown in your reference images. The system automatically fetches articles ordered by publication date and presents them in an engaging card layout.

## Features

### 🎯 **Core Functionality**
- **Top 7 Articles**: Automatically fetches the 7 most recent articles by publication date
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Carousel Navigation**: Left/right arrows for browsing through articles
- **Article Cards**: Beautiful card design with images, categories, titles, and descriptions

### 🎨 **Design Elements**
- **Brand Colors**: Uses your defined color scheme (`bg-brand-blue`, `text-brand-blue`)
- **Category Tags**: Shows article sectors in red uppercase text
- **Article Images**: Hero images with fallback placeholders
- **Hover Effects**: Smooth transitions and scale effects on hover
- **CTA Buttons**: "VIEW MORE" buttons with brand styling

### 📱 **Responsive Behavior**
- **Desktop**: 3 articles per row with navigation arrows
- **Tablet**: 2 articles per row
- **Mobile**: 1 article per row, stacked layout

## Components

### LatestArticles Component
The main component that:
- Fetches articles using the `useLatestArticles` hook
- Displays articles in a responsive grid
- Handles carousel navigation
- Shows loading states and error handling

#### Key Features:
- **Loading State**: Skeleton loading animation
- **Error Handling**: Graceful fallback if no articles
- **Navigation**: Arrow buttons for carousel control
- **Responsive Grid**: Adapts to different screen sizes

## Hooks

### useLatestArticles()
Fetches the top 7 latest articles from Sanity CMS.

**Returns:**
- `articles`: Array of article objects
- `loading`: Boolean loading state
- `error`: Error message if any

### useFeaturedArticles()
Fetches featured articles (alternative hook for different use cases).

## Queries

### getTop7LatestArticles
GROQ query that fetches the 7 most recent articles:
```groq
*[_type == "article" && defined(publishedAt)] | order(publishedAt desc)[0...7] {
  // Article fields
}
```

## Article Data Structure

Each article object contains:
```typescript
interface Article {
  _id: string
  title: string
  slug: { current: string }
  dek?: string
  publishedAt?: string
  hero?: {
    image?: any
    caption?: string
    credit?: string
  }
  sectors?: Array<{
    _id: string
    title: string
    slug: string
  }>
  authors?: Array<{
    _id: string
    name: string
    headshot?: any
  }>
  // ... other fields
}
```

## Utility Functions

### getArticleUrl(article: Article)
Returns the URL for an article: `/articles/${article.slug.current}`

### getPrimarySector(article: Article)
Returns the first sector as uppercase category text

### formatDate(dateString: string)
Formats publication date in a readable format

## Styling

### Brand Colors Used
- **Primary Blue**: `bg-brand-blue` (#262262) - Section header underline, category text
- **Vibrant Blue**: `bg-vibrant-blue` (#635DFF) - CTA buttons
- **Dark Neutral**: `text-dark-neutral` (#1E212A) - Article titles
- **Muted Slate**: `text-muted-slate` (#65676E) - Descriptions and dates

### Card Design
- **White Background**: Clean, modern card design
- **Shadow**: Subtle shadow for depth
- **Rounded Corners**: Modern rounded design
- **Hover Effects**: Scale transform on hover

## Usage Examples

### Basic Implementation
```tsx
import LatestArticles from '@/components/latest-articles'

function HomePage() {
  return (
    <div>
      <LatestArticles />
    </div>
  )
}
```

### Custom Styling
```tsx
<section className="py-16 bg-light-gray">
  <LatestArticles />
</section>
```

## Sanity Studio Setup

### 1. Create Articles
In your Sanity Studio:
- Create articles with compelling titles
- Add hero images for visual appeal
- Assign sectors/categories
- Set publication dates

### 2. Article Fields
Ensure articles have:
- **Title**: Main article headline
- **Slug**: URL-friendly identifier
- **Hero Image**: Featured image
- **Sectors**: Categories for display
- **Published Date**: For ordering
- **Description**: Brief summary

### 3. Content Strategy
- Keep titles concise and engaging
- Use high-quality hero images
- Write compelling descriptions
- Assign relevant sectors

## Performance Optimizations

### Image Optimization
- Uses Sanity's image optimization
- Responsive image sizes
- Lazy loading for better performance

### Data Fetching
- Efficient GROQ queries
- Client-side caching
- Error boundaries for reliability

## Integration with Existing System

### With Banner System
- Banners show featured content
- Latest Articles show recent content
- Complementary content strategies

### With Ads System
- Articles and ads can coexist
- Different content types
- Separate management in Sanity

## Customization Options

### Styling Customization
- Modify colors in Tailwind config
- Adjust card layouts
- Change typography styles

### Content Customization
- Change number of articles displayed
- Modify sorting criteria
- Add additional article metadata

### Layout Customization
- Adjust grid columns
- Modify spacing
- Change card dimensions

## Best Practices

### Content Management
- Keep articles up to date
- Use consistent image sizes
- Write engaging descriptions
- Assign proper categories

### Performance
- Optimize images for web
- Use appropriate image sizes
- Monitor loading times
- Test on different devices

### Accessibility
- Ensure proper contrast ratios
- Add alt text to images
- Use semantic HTML
- Test keyboard navigation

## Future Enhancements

### Planned Features
- Auto-advancing carousel
- Article filtering by category
- Search functionality
- Article analytics
- Social sharing buttons

### Integration Possibilities
- Email newsletter integration
- Social media feeds
- Related articles
- Article recommendations
- User engagement tracking
