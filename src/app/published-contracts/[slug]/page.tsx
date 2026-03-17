import { client } from '@/sanity/lib/client'
import { getContractPublishingBySlug } from '@/sanity/lib/queries'
import { PortableTextComponent } from '@/sanity/lib/portableText'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'


interface ContractPublishingDetailProps {
  params: { slug: string }
}

interface ContractPublishing {
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
  client?: {
    name: string
    logo?: any
    website?: string
  }
  pdf?: {
    asset: {
      url: string
    }
  }
  sectors?: Array<{ title: string; slug: { current: string } }>
  regions?: Array<{ title: string; slug: { current: string } }>
  tags?: Array<{ title: string; slug: { current: string } }>
  authors?: Array<{ name: string }>
  seo?: {
    title?: string
    description?: string
  }
}

async function getContractPublishing(slug: string): Promise<ContractPublishing | null> {
  const content = await client.fetch(getContractPublishingBySlug, { slug })
  return content
}

export async function generateMetadata({ params }: ContractPublishingDetailProps): Promise<Metadata> {
  const content = await getContractPublishing(params.slug)
  
  return {
    title: content?.seo?.title || content?.title || 'Contract Publishing',
    description: content?.seo?.description || content?.dek || 'Partner content',
  }
}

export default async function ContractPublishingDetailPage({ params }: ContractPublishingDetailProps) {
  const content = await getContractPublishing(params.slug)

  if (!content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600 mb-6">This content could not be found.</p>
          <Link href="/published-contracts" className="text-brand-blue hover:text-blue-700 font-semibold">
            Back to Published Contracts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      {content.hero?.image && (
        <div className="relative w-full h-96 bg-gray-100">
          <Image
            src={content.hero.image.asset.url}
            alt={content.title}
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
            href="/published-contracts"
            className="inline-flex items-center text-brand-blue hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Published Contracts
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {content.title}
          </h1>

          {/* Client Info */}
          {content.client && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">PUBLISHED BY</h3>
              <div className="flex items-center gap-4">
                {content.client.logo && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={content.client.logo.asset.url}
                      alt={content.client.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {content.client.name}
                  </p>
                  {content.client.website && (
                    <a
                      href={content.client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-blue-700 text-sm"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PDF Download */}
          {content.pdf && (
            <div className="mb-8">
              <a
                href={content.pdf.asset.url}
                download
                className="inline-flex items-center bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Download PDF
              </a>
            </div>
          )}

          {/* Lead/Summary */}
          {content.dek && (
            <p className="text-xl text-gray-700 leading-relaxed mb-6 pb-6 border-b border-gray-200">
              {content.dek}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {content.publishedAt && (
              <span>
                Published {new Date(content.publishedAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {content.authors && content.authors.length > 0 && (
              <span>By {content.authors.map(a => a.name).join(', ')}</span>
            )}
          </div>
        </div>

        {/* Body Content */}
        {content.body && (
          <div className="prose prose-lg max-w-none mb-16">
            <PortableTextComponent value={content.body} />
          </div>
        )}

        {/* Taxonomies */}
        {(content.sectors?.length || content.regions?.length || content.tags?.length) && (
          <div className="border-t border-gray-200 pt-12">
            {content.sectors && content.sectors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {content.sectors.map(sector => (
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

            {content.regions && content.regions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Regions</h3>
                <div className="flex flex-wrap gap-2">
                  {content.regions.map(region => (
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

            {content.tags && content.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map(tag => (
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
