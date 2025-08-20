import { generatePublicationsMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generatePublicationsMetadata();

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
