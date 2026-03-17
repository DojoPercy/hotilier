import { client } from '@/sanity/lib/client'
import { getAppointmentBySlug } from '@/sanity/lib/queries'
import { PortableText } from '@/sanity/lib/portableText'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Appointment - Hotelier Africa',
  description: 'Executive appointment details',
}

interface AppointmentDetailProps {
  params: { slug: string }
}

interface Appointment {
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
  person?: {
    name: string
    headshot?: any
    bio?: string
  }
  position: string
  organization: {
    name: string
  }
  previousPosition?: string
  previousOrganization?: {
    name: string
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

async function getAppointment(slug: string): Promise<Appointment | null> {
  const appointment = await client.fetch(getAppointmentBySlug, { slug })
  return appointment
}

export async function generateMetadata({ params }: AppointmentDetailProps): Promise<Metadata> {
  const appointment = await getAppointment(params.slug)
  
  return {
    title: appointment?.seo?.title || appointment?.title || 'Appointment',
    description: appointment?.seo?.description || appointment?.dek || 'Executive appointment details',
  }
}

export default async function AppointmentDetailPage({ params }: AppointmentDetailProps) {
  const appointment = await getAppointment(params.slug)

  if (!appointment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600 mb-6">This appointment could not be found.</p>
          <Link href="/appointments" className="text-brand-blue hover:text-blue-700 font-semibold">
            Back to Appointments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      {appointment.hero?.image && (
        <div className="relative w-full h-96 bg-gray-100">
          <Image
            src={appointment.hero.image.asset.url}
            alt={appointment.title}
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
            href="/appointments"
            className="inline-flex items-center text-brand-blue hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Appointments
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {appointment.title}
          </h1>

          {/* Person & Position */}
          {appointment.person && (
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
              {appointment.person.headshot && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={appointment.person.headshot.asset.url}
                    alt={appointment.person.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {appointment.person.name}
                </h2>
                <p className="text-lg text-brand-blue font-semibold mb-2">
                  {appointment.position}
                </p>
                {appointment.organization && (
                  <p className="text-gray-600">
                    {appointment.organization.name}
                  </p>
                )}
                {appointment.previousPosition && (
                  <p className="text-sm text-gray-500 mt-2">
                    Previously: {appointment.previousPosition}
                    {appointment.previousOrganization && ` at ${appointment.previousOrganization.name}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {appointment.dek && (
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {appointment.dek}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {appointment.publishedAt && (
              <span>
                Published {new Date(appointment.publishedAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {appointment.authors && appointment.authors.length > 0 && (
              <span>By {appointment.authors.map(a => a.name).join(', ')}</span>
            )}
          </div>
        </div>

        {/* Body Content */}
        {appointment.body && (
          <div className="prose prose-lg max-w-none mb-16">
            <PortableText value={appointment.body} />
          </div>
        )}

        {/* Taxonomies */}
        {(appointment.sectors?.length || appointment.regions?.length || appointment.tags?.length) && (
          <div className="border-t border-gray-200 pt-12">
            {appointment.sectors && appointment.sectors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {appointment.sectors.map(sector => (
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

            {appointment.regions && appointment.regions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Regions</h3>
                <div className="flex flex-wrap gap-2">
                  {appointment.regions.map(region => (
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

            {appointment.tags && appointment.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {appointment.tags.map(tag => (
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
