import { client } from '@/sanity/lib/client'
import { getAllAppointments } from '@/sanity/lib/queries'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Appointments - Hotelier Africa',
  description: 'Latest executive appointments and role changes in Africa\'s hospitality industry',
}

interface Appointment {
  _id: string
  title: string
  slug: { current: string }
  dek: string
  publishedAt: string
  hero: {
    image: any
    caption?: string
  }
  person: {
    name: string
    headshot?: any
  }
  position: string
  organization: {
    name: string
    logo?: any
  }
  previousPosition?: string
  previousOrganization?: {
    name: string
  }
}

async function getAppointments(): Promise<Appointment[]> {
  const appointments = await client.fetch(getAllAppointments)
  return appointments
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Appointments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest executive appointments and role changes across Africa's hospitality industry
          </p>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Link
                key={appointment._id}
                href={`/appointments/${appointment.slug.current}`}
                className="group"
              >
                <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Hero Image */}
                  {appointment.hero?.image && (
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={appointment.hero.image.asset.url}
                        alt={appointment.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Person Name */}
                    {appointment.person && (
                      <p className="text-brand-blue font-semibold mb-2">
                        {appointment.person.name}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
                      {appointment.title}
                    </h3>

                    {/* Position & Organization */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Position:</span> {appointment.position}
                      </p>
                      {appointment.organization && (
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Organization:</span> {appointment.organization.name}
                        </p>
                      )}
                    </div>

                    {/* Previous Role (if applicable) */}
                    {appointment.previousPosition && (
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">Previously:</span> {appointment.previousPosition}
                          {appointment.previousOrganization && ` at ${appointment.previousOrganization.name}`}
                        </p>
                      </div>
                    )}

                    {/* Lead/Summary */}
                    {appointment.dek && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {appointment.dek}
                      </p>
                    )}

                    {/* Date */}
                    {appointment.publishedAt && (
                      <p className="text-xs text-gray-500 mt-4">
                        {new Date(appointment.publishedAt).toLocaleDateString('en-GB', {
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
              <p className="text-gray-500 text-lg">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
