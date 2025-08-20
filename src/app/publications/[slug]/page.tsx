'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { getPublicationBySlug } from '@/sanity/lib/queries';

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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
              <Link href="/publications" className="hover:text-brand-blue transition-colors duration-200">
                Publications
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{publication.title}</li>
          </ol>
        </nav>

        {/* Publication Header */}
        <header className="mb-8">
          {/* Category and Year */}
          <div className="flex items-center space-x-4 mb-4">
            {publication.sectors?.[0] && (
              <span className="text-brand-blue text-sm font-semibold uppercase">
                {publication.sectors[0].title}
              </span>
            )}
            {publication.regions?.[0] && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-brand-blue text-sm font-semibold uppercase">
                  {publication.regions[0].title}
                </span>
              </>
            )}
            {publication.year && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">{publication.year}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {publication.title}
          </h1>

          {/* PDF Download Button */}
          {getPdfUrl() && (
            <div className="mb-8">
              <a
                href={getPdfUrl() ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download PDF</span>
              </a>
            </div>
          )}
        </header>

        {/* Hero Image */}
        {publication.hero?.image && (
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={urlFor(publication.hero.image).url()}
                alt={publication.title}
                fill
                className="object-cover"
              />
            </div>
            {(publication.hero.caption || publication.hero.credit) && (
              <div className="mt-2 text-sm text-gray-500">
                {publication.hero.caption && <span>{publication.hero.caption}</span>}
                {publication.hero.caption && publication.hero.credit && <span> • </span>}
                {publication.hero.credit && <span>Credit: {publication.hero.credit}</span>}
              </div>
            )}
          </div>
        )}

        {/* Table of Contents */}
        {publication.toc && publication.toc.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                {publication.toc.map((item, index) => (
                  <div key={item._id} className="flex items-start space-x-4">
                    <span className="text-brand-blue font-bold text-lg min-w-[2rem]">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <Link
                        href={getContentUrl(item)}
                        className="text-lg font-semibold text-gray-900 hover:text-brand-blue transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                      {item.dek && (
                        <p className="text-gray-600 mt-1">{item.dek}</p>
                      )}
                      <span className="text-sm text-gray-500 capitalize">
                        {item._type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Publication Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sectors */}
          {publication.sectors && publication.sectors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sectors</h3>
              <div className="flex flex-wrap gap-2">
                {publication.sectors.map((sector) => (
                  <span
                    key={sector._id}
                    className="bg-brand-blue text-white px-3 py-1 rounded-full text-sm"
                  >
                    {sector.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regions */}
          {publication.regions && publication.regions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regions</h3>
              <div className="flex flex-wrap gap-2">
                {publication.regions.map((region) => (
                  <span
                    key={region._id}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {region.title}
                  </span>
                ))}
              </div>
            </div>
          )}
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