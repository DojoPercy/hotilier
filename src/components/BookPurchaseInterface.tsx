'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { 
  DownloadIcon, 
  ShoppingCartIcon, 
  EyeIcon, 
  StarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
  CheckIcon
} from 'lucide-react'

interface BookPurchaseInterfaceProps {
  publication: {
    _id: string
    title: string
    dek?: string
    hero?: {
      image?: any
    }
    year?: number
    price?: number
    currency?: string
    previewPdf?: any
    fullPdf?: any
    sectors?: Array<{
      _id: string
      title: string
    }>
    regions?: Array<{
      _id: string
      title: string
    }>
    toc?: Array<{
      _id: string
      title: string
    }>
    pageCount?: number
    language?: string
    isbn?: string
    author?: string
    publisher?: string
  }
  onPurchase?: (publicationId: string) => void
  onPreview?: (publicationId: string) => void
}

export default function BookPurchaseInterface({ 
  publication, 
  onPurchase, 
  onPreview 
}: BookPurchaseInterfaceProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePreview = () => {
    if (onPreview) {
      onPreview(publication._id)
    } else {
      // Default preview behavior
      if (publication.previewPdf?.asset?.url) {
        window.open(publication.previewPdf.asset.url, '_blank')
      }
    }
  }

  const handlePurchase = async () => {
    setIsPurchasing(true)
    try {
      if (onPurchase) {
        await onPurchase(publication._id)
      } else {
        // Default purchase behavior - redirect to checkout
        window.location.href = `/checkout/publication/${publication._id}`
      }
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setIsPurchasing(false)
    }
  }

  const getPreviewUrl = () => {
    return publication.previewPdf?.asset?.url || null
  }

  const getFullPdfUrl = () => {
    return publication.fullPdf?.asset?.url || null
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Book Details Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Book Cover & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Book Cover */}
              <div className="relative mb-8">
                <div className="relative h-96 w-full max-w-sm mx-auto shadow-2xl">
                  {publication.hero?.image ? (
                    <Image
                      src={urlFor(publication.hero.image).width(400).height(600).url()}
                      alt={publication.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-sm font-medium">Publication Cover</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4">
                {/* Preview Button */}
                {getPreviewUrl() && (
                  <button
                    onClick={handlePreview}
                    className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span>Preview Sample</span>
                  </button>
                )}

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full flex items-center justify-center gap-3 bg-brand-blue text-white px-6 py-4 rounded-lg font-semibold hover:bg-vibrant-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Purchase - ₵{publication.price || 0}</span>
                    </>
                  )}
                </button>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-emerald-green" />
                      <span>Instant download after purchase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-emerald-green" />
                      <span>Secure payment with Paystack</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-emerald-green" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {publication.sectors?.[0] && (
                  <span className="inline-flex items-center gap-1 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium">
                    <TagIcon className="w-3 h-3" />
                    {publication.sectors[0].title}
                  </span>
                )}
                {publication.year && (
                  <span className="text-gray-500 text-sm">{publication.year}</span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {publication.title}
              </h1>

              {publication.dek && (
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {publication.dek}
                </p>
              )}
            </div>

            {/* Book Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Details</h3>
                <div className="space-y-3">
                  {publication.author && (
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium">{publication.author}</span>
                    </div>
                  )}
                  {publication.publisher && (
                    <div className="flex items-center gap-3">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Publisher:</span>
                      <span className="font-medium">{publication.publisher}</span>
                    </div>
                  )}
                  {publication.pageCount && (
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{publication.pageCount}</span>
                    </div>
                  )}
                  {publication.language && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{publication.language}</span>
                    </div>
                  )}
                  {publication.isbn && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">ISBN:</span>
                      <span className="font-medium font-mono text-sm">{publication.isbn}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-green mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Full PDF download</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-green mt-1 flex-shrink-0" />
                    <span className="text-gray-600">High-resolution images</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-green mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Table of contents</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-emerald-green mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Lifetime access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {publication.toc && publication.toc.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-2">
                    {publication.toc.slice(0, 8).map((item, index) => (
                      <div key={item._id} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400 w-6">{index + 1}.</span>
                        <span className="text-gray-700">{item.title}</span>
                      </div>
                    ))}
                    {publication.toc.length > 8 && (
                      <div className="text-sm text-gray-500 pt-2">
                        +{publication.toc.length - 8} more chapters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related Publications */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* This would be populated with related publications */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-16 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-medium text-sm">Related Publication 1</h4>
                    <p className="text-xs text-gray-500">₵25</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-16 bg-gray-200 rounded"></div>
                  <div>
                    <h4 className="font-medium text-sm">Related Publication 2</h4>
                    <p className="text-xs text-gray-500">₵30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
