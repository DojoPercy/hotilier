# Sanity CMS Setup for Energy Nexus

## Overview
This project uses Sanity CMS v3 for content management. The schema has been configured to support a business publication with the following content types:

### Content Types
- **Articles** - Standard articles with rich text content
- **Interviews** - Interview content with interviewee information
- **Videos** - Video content with platform integration
- **Press/Media** - External media coverage
- **Special Reports** - PDF reports and summaries
- **Publications** - Magazine issues with table of contents
- **Events** - Conference, summit, and event management

### Taxonomies
- **Sectors** - Business sectors (Energy, Finance, etc.)
- **Regions** - Geographic regions
- **Tags** - General tagging system

### Entities
- **Organizations** - Companies and institutions
- **People** - Interviewees and subjects
- **Authors** - Content contributors
- **Partners** - Event and publication partners

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @sanity/image-url @portabletext/react
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory with:
```
SANITY_PROJECT_ID=zgs7rdoe
SANITY_DATASET=production
SANITY_API_VERSION=2024-03-18
SANITY_API_TOKEN=your_sanity_api_token_here
```

### 3. Get Sanity API Token
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to API section
4. Create a new token with read permissions
5. Add the token to your `.env.local` file

### 4. Access Sanity Studio
- Development: `http://localhost:3000/admin`
- The studio is configured at the `/admin` route

## Schema Structure

### Shared Components
- **SEO** - Meta tags, Open Graph, and indexing settings
- **Hero Media** - Featured images with captions and credits
- **Rich Block** - Portable text with images and embeds

### Base Content Fields
All content types include:
- Title and slug
- Deck/standfirst
- Hero media
- Publication dates
- Authors
- Taxonomies (sectors, regions, tags)
- Year classification
- SEO settings
- Featured and paywall flags

## Usage

### Querying Content
Use the pre-built queries in `src/sanity/lib/queries.ts`:

```typescript
import { client, getAllArticles, getArticleBySlug } from '@/sanity/lib'

// Get all articles
const articles = await client.fetch(getAllArticles)

// Get specific article
const article = await client.fetch(getArticleBySlug, { slug: 'article-slug' })
```

### Image Handling
Use the image utilities in `src/sanity/lib/image.ts`:

```typescript
import { urlFor, getImageUrl } from '@/sanity/lib'

// Get optimized image URL
const imageUrl = getImageUrl(article.hero.image, 800, 600)
```

### Rich Text Rendering
Use the portable text component:

```typescript
import { PortableTextComponent } from '@/sanity/lib'

// Render rich text content
<PortableTextComponent value={article.body} />
```

## Content Workflow

### 1. Create Taxonomies First
- Create sectors, regions, and tags
- These will be available for content categorization

### 2. Create Entities
- Add organizations, people, and authors
- These can be referenced in content

### 3. Create Content
- Start with articles and interviews
- Use the rich text editor for content
- Add appropriate taxonomies and references

### 4. Create Publications
- Group articles and interviews into publications
- Add table of contents

### 5. Create Events
- Add upcoming events and conferences
- Link to partners and regions

## Customization

### Adding New Content Types
1. Define the schema in `src/sanity/schemas/index.ts`
2. Add to the default export array
3. Create corresponding queries in `queries.ts`

### Modifying Existing Types
- Edit the schema definitions
- Update queries as needed
- The changes will be reflected in the studio immediately

## Notes
- Countries have been removed from the schema as requested
- Shop/commerce functionality has been removed
- The schema is optimized for a business publication workflow
- All content types support SEO and social sharing
- Rich text supports images, embeds, and custom formatting
