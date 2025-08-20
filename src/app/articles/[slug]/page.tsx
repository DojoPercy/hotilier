'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { getArticleBySlug } from '@/sanity/lib/queries';

interface Article {
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
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link href="/articles" className="bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-brand-blue transition-colors duration-200">
            Back to Articles
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
              <Link href="/articles" className="hover:text-brand-blue transition-colors duration-200">
                Articles
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category and Year */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {article.sectors?.[0] && (
                <span className="text-brand-blue text-sm font-semibold uppercase">
                  {article.sectors[0].title}
                </span>
              )}
              {article.year && (
                <span className="text-gray-500 text-sm">{article.year}</span>
              )}
            </div>
            {article.publishedAt && (
              <time className="text-gray-400 text-sm">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Deck */}
          {article.dek && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.dek}
            </p>
          )}

          {/* Authors */}
          {article.authors && article.authors.length > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              {article.authors.map((author) => (
                <div key={author._id} className="flex items-center space-x-3">
                  {author.headshot && (
                    <Image
                      src={urlFor(author.headshot).url()}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{author.name}</p>
                    {author.bio && (
                      <p className="text-sm text-gray-600">{author.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {article.hero?.image && (
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={urlFor(article.hero.image).url()}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            {(article.hero.caption || article.hero.credit) && (
              <div className="mt-2 text-sm text-gray-500">
                {article.hero.caption && <span>{article.hero.caption}</span>}
                {article.hero.caption && article.hero.credit && <span> • </span>}
                {article.hero.credit && <span>Credit: {article.hero.credit}</span>}
              </div>
            )}
          </div>
        )}

        {/* Article Body */}
        {article.body && (
          <article className="prose prose-lg max-w-none mb-8">
            <PortableText value={article.body} />
          </article>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
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

        {/* Back to Articles */}
        <div className="border-t border-gray-200 pt-8">
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 text-brand-blue hover:text-brand-blue transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Articles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
