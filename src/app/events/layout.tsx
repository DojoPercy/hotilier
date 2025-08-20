import { generateEventsMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateEventsMetadata();

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
