import { generateContractPublishingMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateContractPublishingMetadata();

export default function ContractPublishingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
