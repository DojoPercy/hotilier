import { generateArticleMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { getArticleBySlug } from '@/sanity/lib/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Handle slug parameter - it might be a string or array
  const slugParam = Array.isArray(slug) ? slug[0] : slug;
  
  try {
    const article = await client.fetch(getArticleBySlug, { slug: slugParam });
    if (article) {
      return generateArticleMetadata(article);
    }
  } catch (error) {
    console.error('Error generating article metadata:', error);
  }

  return generateArticleMetadata({ title: 'Article Not Found', slug: { current: slugParam } });
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
