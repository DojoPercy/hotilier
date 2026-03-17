import { client } from '@/sanity/lib/client'
import { getNewOpeningBySlug } from '@/sanity/lib/queries'
import { PortableTextComponent } from '@/sanity/lib/portableText'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'


interface NewOpeningDetailProps {
  params: { slug: string }
}

interface NewOpening {
  _id: string
  title: string
  slug: { current: string }
  dek: string
  body?: any
  publishedAt: string
  hero: {
    image: any
    caption?: string
  }
  property?: {
    name: string
    logo?: any
  }
  location: string
  region?: {
    title: string
    slug: { current: string }
  }
  category: string
  investmentValue?: string
  estimatedOpening?: string
  sectors?: Array<{ title: string; slug: { current: string } }>
  regions?: Array<{ title: string; slug: { current: string } }>
  tags?: Array<{ title: string; slug: { current: string } }>
  authors?: Array<{ name: string }>
  seo?: {
    title?: string
    description?: string
  }
}

async function getNewOpening(slug: string): Promise<NewOpening | null> {
  const opening = await client.fetch(getNewOpeningBySlug, { slug })
  return opening
}

export async function generateMetadata({ params }: NewOpeningDetailProps): Promise<Metadata> {
  const opening = await getNewOpening(params.slug)
  
  return {
    title: opening?.seo?.title || opening?.title || 'New Opening',
    description: opening?.seo?.description || opening?.dek || 'Hotel opening details',
  }
}

export default async function NewOpeningDetailPage({ params }: NewOpeningDetailProps) {
  const opening = await getNewOpening(params.slug)

  if (!opening) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600 mb-6">This new opening could not be found.</p>
          <Link href="/new-openings" className="text-brand-blue hover:text-blue-700 font-semibold">
            Back to New Openings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      {opening.hero?.image && (
        <div className="relative w-full h-96 bg-gray-100">
          <Image
            src={opening.hero.image.asset.url}
            alt={opening.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/new-openings"
            className="inline-flex items-center text-brand-blue hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to New Openings
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {opening.title}
          </h1>

          {/* Location Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">LOCATION</h3>
                <p className="text-2xl font-bold text-gray-900">📍 {opening.location}</p>
                {opening.region && (
                  <p className="text-gray-600 mt-1">{opening.region.title}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">PROPERTY CATEGORY</h3>
                <div className="inline-block bg-brand-blue text-white text-lg font-semibold px-4 py-2 rounded">
                  {opening.category}
                </div>
              </div>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
            {opening.investmentValue && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">INVESTMENT VALUE</h4>
                <p className="text-xl font-bold text-brand-blue">
                  {opening.investmentValue}
                </p>
              </div>
            )}

            {opening.estimatedOpening && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">ESTIMATED OPENING</h4>
                <p className="text-xl font-bold text-brand-blue">
                  {opening.estimatedOpening}
                </p>
              </div>
            )}

            {opening.publishedAt && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">POSTED</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(opening.publishedAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Lead/Summary */}
          {opening.dek && (
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {opening.dek}
            </p>
          )}
        </div>

        {/* Body Content */}
        {opening.body && (
          <div className="prose prose-lg max-w-none mb-16">
            <PortableTextComponent value={opening.body} />
          </div>
        )}

        {/* Taxonomies */}
        {(opening.sectors?.length || opening.regions?.length || opening.tags?.length) && (
          <div className="border-t border-gray-200 pt-12">
            {opening.sectors && opening.sectors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {opening.sectors.map(sector => (
                    <Link
                      key={sector.slug.current}
                      href={`/sectors/${sector.slug.current}`}
                      className="inline-block bg-blue-50 text-brand-blue px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      {sector.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {opening.regions && opening.regions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Regions</h3>
                <div className="flex flex-wrap gap-2">
                  {opening.regions.map(region => (
                    <span
                      key={region.slug.current}
                      className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded"
                    >
                      {region.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {opening.tags && opening.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {opening.tags.map(tag => (
                    <Link
                      key={tag.slug.current}
                      href={`/tags/${tag.slug.current}`}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      #{tag.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
