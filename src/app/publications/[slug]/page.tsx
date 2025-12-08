'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { getPublicationBySlug } from '@/sanity/lib/queries';
import ContentRecommendations from '@/components/ContentRecommendations';
import RelatedContent from '@/components/RelatedContent';
import ContentEngagementTracker from '@/components/ContentEngagementTracker';
import SocialShareButton, { SocialShareBar } from '@/components/SocialShareButton';
import SummarizeButton from '@/components/SummarizeButton';
import BookPurchaseInterface from '@/components/BookPurchaseInterface';
import { getPublicationUrl } from '@/lib/urls';

interface Publication {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  dek?: string;
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
  previewPdf?: any;
  fullPdf?: any;
  price?: number;
  currency?: string;
  pageCount?: number;
  language?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: any;
    noindex?: boolean;
  };
}

export default function PublicationPage() {
  const params = useParams();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPublication = async () => {
      // Handle slug parameter - it might be a string or array
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      
      if (!slug) return;

      try {
        setLoading(true);
        const publicationData = await client.fetch(getPublicationBySlug, {
          slug: slug
        });

        if (!publicationData) {
          setError('Publication not found');
          return;
        }

        setPublication(publicationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch publication');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto  flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Publication Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The publication you are looking for does not exist.'}</p>
          <Link href="/publications" className="bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200">
            Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  const getPdfUrl = (): string | null => {
    if (publication.pdf?.asset?.url) {
      return publication.pdf.asset.url;
    }
    return null;
  };

  const getContentUrl = (item: any): string => {
    if (item._type === 'article') {
      return `/articles/${item.slug}`;
    } else if (item._type === 'interview') {
      return `/interviews/${item.slug}`;
    }
    return '#';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Track content engagement */}
      {publication && (
        <ContentEngagementTracker
          contentId={publication._id}
          contentType="publication"
          enabled={true}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Link href="/publications" className="hover:text-brand-blue transition-colors duration-200">
                Publications
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{publication.title}</li>
          </ol>
        </nav>

        {/* Book Purchase Interface */}
        <BookPurchaseInterface 
          publication={publication}
          onPurchase={(publicationId) => {
            // Handle purchase - redirect to checkout
            window.location.href = `/checkout/publication/${publicationId}`
          }}
          onPreview={(publicationId) => {
            // Handle preview download
            if (publication.previewPdf?.asset?.url) {
              window.open(publication.previewPdf.asset.url, '_blank')
            }
          }}
        />

        {/* Social Share Bar */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <SocialShareBar
            url={getPublicationUrl(publication.slug.current)}
            title={publication.title}
            description={publication.dek}
            hashtags={[...(publication.sectors?.map((s: any) => s.title) || []), ...(publication.regions?.map((r: any) => r.title) || [])]}
            className="justify-center"
          />
        </div>

        {/* Smart Content Recommendations */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <ContentRecommendations
            currentContent={publication}
            title="You Might Also Like"
            maxItems={6}
          />
        </div>

        {/* Related Content */}
        <div className="mb-8">
          <RelatedContent
            currentContent={publication}
            title="Related Publications & Content"
            maxItems={4}
            showSections={true}
          />
        </div>

        {/* Back to Publications */}
        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/publications"
            className="inline-flex items-center space-x-2 text-brand-blue hover:text-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Publications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}