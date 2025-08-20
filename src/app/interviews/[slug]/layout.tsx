import { generateInterviewMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { getInterviewBySlug } from '@/sanity/lib/queries';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Temporary simplified metadata to debug the issue
  return {
    title: 'Interview - Energy Nexus',
    description: 'Interview page',
    openGraph: {
      title: 'Interview - Energy Nexus',
      description: 'Interview page',
      url: '/interviews',
      siteName: 'Energy Nexus',
      images: [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'Interview',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Interview - Energy Nexus',
      description: 'Interview page',
      images: ['/og-default.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: '/interviews',
    },
  };
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
