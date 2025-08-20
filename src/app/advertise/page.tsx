import { generateAdvertiseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = generateAdvertiseMetadata();

import React from 'react'

const page = () => {
  return (
    <div>Advertise</div>
  )
}

export default page