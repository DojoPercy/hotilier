'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getAllEvents, getAllRegions } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';
import { getEventUrl, getEventType, getEventLocation, formatEventDate, formatEventTime, isEventUpcoming } from '@/hooks/useEvents';
import { useUser } from '@auth0/nextjs-auth0';

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
}

interface Region {
  _id: string;
  title: string;
  slug: string;
}

export default function EventsPage() {
  const { user, isLoading } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showMore, setShowMore] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
  };

  // Get unique event types from events
  const eventTypes = Array.from(
    new Set(
      allEvents
        .map(event => event.type)
        .filter((type): type is string => typeof type === 'string')
    )
  ).sort();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, regionsData] = await Promise.all([
          client.fetch(getAllEvents),
          client.fetch(getAllRegions)
        ]);
        
        setAllEvents(eventsData);
        setRegions(regionsData);
        setEvents(eventsData.slice(0, 6)); // Show first 6 events by default
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter events based on selected filters
  useEffect(() => {
    let filtered = allEvents;

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(event => 
        event.region?._id === selectedRegion
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    setEvents(filtered.slice(0, showMore ? filtered.length : 6));
  }, [selectedRegion, selectedType, showMore, allEvents]);

  const handleSeeMore = () => {
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    setShowMore(true);
  };

  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-20 bg-brand-blue">
      </div>
      <div className="min-h-screen bg-white poppins-thin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Events</h2>
            <div className="w-16 h-1 bg-brand-blue"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 sticky top-8">
                <h2 className="text-2xl font-regular text-gray-900 mb-6 border-b-2 border-brand-blue pb-4">
                  Filters
                </h2>

                {/* Region Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900"
                  >
                    <span>Region</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isRegionOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isRegionOpen && (
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => handleRegionClick('all')}
                        className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                          selectedRegion === 'all' ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Regions
                      </button>
                      {regions.map((region) => (
                        <button
                          key={region._id}
                          onClick={() => handleRegionClick(region._id)}
                          className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                            selectedRegion === region._id ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {region.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Type Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                    className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900"
                  >
                    <span>Event Type</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isTypeOpen && (
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => handleTypeClick('all')}
                        className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                          selectedType === 'all' ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Types
                      </button>
                      {eventTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleTypeClick(type)}
                          className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                            selectedType === type ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Events Content */}
            <div className="lg:w-3/4">
              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {events.map((event) => (
                  <Link href={getEventUrl(event)} key={event._id}>
                    <article className="bg-white overflow-hidden transition-shadow duration-200">
                      <div className="relative h-48">
                        {event.hero?.image ? (
                          <Image
                            src={urlFor(event.hero.image).url()}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        {isEventUpcoming(event) && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Upcoming
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-light-gray h-[200px]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-brand-blue text-sm font-semibold uppercase">
                            {getEventType(event)}
                          </span>
                          {event.region && (
                            <span className="text-gray-500 text-sm">{event.region.title}</span>
                          )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2">
                          {event.title}
                        </h2>

                        <div className="flex items-center justify-between">
                          <div className="text-gray-500 text-sm">
                            <div>{formatEventDate(event.start, event.end)}</div>
                            <div>{getEventLocation(event)}</div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* See More Button */}
              {events.length >= 6 && !showMore && (
                <div className="text-center">
                  <button
                    onClick={handleSeeMore}
                    className="bg-brand-blue text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    See More Events
                  </button>
                </div>
              )}

              {/* Login Prompt */}
              {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Login Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please log in to view more events and access premium content.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleLogin}
                        className="bg-brand-blue text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => setShowLoginPrompt(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}