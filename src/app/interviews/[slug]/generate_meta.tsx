

import { generateInterviewMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { getInterviewBySlug } from '@/sanity/lib/queries';


interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const interview = await client.fetch(getInterviewBySlug, { slug: params.slug });
    if (interview) {
      return generateInterviewMetadata(interview);
    }
  } catch (error) {
    console.error('Error generating interview metadata:', error);
  }
  
  return generateInterviewMetadata({ title: 'Interview Not Found', slug: { current: params.slug } });
}
