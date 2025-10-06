'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { getArticleBySlug } from '@/sanity/lib/queries';
import SocialShareButton, { SocialShareBar } from '@/components/SocialShareButton';
import SummarizeButton from '@/components/SummarizeButton';
import { getArticleUrl } from '@/lib/urls';
import { useArticleTracking } from '@/hooks/useAnalytics';
import { PaywallOverlay } from '@/components/paywall';
import SidebarAd from '@/components/SidebarAd';
import ContentRecommendations from '@/components/ContentRecommendations';
import RelatedContent from '@/components/RelatedContent';
import MemberExclusives from '@/components/MemberExclusives';
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, ArrowLeftIcon, BookOpenIcon } from 'lucide-react';
import SaveButton from '@/components/SaveButton';

interface Article {
  _id: string;
  _type: string;
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
  sectors?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  authors?: Array<{
    _id: string;
    name: string;
    headshot?: any;
    bio?: string;
  }>;
  tags?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
  body?: any;
  year?: number;
  accessType?: 'free' | 'login' | 'premium';
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track article view when article is loaded
  useArticleTracking(article?._id || '', article?.title);

  useEffect(() => {
    const fetchArticle = async () => {
      // Handle slug parameter - it might be a string or array
      const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      
      if (!slug) return;

      try {
        setLoading(true);
        const articleData = await client.fetch(getArticleBySlug, {
          slug: slug
        });

        if (!articleData) {
          setError('Article not found');
          return;
        }

        setArticle(articleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Hero image skeleton */}
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            
            {/* Content skeleton */}
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4 poppins-bold">Article Not Found</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {error || 'The article you are looking for does not exist or may have been moved.'}
            </p>
          </div>
          <div className="space-y-4">
            <Link 
              href="/articles" 
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-vibrant-blue transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Articles
            </Link>
            <div>
              <Link 
                href="/" 
                className="text-brand-blue hover:text-vibrant-blue transition-colors duration-200 font-medium"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-gray-500 hover:text-brand-blue transition-colors duration-200 font-medium"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href="/articles" 
                className="text-gray-500 hover:text-brand-blue transition-colors duration-200 font-medium"
              >
                Articles
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs lg:max-w-md">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Content with Full Screen Paywall */}
        <PaywallOverlay
          accessType={article.accessType || 'free'}
          contentId={article._id}
          contentType="article"
          scrollThreshold={20}
        >
          {/* Hero Image Section */}
          {article.hero?.image && (
            <div className="mb-12">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(article.hero.image).url()}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {(article.hero.caption || article.hero.credit) && (
                <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {article.hero.caption && <span>{article.hero.caption}</span>}
                  {article.hero.caption && article.hero.credit && <span> • </span>}
                  {article.hero.credit && <span>Credit: {article.hero.credit}</span>}
                </div>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Article Content */}
            <div className="lg:col-span-3">
              {/* Article Header */}
              <header className="mb-12">
                {/* Category and Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {article.sectors?.[0] && (
                      <span className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-semibold">
                        {article.sectors[0].title}
                      </span>
                    )}
                    {article.year && (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        {article.year}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {article.publishedAt && (
                      <time className="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                    <div className="flex items-center gap-2">
                      <SaveButton contentId={article._id} />
                      <SocialShareButton
                        url={getArticleUrl(article.slug.current)}
                        title={article.title}
                        description={article.dek}
                        hashtags={article.sectors?.map((s: any) => s.title) || []}
                        variant="compact"
                      />
                      <SummarizeButton
                        contentType="article"
                        slug={article.slug.current}
                        contentId={article._id}
                        variant="compact"
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight poppins-bold">
                  {article.title}
                </h1>

                {/* Deck */}
                {article.dek && (
                  <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                    {article.dek}
                  </p>
                )}

                {/* Authors */}
                {article.authors && article.authors.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Authors</span>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      {article.authors.map((author) => (
                        <div key={author._id} className="flex items-center gap-3">
                          {author.headshot && (
                            <Image
                              src={urlFor(author.headshot).url()}
                              alt={author.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover border-2 border-gray-200"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{author.name}</p>
                            {author.bio && (
                              <p className="text-sm text-gray-600 max-w-xs">{author.bio}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Article Body */}
              {article.body && (
                <article className="prose prose-lg prose-gray max-w-none mb-12">
                  <PortableText value={article.body} />
                </article>
              )}

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-8 mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
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
          {/* Social Share Bar */}
          <div className="border-t border-gray-200 pt-8 mb-12">
            <SocialShareBar
              url={getArticleUrl(article.slug.current)}
              title={article.title}
              description={article.dek}
              hashtags={article.sectors?.map((s: any) => s.title) || []}
              className="justify-center"
            />
          </div>

          {/* Back to Articles */}
          <div className="mb-12">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-vibrant-blue transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>
          </div>

          {/* Smart Content Recommendations */}
          <div className="border-t border-gray-200 pt-12 mb-12">
            <ContentRecommendations
              currentContent={article}
              title="You Might Also Like"
              maxItems={6}
            />
          </div>

          {/* Related Content */}
          <div className="mb-12">
            <RelatedContent
              currentContent={article}
              title="Related Interviews & Articles"
              maxItems={4}
              showSections={true}
            />
          </div>
        </PaywallOverlay>

        {/* Member Exclusives Section */}
        <div className="mt-20">
          <MemberExclusives maxItems={3} />
        </div>
      </div>
    </div>
  );
}
