'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getAllPublications, getAllSectors } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';
import { getPublicationUrl, getPrimaryRegion, getPrimarySector, getUniqueYears, getPdfUrl, getTocCount } from '@/hooks/usePublications';
import { useUser } from '@auth0/nextjs-auth0';

interface Publication {
  _id: string;
  title: string;
  slug: { current: string };
  hero?: {
    image?: any;
    caption?: string;
    credit?: string;
  };
  year?: number;
  regions?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  sectors?: Array<{
    _id: string;
    title: string;
    slug: string;
    icon?: any;
  }>;
  toc?: Array<{
    _id: string;
    _type: string;
    title: string;
    slug: string;
    dek?: string;
  }>;
  pdf?: any;
}

interface Sector {
  _id: string;
  title: string;
  slug: string;
}

export default function PublicationsPage() {
  const { user, isLoading } = useUser();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Filter states
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showMore, setShowMore] = useState(false);
  const [isSectorOpen, setIsSectorOpen] = useState(true);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const handleSectorClick = (sectorId: string) => {
    setSelectedSector(sectorId);
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(year);
  };

  // Get unique years from publications
  const years = getUniqueYears(allPublications as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsData, sectorsData] = await Promise.all([
          client.fetch(getAllPublications),
          client.fetch(getAllSectors)
        ]);
        
        setAllPublications(publicationsData);
        setSectors(sectorsData);
        setPublications(publicationsData.slice(0, 6)); // Show first 6 publications by default
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter publications based on selected filters
  useEffect(() => {
    let filtered = allPublications;

    if (selectedSector !== 'all') {
      filtered = filtered.filter(publication => 
        publication.sectors?.some(sector => sector._id === selectedSector)
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(publication => publication.year === parseInt(selectedYear));
    }

    setPublications(filtered.slice(0, showMore ? filtered.length : 6));
  }, [selectedSector, selectedYear, showMore, allPublications]);

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
            <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Publications</h2>
            <div className="w-16 h-1 bg-brand-blue"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 sticky top-8">
                <h2 className="text-2xl font-regular text-gray-900 mb-6 border-b-2 border-brand-blue pb-4">
                  Filters
                </h2>

                {/* Sector Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsSectorOpen(!isSectorOpen)}
                    className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900"
                  >
                    <span>Sector</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isSectorOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isSectorOpen && (
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => handleSectorClick('all')}
                        className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                          selectedSector === 'all' ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Sectors
                      </button>
                      {sectors.map((sector) => (
                        <button
                          key={sector._id}
                          onClick={() => handleSectorClick(sector._id)}
                          className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                            selectedSector === sector._id ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {sector.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Filter Section */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsYearOpen(!isYearOpen)}
                    className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900"
                  >
                    <span>Year</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isYearOpen && (
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => handleYearClick('all')}
                        className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                          selectedYear === 'all' ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Years
                      </button>
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearClick(String(year))}
                          className={`block w-full text-left py-2 px-4 transition-colors duration-200 rounded-md ${
                            selectedYear === String(year) ? 'bg-brand-blue text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Publications Content */}
            <div className="lg:w-3/4">
              {/* Publications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {publications.map((publication: any) => (
                  <Link href={getPublicationUrl(publication)} key={publication._id}>
                    <article className="bg-white overflow-hidden transition-shadow duration-200">
                      <div className="relative h-48">
                        {publication.hero?.image ? (
                          <Image
                            src={urlFor(publication.hero.image).url()}
                            alt={publication.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        {getPdfUrl(publication) && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            PDF Available
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-light-gray h-[200px]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-brand-blue text-sm font-semibold uppercase">
                            {getPrimarySector(publication)}
                          </span>
                          {publication.year && (
                            <span className="text-gray-500 text-sm">{publication.year}</span>
                          )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2">
                          {publication.title}
                        </h2>

                        <div className="flex items-center justify-between">
                          <div className="text-gray-500 text-sm">
                            <div>{getTocCount(publication)} articles</div>
                            {getPrimaryRegion(publication) && (
                              <div>{getPrimaryRegion(publication)}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* See More Button */}
              {publications.length >= 6 && !showMore && (
                <div className="text-center">
                  <button
                    onClick={handleSeeMore}
                    className="bg-brand-blue text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    See More Publications
                  </button>
                </div>
              )}

              {/* Login Prompt */}
              {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Login Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please log in to view more publications and access premium content.
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
