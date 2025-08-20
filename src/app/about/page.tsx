import { generateAboutMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateAboutMetadata();

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page