'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { PortableTextComponent } from '@/sanity/lib/portableText';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { getEventBySlug } from '@/sanity/lib/queries';

interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  type: string;
  start: string;
  end?: string;
  location?: string;
  region?: {
    _id: string;
    title: string;
    slug: string;
  };
  partners?: Array<{
    _id: string;
    name: string;
    logo?: any;
    website?: string;
  }>;
  description?: any;
  hero?: {
    image?: any;
    caption?: string;
    credit?: string;
  };
  registrationUrl?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: any;
    noindex?: boolean;
  };
}

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      // Handle slug parameter - it might be a string or array
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      
      if (!slug) return;

      try {
        setLoading(true);
        const eventData = await client.fetch(getEventBySlug, {
          slug: slug
        });

        if (!eventData) {
          setError('Event not found');
          return;
        }

        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link href="/events" className="bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formatEventDate = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startFormatted = start.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!end || start.toDateString() === end.toDateString()) {
      return startFormatted;
    }

    const endFormatted = end.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const formatEventTime = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (!end) {
      return startTime;
    }

    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return `${startTime} - ${endTime}`;
  };

  const isEventUpcoming = (): boolean => {
    return new Date(event.start) > new Date();
  };

  const getDaysUntilEvent = (): number => {
    const today = new Date();
    const eventDate = new Date(event.start);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-brand-blue transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/events" className="hover:text-brand-blue transition-colors duration-200">
                Events
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{event.title}</li>
          </ol>
        </nav>

        {/* Event Header */}
        <header className="mb-8">
          {/* Event Type and Region */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-brand-blue text-sm font-semibold uppercase">
              {event.type}
            </span>
            {event.region && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-brand-blue text-sm font-semibold uppercase">
                  {event.region.title}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Date & Time</h3>
                <p className="text-gray-700">{formatEventDate(event.start, event.end)}</p>
                <p className="text-gray-600">{formatEventTime(event.start, event.end)}</p>
              </div>

              {event.location && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-700">{event.location}</p>
                </div>
              )}

              {isEventUpcoming() && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Countdown</h3>
                  <p className="text-green-600 font-semibold">
                    {getDaysUntilEvent()} days until this event
                  </p>
                </div>
              )}
            </div>

            {/* Registration Button */}
            {event.registrationUrl && (
              <div className="flex items-center justify-center">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue text-white px-8 py-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Hero Image */}
        {event.hero?.image && (
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={urlFor(event.hero.image).url()}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            {(event.hero.caption || event.hero.credit) && (
              <div className="mt-2 text-sm text-gray-500">
                {event.hero.caption && <span>{event.hero.caption}</span>}
                {event.hero.caption && event.hero.credit && <span> • </span>}
                {event.hero.credit && <span>Credit: {event.hero.credit}</span>}
              </div>
            )}
          </div>
        )}

        {/* Event Description */}
        {event.description && (
          <article className="prose prose-lg max-w-none mb-8">
            <PortableTextComponent value={event.description} />
          </article>
        )}

        {/* Partners */}
        {event.partners && event.partners.length > 0 && (
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.partners.map((partner) => (
                <div key={partner._id} className="text-center">
                  {partner.logo ? (
                    <div className="mb-3">
                      <Image
                        src={urlFor(partner.logo).url()}
                        alt={partner.name}
                        width={120}
                        height={80}
                        className="mx-auto object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="mb-3 h-20 bg-gray-100 flex items-center justify-center rounded">
                      <span className="text-gray-400 text-sm">No logo</span>
                    </div>
                  )}
                  <h4 className="font-medium text-gray-900 mb-1">{partner.name}</h4>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:text-blue-700 text-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Events */}
        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 text-brand-blue hover:text-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}