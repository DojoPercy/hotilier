'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getRelatedContentByTaxonomy, getContentByAuthor, getContentByOrganization } from '@/sanity/lib/recommendation-queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { trackRecommendationClick, getTaxonomyMatches } from '@/lib/analytics';
import { ArrowRightIcon } from 'lucide-react';

interface RelatedItem {
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
}

interface RelatedContentProps {
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
  };
  title?: string;
  className?: string;
  maxItems?: number;
  showSections?: boolean;
}

export default function RelatedContent({
  currentContent,
  title = "Related Content",
  className = "",
  maxItems = 4,
  showSections = true
}: RelatedContentProps) {
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [authorItems, setAuthorItems] = useState<RelatedItem[]>([]);
  const [organizationItems, setOrganizationItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      try {
        setLoading(true);
        
        const sectorIds = currentContent.sectors?.map(s => s._id) || [];
        const regionIds = currentContent.regions?.map(r => r._id) || [];
        const tagIds = currentContent.tags?.map(t => t._id) || [];
        const authorIds = currentContent.authors?.map(a => a._id) || [];
        const organizationIds = [
          currentContent.interviewee?.organization?._id,
          currentContent.organizationAtTime?._id
        ].filter(Boolean) || [];

        const [relatedData, authorData, organizationData] = await Promise.all([
          client.fetch(getRelatedContentByTaxonomy, {
            currentId: currentContent._id,
            sectorIds,
            regionIds,
            tagIds,
            limit: maxItems
          }),
          authorIds.length > 0 ? client.fetch(getContentByAuthor, {
            currentId: currentContent._id,
            authorIds,
            limit: 2
          }) : [],
          organizationIds.length > 0 ? client.fetch(getContentByOrganization, {
            currentId: currentContent._id,
            organizationIds,
            limit: 2
          }) : []
        ]);

        setRelatedItems(relatedData || []);
        setAuthorItems(authorData || []);
        setOrganizationItems(organizationData || []);
      } catch (err) {
        console.error('Error fetching related content:', err);
        setError('Failed to load related content');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedContent();
  }, [currentContent, maxItems]);

  const getContentUrl = (item: RelatedItem) => {
    switch (item._type) {
      case 'article':
        return `/articles/${item.slug.current}`;
      case 'interview':
        return `/interviews/${item.slug.current}`;
      case 'video':
        return `/videos/${item.slug.current}`;
      case 'specialReport':
        return `/special-reports/${item.slug.current}`;
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

  const renderContentItem = (item: RelatedItem, showType = true) => (
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
          recommendation_source: 'related_content',
          current_content_id: currentContent._id,
          current_content_type: currentContent._type,
          taxonomy_match: taxonomyMatches
        });
      }}
    >
      <article className="bg-white overflow-hidden transition-shadow duration-200">
        <div className="relative h-48">
          {item.hero?.image ? (
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
            {item.title}
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              {getContentTypeLabel(item._type)}
            </span>
            {item.publishedAt && (
              <span className="text-gray-400 text-xs">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const allItems = [...relatedItems, ...authorItems, ...organizationItems];
  const uniqueItems = allItems.filter((item, index, self) => 
    index === self.findIndex(t => t._id === item._id)
  );

  if (uniqueItems.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href="/articles"
          className="text-brand-blue hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {showSections && (authorItems.length > 0 || organizationItems.length > 0) ? (
        <div className="space-y-8">
          {/* Related by Taxonomy */}
          {relatedItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedItems.slice(0, 4).map(item => renderContentItem(item))}
              </div>
            </div>
          )}

        

         
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueItems.slice(0, maxItems).map(item => renderContentItem(item))}
        </div>
      )}
    </div>
  );
}
