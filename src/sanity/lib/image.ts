import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Standard no-crop image
export function getImageUrl(image: any, width: number, height?: number) {
  if (!image) return null
  const builder = urlFor(image).width(width).auto('format')

  if (height) builder.height(height)

  return builder.fit('max').url()
}

// Responsive sizes without cropping
export function getResponsiveImageUrls(image: any, sizes: number[]) {
  if (!image) return null
  return sizes.map(size => ({
    width: size,
    url: urlFor(image)
      .width(size)
      .fit('max') // changed from 'crop' to 'max'
      .auto('format')
      .url()
  }))
}

// Explicit cropping using hotspot
export function getCroppedImageUrl(image: any, width: number, height: number) {
  if (!image) return null
  return urlFor(image)
    .width(width)
    .height(height)
    .fit('crop')
    .crop('focalpoint')
    .focalPoint(image.hotspot?.x || 0.5, image.hotspot?.y || 0.5)
    .auto('format')
    .url()
}
