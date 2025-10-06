'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getSmartRecommendations } from '@/sanity/lib/recommendation-queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { trackRecommendationClick, trackRecommendationView, getTaxonomyMatches } from '@/lib/analytics';
import { CalendarIcon, ChevronRightIcon, ClockIcon, StarIcon } from 'lucide-react';

interface RecommendationItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  dek?: string;
  publishedAt?: string;
  year?: number;
  isFeatured?: boolean;
  hero?: {
    image?: any;
    caption?: string;
  };
  sectors?: Array<{
    _id: string;
    title: string;
    slug: string;
    icon?: string;
  }>;
  regions?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  tags?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  interviewee?: {
    _id: string;
    name: string;
    headshot?: any;
    organization?: {
      _id: string;
      name: string;
    };
  };
  organizationAtTime?: {
    _id: string;
    name: string;
  };
  type?: string;
  start?: string;
  end?: string;
  location?: string;
}

interface Recommendations {
  relatedByTaxonomy: RecommendationItem[];
  trending: RecommendationItem[];
  diverseTypes: RecommendationItem[];
  publications: RecommendationItem[];
  events: RecommendationItem[];
}

interface ContentRecommendationsProps {
  currentContent: {
    _id: string;
    _type: string;
    sectors?: Array<{ _id: string }>;
    regions?: Array<{ _id: string }>;
    tags?: Array<{ _id: string }>;
    authors?: Array<{ _id: string }>;
    interviewee?: {
      organization?: { _id: string };
    };
    organizationAtTime?: { _id: string };
    year?: number;
  };
  title?: string;
  className?: string;
  maxItems?: number;
}

export default function ContentRecommendations({
  currentContent,
  title = "You Might Also Like",
  className = "",
  maxItems = 3
}: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        const sectorIds = currentContent.sectors?.map(s => s._id) || [];
        const regionIds = currentContent.regions?.map(r => r._id) || [];
        const tagIds = currentContent.tags?.map(t => t._id) || [];

        const data = await client.fetch(getSmartRecommendations, {
          currentId: currentContent._id,
          currentType: currentContent._type,
          sectorIds,
          regionIds,
          tagIds,
          year: currentContent.year
        });

        setRecommendations(data);
        
        // Track recommendation view
        if (data) {
          const allItems = [
            ...(data.relatedByTaxonomy || []),
            ...(data.trending || []),
            ...(data.diverseTypes || []),
            ...(data.publications || []),
            ...(data.events || [])
          ];
          
          trackRecommendationView({
            current_content_id: currentContent._id,
            current_content_type: currentContent._type,
            recommendation_count: allItems.length,
            recommendation_types: [...new Set(allItems.map(item => item._type))]
          });
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentContent]);

  const getContentUrl = (item: RecommendationItem) => {
    switch (item._type) {
      case 'article':
        return `/articles/${item.slug.current}`;
      case 'interview':
        return `/interviews/${item.slug.current}`;
      case 'video':
        return `/videos/${item.slug.current}`;
      case 'specialReport':
        return `/special-reports/${item.slug.current}`;
      case 'publication':
        return `/publications/${item.slug.current}`;
      case 'event':
        return `/events/${item.slug.current}`;
      default:
        return '#';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return 'Article';
      case 'interview':
        return 'Interview';
      case 'video':
        return 'Video';
      case 'specialReport':
        return 'Special Report';
      case 'publication':
        return 'Publication';
      case 'event':
        return 'Event';
      default:
        return 'Content';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAllRecommendations = (): RecommendationItem[] => {
    if (!recommendations) return [];
    
    const allItems = [
      ...recommendations.relatedByTaxonomy,
      ...recommendations.trending,
      ...recommendations.diverseTypes,
      ...recommendations.publications,
      ...recommendations.events
    ];

    // Remove duplicates based on _id
    const uniqueItems = allItems.filter((item, index, self) => 
      index === self.findIndex(t => t._id === item._id)
    );

    return uniqueItems.slice(0, maxItems);
  };

  if (loading) {
    return (
      <div className={`bg-gray-50 p-6 -lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200  w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-20 w-20 bg-gray-200 "></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200  w-3/4"></div>
                  <div className="h-3 bg-gray-200  w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return null;
  }

  const items = getAllRecommendations();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Title with underline */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900">
          <span className="text-brand-blue ">You may also be interested in</span>...
        </h2>
        <div className="w-20 h-1 bg-brand-blue mt-4"></div>
      </div>

      {/* Grid Layout - matching interviews page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item._id}
            href={getContentUrl(item)}
            className="group block"
            onClick={() => {
              // Enhanced analytics tracking
              const taxonomyMatches = getTaxonomyMatches(currentContent, item);
              trackRecommendationClick({
                content_id: item._id,
                content_type: item._type,
                recommendation_source: 'smart_suggestions',
                current_content_id: currentContent._id,
                current_content_type: currentContent._type,
                taxonomy_match: taxonomyMatches
              });
            }}
          >
            <article className="bg-white overflow-hidden transition-shadow duration-200">
              {/* Image */}
              <div className="relative h-48">
                {item._type === 'interview' && item.interviewee?.headshot ? (
                  <Image
                    src={urlFor(item.interviewee.headshot).url()}
                    alt={item.interviewee.name}
                    fill
                    className="object-cover"
                  />
                ) : item.hero?.image ? (
                  <Image
                    src={urlFor(item.hero.image).url()}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 bg-light-gray h-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brand-blue text-sm font-semibold uppercase">
                    {item.regions?.[0]?.title && item.sectors?.[0]?.title 
                      ? `${item.regions[0].title} - ${item.sectors[0].title}`
                      : item.sectors?.[0]?.title || item.regions?.[0]?.title || 'CONTENT'
                    }
                  </span>
                  {item.year && (
                    <span className="text-gray-500 text-sm">{item.year}</span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2">
                  {item._type === 'interview' && item.interviewee?.name 
                    ? item.interviewee.name
                    : item.title
                  }
                </h2>

              
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-8 text-center">
        <Link
          href="/articles"
          className="inline-flex items-center space-x-2 text-brand-blue hover:text-blue-700 font-medium text-sm group"
        >
          <span>View More Content</span>
          <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}
