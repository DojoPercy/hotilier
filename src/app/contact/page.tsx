import { generateContactMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateContactMetadata();

import React from 'react'

const page = () => {
  return (
    <div>Contact</div>
  )
}

export default page