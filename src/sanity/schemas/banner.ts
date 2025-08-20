import { defineType, defineField } from 'sanity'

// Banner Schema
export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      type: 'string', 
      validation: r => r.required(),
      description: 'Internal name for this banner'
    }),
    defineField({ 
      name: 'isActive', 
      type: 'boolean', 
      initialValue: true,
      description: 'Whether this banner is currently active'
    }),
    defineField({ 
      name: 'priority', 
      type: 'number', 
      initialValue: 1,
      description: 'Priority order (higher numbers show first)',
      validation: r => r.min(1).max(10)
    }),
    defineField({ 
      name: 'selectedArticle', 
      type: 'reference', 
      to: [{ type: 'article' }],
      validation: r => r.required(),
      description: 'The article to feature in this banner'
    }),
    defineField({ 
      name: 'bannerType', 
      type: 'string',
      options: {
        list: [
          { title: 'Hero Banner', value: 'hero' },
          { title: 'Category Banner', value: 'category' },
          { title: 'Featured Banner', value: 'featured' },
        ],
        layout: 'dropdown'
      },
      initialValue: 'hero',
      validation: r => r.required()
    }),
    defineField({ 
      name: 'customTitle', 
      type: 'string',
      description: 'Override the article title (optional)'
    }),
    defineField({ 
      name: 'customSubtitle', 
      type: 'string',
      description: 'Custom subtitle or category text (e.g., "ECONOMY")'
    }),
    defineField({ 
      name: 'ctaText', 
      type: 'string',
      initialValue: 'VIEW MORE',
      description: 'Call-to-action button text'
    }),
    defineField({ 
      name: 'backgroundImage', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Background image for the banner (optional - will use article hero image if not provided)'
    }),
    defineField({ 
      name: 'backgroundImageMobile', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Mobile-specific background image (optional)'
    }),
    defineField({ 
      name: 'overlayColor', 
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Black', value: 'black' },
          { title: 'Transparent', value: 'transparent' },
        ]
      },
      initialValue: 'white',
      description: 'Color of the text overlay box'
    }),
    defineField({ 
      name: 'textColor', 
      type: 'string',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Red', value: 'red' },
          { title: 'Blue', value: 'blue' },
        ]
      },
      initialValue: 'black',
      description: 'Color of the main text'
    }),
    defineField({ 
      name: 'categoryColor', 
      type: 'string',
      options: {
        list: [
          { title: 'Red', value: 'red' },
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Orange', value: 'orange' },
        ]
      },
      initialValue: 'red',
      description: 'Color of the category/tag text'
    }),
    defineField({ 
      name: 'ctaButtonColor', 
      type: 'string',
      options: {
        list: [
          { title: 'Red', value: 'red' },
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Orange', value: 'orange' },
        ]
      },
      initialValue: 'red',
      description: 'Color of the CTA button'
    }),
    defineField({ 
      name: 'position', 
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ]
      },
      initialValue: 'left',
      description: 'Position of the text overlay'
    }),
    defineField({ 
      name: 'showCategory', 
      type: 'boolean', 
      initialValue: true,
      description: 'Show the category/tag text'
    }),
    defineField({ 
      name: 'notes', 
      type: 'text',
      description: 'Internal notes about this banner'
    })
  ],
  preview: {
    select: {
      title: 'title',
      article: 'selectedArticle.title',
      bannerType: 'bannerType',
      isActive: 'isActive',
      backgroundImage: 'backgroundImage'
    },
    prepare({ title, article, bannerType, isActive, backgroundImage }) {
      return {
        title: title || 'Untitled Banner',
        subtitle: `${article || 'No Article'} • ${bannerType} • ${isActive ? 'Active' : 'Inactive'}`,
        media: backgroundImage
      }
    }
  }
})

// Banner Placement Schema
export const bannerPlacement = defineType({
  name: 'bannerPlacement',
  title: 'Banner Placement',
  type: 'document',
  fields: [
    defineField({ 
      name: 'name', 
      type: 'string', 
      validation: r => r.required(),
      description: 'Name of the placement (e.g., "Homepage Hero", "Category Page")'
    }),
    defineField({ 
      name: 'location', 
      type: 'string',
      validation: r => r.required(),
      description: 'Where this placement appears'
    }),
    defineField({ 
      name: 'bannerType', 
      type: 'string',
      options: {
        list: [
          { title: 'Hero Banner', value: 'hero' },
          { title: 'Category Banner', value: 'category' },
          { title: 'Featured Banner', value: 'featured' },
          { title: 'Breaking News Banner', value: 'breaking' },
        ]
      },
      validation: r => r.required()
    }),
    defineField({ 
      name: 'banners', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'banner' }] }],
      description: 'Banners that can appear in this placement'
    }),
    defineField({ 
      name: 'isActive', 
      type: 'boolean', 
      initialValue: true
    }),
    defineField({ 
      name: 'displaySettings', 
      type: 'object',
      fields: [
        { name: 'showOnDesktop', type: 'boolean', initialValue: true },
        { name: 'showOnMobile', type: 'boolean', initialValue: true },
        { name: 'showOnTablet', type: 'boolean', initialValue: true },
        { name: 'maxBannersToShow', type: 'number', initialValue: 1 },
        { name: 'rotationInterval', type: 'number', initialValue: 0, description: 'Rotation interval in milliseconds (0 = no rotation)' },
        { name: 'fadeTransition', type: 'boolean', initialValue: true },
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      location: 'location',
      bannerType: 'bannerType',
      isActive: 'isActive'
    },
    prepare({ title, location, bannerType, isActive }) {
      return {
        title: title,
        subtitle: `${location} • ${bannerType} • ${isActive ? 'Active' : 'Inactive'}`
      }
    }
  }
})
