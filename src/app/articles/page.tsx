'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { client } from '@/sanity/lib/client';
import { getAllArticles, getAllSectors } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0';
import LatestArticles from '@/components/latest-articles';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  dek?: string;
  publishedAt?: string;
  hero?: {
    image?: any;
  };
  sectors?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  authors?: Array<{
    _id: string;
    name: string;
  }>;
  year?: number;
}

interface Sector {
  _id: string;
  title: string;
  slug: string;
}

export default function ArticlesPage() {
  const { user, isLoading } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Filter states
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [showMore, setShowMore] = useState(false);
  const [isSectorOpen, setIsSectorOpen] = useState(true);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const handleSectorClick = (sectorId: SetStateAction<string>) => {
    setSelectedSector(sectorId);
  };

  const handleYearClick = (year: SetStateAction<string>) => {
    setSelectedYear(year);
  };


  // Get unique years from articles, filtering out undefined/null and sorting descending
  const years = Array.from(
    new Set(
      allArticles
        .map(article => article.year)
        .filter((year): year is number => typeof year === 'number')
    )
  ).sort((a, b) => (a && b ? b - a : 0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, sectorsData] = await Promise.all([
          client.fetch(getAllArticles),
          client.fetch(getAllSectors)
        ]);
        
        setAllArticles(articlesData);
        setSectors(sectorsData);
        setArticles(articlesData.slice(0, 6)); // Show first 6 articles by default
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter articles based on selected filters
  useEffect(() => {
    let filtered = allArticles;

    if (selectedSector !== 'all') {
      filtered = filtered.filter(article => 
        article.sectors?.some(sector => sector._id === selectedSector)
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(article => article.year === parseInt(selectedYear));
    }

    setArticles(filtered.slice(0, showMore ? filtered.length : 6));
  }, [selectedSector, selectedYear, showMore, allArticles]);

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
    <><LatestArticles /><div className="w-full py-20 bg-brand-blue">

    </div><div className="min-h-screen bg-white poppins-thin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-16">
                <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Articles</h2>
                <div className="w-16 h-1 bg-brand-blue"></div>
              </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
      <div className="bg-white  p-6 sticky top-8 ">
        <h2 className="text-2xl font-regular text-gray-900 mb-6 border-b-2 border-brand-blue pb-4">
          Filters
        </h2>

        {/* Sector Filter Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsSectorOpen(!isSectorOpen)}
            className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900 "
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
            className="flex justify-between items-center w-full py-2 text-xl font-medium text-gray-900 "
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

            {/* Articles Content */}
            <div className="lg:w-3/4">
             

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {articles.map((article) => (
                  <Link href={`/articles/${article.slug.current}`}>
                    <article key={article._id} className="bg-white    overflow-hidden  transition-shadow duration-200">
                      <div className="relative h-48">
                        {article.hero?.image ? (
                          <Image
                            src={urlFor(article.hero.image).url()}
                            alt={article.title}
                            fill
                            className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-light-gray h-[200px]">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-brand-blue text-sm font-semibold uppercase">
                            {article.sectors?.[0]?.title || 'GENERAL'}
                          </span>
                          {article.year && (
                            <span className="text-gray-500 text-sm">{article.year}</span>
                          )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2">
                          {article.title}
                        </h2>

                        {/* {article.dek && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.dek}
              </p>
            )} */}

                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">
                            {article.authors?.[0]?.name || 'Anonymous'}
                          </span>
                          {article.publishedAt && (
                            <span className="text-gray-400 text-xs">
                              {new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>




                    </article>
                  </Link>
                ))}
              </div>

              {/* See More Button */}
              {articles.length >= 6 && !showMore && (
                <div className="text-center">
                  <button
                    onClick={handleSeeMore}
                    className="bg-brand-blue text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    See More Articles
                  </button>
                </div>
              )}

              {/* Login Prompt */}
              {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Login Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please log in to view more articles and access premium content.
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
      </div></>
  );
}
