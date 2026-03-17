import { client } from '@/sanity/lib/client'
import { getAllNewOpenings } from '@/sanity/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Openings - Hotelier Africa',
  description: 'New hotel and hospitality property openings across Africa',
}

interface NewOpening {
  _id: string
  title: string
  slug: { current: string }
  dek: string
  publishedAt: string
  hero: {
    image: any
    caption?: string
  }
  property: {
    _id: string
    name: string
  }
  location: string
  region?: {
    title: string
    slug: { current: string }
  }
  category: string
  investmentValue?: string
  estimatedOpening?: string
}

async function getNewOpenings(): Promise<NewOpening[]> {
  const openings = await client.fetch(getAllNewOpenings)
  return openings
}

export default async function NewOpeningsPage() {
  const openings = await getNewOpenings()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            New Openings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the latest hotel, resort, and hospitality property openings across Africa
          </p>
        </div>

        {/* New Openings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {openings.length > 0 ? (
            openings.map((opening) => (
              <Link
                key={opening._id}
                href={`/new-openings/${opening.slug.current}`}
                className="group"
              >
                <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Hero Image */}
                  {opening.hero?.image && (
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={opening.hero.image.asset.url}
                        alt={opening.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    {opening.category && (
                      <div className="inline-block bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {opening.category}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
                      {opening.title}
                    </h3>

                    {/* Location & Region */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        📍 {opening.location}
                      </p>
                      {opening.region && (
                        <p className="text-sm text-gray-600">
                          {opening.region.title}
                        </p>
                      )}
                    </div>

                    {/* Investment Value */}
                    {opening.investmentValue && (
                      <p className="text-sm font-semibold text-brand-blue mb-2">
                        Investment: {opening.investmentValue}
                      </p>
                    )}

                    {/* Estimated Opening */}
                    {opening.estimatedOpening && (
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold">Opening:</span> {opening.estimatedOpening}
                      </p>
                    )}

                    {/* Lead/Summary */}
                    {opening.dek && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {opening.dek}
                      </p>
                    )}

                    {/* Date */}
                    {opening.publishedAt && (
                      <p className="text-xs text-gray-500 pt-3 border-t border-gray-200">
                        {new Date(opening.publishedAt).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No new openings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
