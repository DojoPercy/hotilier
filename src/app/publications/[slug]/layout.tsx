import { generatePublicationMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { getPublicationBySlug } from '@/sanity/lib/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Handle slug parameter - it might be a string or array
  const slugParam = Array.isArray(slug) ? slug[0] : slug;
  
  try {
    const publication = await client.fetch(getPublicationBySlug, { slug: slugParam });
    if (publication) {
      return generatePublicationMetadata(publication);
    }
  } catch (error) {
    console.error('Error generating publication metadata:', error);
  }

  return generatePublicationMetadata({ title: 'Publication Not Found', slug: { current: slugParam } });
}

export default function PublicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
