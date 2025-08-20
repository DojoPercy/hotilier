
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { PortableTextComponent } from '@/sanity/lib/portableText';
import Image from 'next/image';
import Link from 'next/link';
import SidebarAd from '@/components/SidebarAd';
import { getInterviewBySlug } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';

interface Interview {
  _id: string;
  title: string;
  slug: { current: string };
  dek?: string;
  publishedAt?: string;
  updatedAt?: string;
  hero?: {
    image?: any;
    caption?: string;
    credit?: string;
  };
  interviewee?: {
    _id: string;
    name: string;
    headshot?: any;
    role?: string;
    bio?: string;
    organization?: {
      _id: string;
      name: string;
      logo?: any;
    };
    socials?: {
      linkedin?: string
      x?: string
      website?: string
    };
  };
  roleAtTime?: string;
  organizationAtTime?: {
    _id: string;
    name: string;
    logo?: any;
  };
  sectors?: Array<{
    _id: string;
    title: string;
    slug: string;
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
  transcript?: any;
  year?: number;
  pullQuotes?: string[];
}



export default function InterviewPage() {
  const params = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      // Handle slug parameter - it might be a string or array
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      
      if (!slug) return;

      try {
        setLoading(true);
        const interviewData = await client.fetch(getInterviewBySlug, {
          slug: slug
        });

        if (!interviewData) {
          setError('Interview not found');
          return;
        }

        setInterview(interviewData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch interview');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The interview you are looking for does not exist.'}</p>
          <Link href="/interviews" className="bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-brand-blue transition-colors duration-200">
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/interviews" className="hover:text-brand-blue transition-colors duration-200">
                Interviews
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{interview.interviewee?.name || interview.title}</li>
          </ol>
        </nav>

        {/* Interview Header */}
        <header className="mb-12">
          {/* Category and Year */}
          <div className="flex items-center space-x-4 mb-6">
            {interview.regions?.[0] && (
              <span className="text-brand-blue text-sm font-semibold uppercase">
                {interview.regions[0].title}
              </span>
            )}
            {interview.regions?.[0] && interview.sectors?.[0] && (
              <span className="text-gray-400">•</span>
            )}
            {interview.sectors?.[0] && (
              <span className="text-brand-blue text-sm font-semibold uppercase">
                {interview.sectors[0].title}
              </span>
            )}
            {interview.year && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">{interview.year}</span>
              </>
            )}
          </div>

          {/* Interviewee Profile Section */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Headshot */}
            {interview.interviewee?.headshot && (
              <div className="lg:w-1/3">
                <Image
                  src={urlFor(interview.interviewee.headshot).url()}
                  alt={interview.interviewee.name}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover w-full max-w-sm"
                />
              </div>
            )}

            {/* Interviewee Info */}
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {interview.interviewee?.name || interview.title}
              </h1>
              
              {/* Role and Organization */}
              <div className="mb-6">
                <p className="text-xl font-medium text-gray-900 mb-2">
                  {interview.roleAtTime || interview.interviewee?.role}
                </p>
                {(interview.organizationAtTime?.name || interview.interviewee?.organization?.name) && (
                  <p className="text-lg text-gray-600">
                    {interview.organizationAtTime?.name || interview.interviewee?.organization?.name}
                  </p>
                )}
              </div>

              {/* Bio */}
              {interview.interviewee?.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">BIO</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {interview.interviewee.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {interview.interviewee?.socials && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">CONNECT</h3>
                  <div className="flex items-center space-x-4">
                    {interview.interviewee.socials.linkedin && (
                      <Link 
                        href={interview.interviewee.socials.linkedin} 
                        target="_blank" 
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                        aria-label="LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                          <rect width="4" height="12" x="2" y="9"/>
                          <circle cx="4" cy="4" r="2"/>
                        </svg>
                      </Link>
                    )}
                    {interview.interviewee.socials.x && (
                      <Link 
                        href={interview.interviewee.socials.x} 
                        target="_blank" 
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                        aria-label="X (Twitter)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"/>
                          <path d="m6 6 12 12"/>
                        </svg>
                      </Link>
                    )}
                    {interview.interviewee.socials.website && (
                      <Link 
                        href={interview.interviewee.socials.website} 
                        target="_blank" 
                        className="text-gray-600 hover:text-brand-blue transition-colors duration-200"
                        aria-label="Website"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M2 12h20"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Publication Date */}
              {interview.publishedAt && (
                <div className="text-gray-500 text-sm">
                  Published {new Date(interview.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pull Quote */}
          {interview.pullQuotes && interview.pullQuotes[0] && (
            <blockquote className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed border-l-4 border-brand-blue pl-6">
              "{interview.pullQuotes[0]}"
            </blockquote>
          )}

          {/* Deck */}
          {interview.dek && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {interview.dek}
            </p>
          )}
        </header>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-4'>
            {/* Interview Transcript */}
            {interview.transcript && (
              <article className="prose prose-lg max-w-none mb-12">
                <PortableTextComponent value={interview.transcript} />
              </article>
            )}

            {/* Tags */}
            {interview.tags && interview.tags.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {interview.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className="sticky top-8">
              <SidebarAd 
                className="mb-6"
                maxAds={2}
                showAdLabel={true}
                showControls={false}
                showIndicators={true}
                autoRotate={true}
                rotationInterval={6000}
              />
            </div>
          </div>
        </div>

        {/* Back to Interviews */}
        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/interviews"
            className="inline-flex items-center space-x-2 text-brand-blue hover:text-brand-blue transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Interviews</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

