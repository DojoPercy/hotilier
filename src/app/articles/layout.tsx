
import { generateArticlesMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateArticlesMetadata();

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
