'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
import { CalendarIcon, ClockIcon, UserIcon, TagIcon, ArrowLeftIcon, BookOpenIcon, PrinterIcon, ListIcon, ChevronUpIcon } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { getReadingTime } from '@/sanity/lib/portableText';

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
    slug: { current: string };
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const articleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Track article view when article is loaded
  useArticleTracking(article?._id || '', article?.title);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!article?.body) return 0;
    return getReadingTime(article.body);
  }, [article?.body]);

  // Extract headings from article body for table of contents
  useEffect(() => {
    if (!article?.body) return;
    
    const extractedHeadings: Array<{ id: string; text: string; level: number }> = [];
    const processBlocks = (blocks: any[]) => {
      blocks.forEach((block) => {
        if (block._type === 'block' && block.style && ['h2', 'h3', 'h4'].includes(block.style)) {
          const text = block.children?.map((child: any) => child.text).join('') || '';
          if (text) {
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            extractedHeadings.push({
              id,
              text,
              level: parseInt(block.style.charAt(1))
            });
          }
        }
      });
    };
    
    processBlocks(article.body);
    setHeadings(extractedHeadings);
  }, [article?.body]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setShowTOC(false);
    }
  };

  // Print article
  const handlePrint = () => {
    window.print();
  };

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

  // Generate structured data for SEO
  const structuredData = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.dek || article.title,
    "image": article.hero?.image ? urlFor(article.hero.image).width(1200).url() : undefined,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": article.authors?.map(author => ({
      "@type": "Person",
      "name": author.name,
      "image": author.headshot ? urlFor(author.headshot).url() : undefined
    })) || [],
    "publisher": {
      "@type": "Organization",
      "name": "Hotelier Africa",
      "logo": {
        "@type": "ImageObject",
        "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/logo_final.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": getArticleUrl(article.slug.current)
    },
    "articleSection": article.sectors?.[0]?.title,
    "keywords": article.tags?.map(tag => tag.title).join(', ')
  } : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="mb-8 no-print" aria-label="Breadcrumb">
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
            <div className="lg:col-span-3" ref={articleRef}>
              {/* Article Header */}
              <header className="mb-12">
                {/* Category and Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {article.sectors?.[0] && (
                      <Link
                        href={`/sectors/${article.sectors[0].slug.current}`}
                        className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-semibold hover:bg-brand-blue/20 transition-colors"
                      >
                        {article.sectors[0].title}
                      </Link>
                    )}
                    {article.year && (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <CalendarIcon className="w-4 h-4" />
                        {article.year}
                      </span>
                    )}
                    {readingTime > 0 && (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                        <ClockIcon className="w-4 h-4" />
                        {readingTime} min read
                      </span>
                    )}
                    {article.publishedAt && (
                      <time className="inline-flex items-center gap-1 text-gray-500 text-sm" dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 no-print">
                    <SaveButton contentId={article._id} />
                    <button
                      onClick={handlePrint}
                      className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-lg hover:bg-gray-100"
                      aria-label="Print article"
                      title="Print article"
                    >
                      <PrinterIcon className="w-5 h-5" />
                    </button>
                    {headings.length > 0 && (
                      <button
                        onClick={() => setShowTOC(!showTOC)}
                        className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-lg hover:bg-gray-100"
                        aria-label="Table of contents"
                        title="Table of contents"
                      >
                        <ListIcon className="w-5 h-5" />
                      </button>
                    )}
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

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight poppins-bold">
                  {article.title}
                </h1>

                {/* Deck */}
                {article.dek && (
                  <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                    {article.dek}
                  </p>
                )}

                {/* Table of Contents */}
                {showTOC && headings.length > 0 && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ListIcon className="w-5 h-5" />
                      Table of Contents
                    </h2>
                    <nav className="space-y-2">
                      {headings.map((heading, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToHeading(heading.id)}
                          className={`block w-full text-left text-sm hover:text-brand-blue transition-colors ${
                            heading.level === 2 ? 'font-semibold pl-0' :
                            heading.level === 3 ? 'font-medium pl-4' :
                            'pl-8 text-gray-600'
                          }`}
                        >
                          {heading.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Authors */}
                {article.authors && article.authors.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Authors</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {article.authors.map((author) => (
                        <div key={author._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          {author.headshot && (
                            <Image
                              src={urlFor(author.headshot).url()}
                              alt={author.name}
                              width={64}
                              height={64}
                              className="rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 mb-1">{author.name}</p>
                            {author.bio && (
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{author.bio}</p>
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
                <article 
                  ref={contentRef}
                  className="prose prose-lg prose-gray max-w-none mb-12 prose-headings:scroll-mt-20"
                >
                  <PortableText 
                    value={article.body}
                    components={{
                      block: {
                        h2: ({ children, value }: any) => {
                          // Extract text from the block value
                          const text = value?.children?.map((child: any) => child.text || '').join('') || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                          return (
                            <h2 id={id} className="text-3xl font-bold mt-12 mb-6 text-gray-900 scroll-mt-20">
                              {children}
                            </h2>
                          );
                        },
                        h3: ({ children, value }: any) => {
                          const text = value?.children?.map((child: any) => child.text || '').join('') || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                          return (
                            <h3 id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-20">
                              {children}
                            </h3>
                          );
                        },
                        h4: ({ children, value }: any) => {
                          const text = value?.children?.map((child: any) => child.text || '').join('') || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                          return (
                            <h4 id={id} className="text-xl font-bold mt-6 mb-3 text-gray-900 scroll-mt-20">
                              {children}
                            </h4>
                          );
                        },
                        normal: ({ children }: any) => (
                          <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
                        ),
                        blockquote: ({ children }: any) => (
                          <blockquote className="border-l-4 border-brand-blue pl-6 italic my-8 text-gray-700 text-lg bg-gray-50 py-4 rounded-r-lg">
                            {children}
                          </blockquote>
                        )
                      },
                      types: {
                        image: ({ value }: any) => {
                          if (!value?.asset?._ref) return null;
                          return (
                            <figure className="my-12">
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src={urlFor(value).width(1200).fit('max').auto('format').url()}
                                  alt={value.alt || ''}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                />
                              </div>
                              {(value.caption || value.credit) && (
                                <figcaption className="mt-4 text-sm text-gray-600 text-center italic">
                                  {value.caption}
                                  {value.credit && (
                                    <span className="ml-2">Credit: {value.credit}</span>
                                  )}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }
                      }
                    }}
                  />
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
                      <Link
                        key={tag._id}
                        href={`/articles?tag=${tag.slug}`}
                        className="bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                      >
                        {tag.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Updated Date */}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <div className="border-t border-gray-200 pt-6 mb-12">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(article.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 no-print">
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
          <div className="border-t border-gray-200 pt-8 mb-12 no-print">
            <SocialShareBar
              url={getArticleUrl(article.slug.current)}
              title={article.title}
              description={article.dek}
              hashtags={article.sectors?.map((s: any) => s.title) || []}
              className="justify-center"
            />
          </div>

          {/* Back to Articles */}
          <div className="mb-12 no-print">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-vibrant-blue transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>
          </div>

          {/* Smart Content Recommendations */}
          <div className="border-t border-gray-200 pt-12 mb-12 no-print">
            <ContentRecommendations
              currentContent={article}
              title="You Might Also Like"
              maxItems={6}
            />
          </div>

          {/* Related Content */}
          <div className="mb-12 no-print">
            <RelatedContent
              currentContent={article}
              title="Related Interviews & Articles"
              maxItems={4}
              showSections={true}
            />
          </div>
        </PaywallOverlay>

        {/* Member Exclusives Section */}
        <div className="mt-20 no-print">
          <MemberExclusives maxItems={3} />
        </div>
      </div>

      {/* Floating Action Buttons - Desktop Only */}
      <div className="hidden lg:flex fixed bottom-8 right-8 z-40 flex-col gap-3 no-print">
        {/* Scroll to Top Button */}
        {readingProgress > 20 && (
          <button
            onClick={scrollToTop}
            className="bg-brand-blue text-white p-3 rounded-full shadow-lg hover:bg-vibrant-blue transition-all duration-200 hover:scale-110"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>
        )}
        
        {/* Floating Share Button */}
        <div className="bg-white rounded-full shadow-lg p-2">
          <SocialShareButton
            url={getArticleUrl(article.slug.current)}
            title={article.title}
            description={article.dek}
            hashtags={article.sectors?.map((s: any) => s.title) || []}
            variant="minimal"
          />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          .prose {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
