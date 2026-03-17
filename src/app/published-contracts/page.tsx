import { client } from '@/sanity/lib/client'
import { getAllContractPublishing } from '@/sanity/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Published Contract Content - Hotelier Africa',
  description: 'Sponsored and partner content from industry organizations',
}

interface ContractPublishing {
  _id: string
  title: string
  slug: { current: string }
  dek: string
  publishedAt: string
  hero: {
    image: any
    caption?: string
  }
  client?: {
    name: string
    logo?: any
  }
  sectors?: Array<{
    title: string
    slug: { current: string }
  }>
  regions?: Array<{
    title: string
    slug: { current: string }
  }>
}

async function getContractPublishing(): Promise<ContractPublishing[]> {
  const content = await client.fetch(getAllContractPublishing)
  return content
}

export default async function PublishedContractPage() {
  const content = await getContractPublishing()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Published Partner Content
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Featured content and insights from our publishing partners
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.length > 0 ? (
            content.map((item) => (
              <Link
                key={item._id}
                href={`/published-contracts/${item.slug.current}`}
                className="group"
              >
                <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Hero Image */}
                    {item.hero?.image && (
                      <div className="relative h-48 md:h-auto md:w-1/3 bg-gray-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={item.hero.image.asset.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      {/* Client Badge */}
                      {item.client && (
                        <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-3 w-fit">
                          {item.client.logo && (
                            <div className="relative w-6 h-6 mr-2 flex-shrink-0">
                              <Image
                                src={item.client.logo.asset.url}
                                alt={item.client.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <span className="text-xs font-semibold text-gray-700">
                            {item.client.name}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
                        {item.title}
                      </h3>

                      {/* Lead/Summary */}
                      {item.dek && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {item.dek}
                        </p>
                      )}

                      {/* Sectors & Regions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.sectors?.slice(0, 2).map((sector) => (
                          <span
                            key={sector.slug.current}
                            className="inline-block text-xs bg-blue-50 text-brand-blue px-2 py-1 rounded"
                          >
                            {sector.title}
                          </span>
                        ))}
                        {item.regions?.slice(0, 1).map((region) => (
                          <span
                            key={region.slug.current}
                            className="inline-block text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                          >
                            {region.title}
                          </span>
                        ))}
                      </div>

                      {/* Date */}
                      {item.publishedAt && (
                        <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                          {new Date(item.publishedAt).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-6">No published contracts yet</p>
              <Link
                href="/contract-publishing"
                className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Interested in Publishing? Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
