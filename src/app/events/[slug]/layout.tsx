import { generateEventMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { getEventBySlug } from '@/sanity/lib/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Handle slug parameter - it might be a string or array
  const slugParam = Array.isArray(slug) ? slug[0] : slug;
  
  try {
    const event = await client.fetch(getEventBySlug, { slug: slugParam });
    if (event) {
      return generateEventMetadata(event);
    }
  } catch (error) {
    console.error('Error generating event metadata:', error);
  }

  return generateEventMetadata({ title: 'Event Not Found', slug: { current: slugParam } });
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
