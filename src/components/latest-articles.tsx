'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl } from '@/sanity/lib'
import { useLatestArticles, getArticleUrl, getPrimarySector, formatDate } from '@/hooks/useArticles'

const LatestArticles = () => {
  const { articles, loading, error } = useLatestArticles()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (articles.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = isMobile ? articles.length - 1 : Math.max(0, articles.length - 3)
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isMobile, articles.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = isMobile ? articles.length - 1 : Math.max(0, articles.length - 3)
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = isMobile ? articles.length - 1 : Math.max(0, articles.length - 3)
      return prevIndex <= 0 ? maxIndex : prevIndex - 1
    })
  }

  // Get visible articles
  const getVisibleArticles = () => {
    if (articles.length === 0) return []
    
    if (isMobile) {
      return [articles[currentIndex]]
    }
    
    // For desktop, always show 3 articles
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % articles.length
      visible.push(articles[index])
    }
    return visible
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1E212A] mb-2">Latest Articles</h2>
            <div className="w-16 h-1 bg-brand-blue"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 mb-4"></div>
                <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
                <div className="bg-gray-200 h-6 w-full rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !articles.length) {
    return null
  }

  const visibleArticles = getVisibleArticles()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 my-16">
          <h2 className="text-4xl font-bold text-[#1E212A] mb-2">Latest Articles</h2>
          <div className="w-20 h-1 bg-brand-blue mt-5"></div>
        </div>

        <div className="relative mt-20">
          {/* Navigation Arrows */}
          {articles.length > (isMobile ? 1 : 3) && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

                     {/* Carousel Container */}
           <div className="overflow-hidden">
             <motion.div
               key={currentIndex}
               initial={{ x: 300 }}
               animate={{ x: 0 }}
               exit={{ x: -300 }}
               transition={{ duration: 0.6, ease: "easeInOut" }}
               className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}
             >
               {visibleArticles.map((article, index) => (
                 <motion.article
                   key={`${article._id}-${currentIndex}-${index}`}
                   initial={{ x: 300 }}
                   animate={{ x: 0 }}
                   transition={{ 
                     duration: 0.6, 
                     delay: index * 0.1,
                     ease: "easeInOut"
                   }}
                   className="group cursor-pointer"
                 >
                  <Link href={getArticleUrl(article)}>
                    <div className="relative overflow-hidden transition-transform duration-300">
                      <div className="relative h-[16rem] bg-gray-200">
                        {article.hero?.image ? (
                          <Image
                            src={getImageUrl(article.hero.image, 1200, 300) as string}
                            alt={article.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-light-gray min-h-[25rem] flex flex-col justify-between group-hover:bg-brand-blue group-hover:text-white">
                        <div>
                          {getPrimarySector(article) && (
                            <div className="text-lg font-bold text-brand-blue uppercase tracking-wide group-hover:text-white mb-2">
                              {getPrimarySector(article)}
                            </div>
                          )}

                          <h3 className="text-xl lg:text-2xl font-bold text-[#1E212A] mb-3 line-clamp-2 group-hover:text-white transition-colors">
                            {article.title}
                          </h3>

                          {article.dek && (
                            <p className="text-[#65676E] group-hover:text-white text-lg mb-4 line-clamp-2">
                              {article.dek}
                            </p>
                          )}

                          {article.publishedAt && (
                            <div className="text-sm text-[#65676E] group-hover:text-white mb-4">
                              {formatDate(article.publishedAt)}
                            </div>
                          )}
                        </div>

                        <button className="w-full bg-brand-blue text-white py-3 mt-16 px-4 font-medium group-hover:bg-white group-hover:text-brand-blue transition-colors duration-200">
                          VIEW MORE
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>

          {/* Mobile Carousel Indicators */}
          {isMobile && articles.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: articles.length }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Desktop Progress Indicator */}
          {!isMobile && articles.length > 3 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(articles.length / 3) }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentIndex(i * 3)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === i ? 'bg-brand-blue' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className='w-full flex justify-center'>
        <Link href="/articles" className='w-[65%] lg:w-[15%] mx-auto'>
          <button className="w-full cursor-pointer bg-brand-blue text-white py-3 mt-16 px-4 font-medium hover:bg-white hover:text-brand-blue transition-colors duration-200 border-2 border-brand-blue">
            VIEW ALL ARTICLES
          </button>
        </Link>
      </div>
    </section>
  )
}

export default LatestArticles
