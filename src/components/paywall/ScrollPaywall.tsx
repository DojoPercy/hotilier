'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAccess, AccessType } from '@/hooks/useAccess'
import { LockClosedIcon, UserIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

interface ScrollPaywallProps {
  accessType: AccessType
  contentId: string
  contentType: string
  children: React.ReactNode
  scrollThreshold?: number // Percentage of content to show before paywall
  className?: string
}

export function ScrollPaywall({
  accessType,
  contentId,
  contentType,
  children,
  scrollThreshold = 30,
  className = ''
}: ScrollPaywallProps) {
  const { user, checkAccess, hasActiveSubscription } = useAccess()
  const [isPaywallActive, setIsPaywallActive] = useState(false)
  const [isPaywallLocked, setIsPaywallLocked] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const paywallRef = useRef<HTMLDivElement>(null)

  const access = checkAccess(accessType)
  
  // Debug logging
  console.log('Access status:', { 
    hasAccess: access.hasAccess, 
    canViewPartial: access.canViewPartial, 
    accessType 
  })

  // Set up scroll listener to detect when to show paywall
  useEffect(() => {
    if (!access.hasAccess && access.canViewPartial && !isPaywallActive) {
      console.log('Setting up scroll listener...')
      
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = Math.min((scrollTop / documentHeight) * 100, 100)
        
        setScrollProgress(progress)
        
        // Debug logging
        console.log('Scroll progress:', progress, 'Threshold:', scrollThreshold)
        
        if (progress >= scrollThreshold) {
          console.log('Triggering paywall!')
          setIsPaywallActive(true)
        }
      }

      // Initial check
      handleScroll()
      
      // Add scroll listener
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [access.hasAccess, access.canViewPartial, scrollThreshold, isPaywallActive])

  // Handle scroll events to lock paywall in place
  useEffect(() => {
    if (!isPaywallActive) return

    const handleScroll = () => {
      if (paywallRef.current) {
        const rect = paywallRef.current.getBoundingClientRect()
        const isInViewport = rect.top <= 0 && rect.bottom >= window.innerHeight
        
        if (isInViewport && !isPaywallLocked) {
          setIsPaywallLocked(true)
          // Prevent body scroll when paywall is locked
          document.body.style.overflow = 'hidden'
        } else if (!isInViewport && isPaywallLocked) {
          setIsPaywallLocked(false)
          // Restore body scroll
          document.body.style.overflow = 'unset'
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.style.overflow = 'unset'
    }
  }, [isPaywallActive, isPaywallLocked])

  // If user has full access, render content normally
  if (access.hasAccess) {
    return <div className={className}>{children}</div>
  }

  // If user can't view partial content, show paywall immediately
  if (!access.canViewPartial) {
    return (
      <div className={className}>
        <div className="relative">
          <div className="blur-[2px] opacity-60 pointer-events-none">
            {children}
          </div>
          <PaywallContent 
            accessType={accessType}
            contentId={contentId}
            contentType={contentType}
            isImmediate={true}
            onClose={() => {}}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={contentRef} className="relative">
        {/* Content with subtle blur effect when paywall is shown */}
        <div className={`transition-all duration-700 ${isPaywallActive ? 'blur-[2px] opacity-60' : ''}`}>
          {children}
        </div>

        {/* Scroll-based paywall that slides up from bottom */}
        <AnimatePresence>
          {isPaywallActive && (
            <motion.div
              ref={paywallRef}
              initial={{ y: '100%' }}
              animate={{ y: isPaywallLocked ? 0 : '100%' }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200,
                duration: 0.6
              }}
              className={`fixed inset-0 z-50 bg-white ${
                isPaywallLocked ? 'overflow-y-auto' : 'pointer-events-none'
              }`}
              style={{
                transform: isPaywallLocked ? 'translateY(0)' : 'translateY(100%)'
              }}
            >
              <PaywallContent 
                accessType={accessType}
                contentId={contentId}
                contentType={contentType}
                scrollProgress={scrollProgress}
                isImmediate={false}
                onClose={() => {
                  setIsPaywallActive(false)
                  setIsPaywallLocked(false)
                  document.body.style.overflow = 'unset'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface PaywallContentProps {
  accessType: AccessType
  contentId: string
  contentType: string
  scrollProgress?: number
  isImmediate?: boolean
  onClose?: () => void
}

function PaywallContent({ 
  accessType, 
  contentId, 
  contentType, 
  scrollProgress = 0,
  isImmediate = false,
  onClose
}: PaywallContentProps) {
  const { user, hasActiveSubscription } = useAccess()

  const getPaywallConfig = () => {
    switch (accessType) {
      case 'login':
        return {
          icon: UserIcon,
          title: 'Login to Continue Reading',
          subtitle: 'Create a free account to access this content',
          buttonText: 'Login',
          buttonAction: () => window.location.href = '/auth/login',
          gradient: 'from-blue-500 to-blue-600'
        }
      
      case 'premium':
        return {
          icon: StarIcon,
          title: 'Subscribe to Continue Reading',
          subtitle: 'Get unlimited access to premium content',
          buttonText: 'Subscribe Now',
          buttonAction: () => window.location.href = '/subscribe',
          gradient: 'from-purple-500 to-purple-600'
        }
      
      default:
        return {
          icon: LockClosedIcon,
          title: 'Access Restricted',
          subtitle: 'This content requires special access',
          buttonText: 'Learn More',
          buttonAction: () => window.location.href = '/contact',
          gradient: 'from-gray-500 to-gray-600'
        }
    }
  }

  const config = getPaywallConfig()
  const Icon = config.icon

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with close button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${config.gradient}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{config.title}</h1>
              <p className="text-sm text-gray-600">{config.subtitle}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close paywall"
              title="Close paywall"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Progress indicator */}
          {!isImmediate && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  You've read {Math.round(scrollProgress)}% of this content
                </span>
              </div>
            </div>
          )}

          {/* Main content sections */}
          <div className="space-y-12">
            {/* Hero section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Unlock Premium Content
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get unlimited access to our premium articles, exclusive interviews, and in-depth analysis.
              </p>
            </div>

            {/* Benefits section */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Articles</h3>
                <p className="text-gray-600">Access exclusive content and in-depth analysis</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Interviews</h3>
                <p className="text-gray-600">Exclusive conversations with industry leaders</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Insights</h3>
                <p className="text-gray-600">Comprehensive market analysis and trends</p>
              </div>
            </div>

            {/* Subscription Plans Section */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
                <p className="text-gray-600">Start your free trial today</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Monthly Plan */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Monthly</h4>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$16.50</div>
                    <p className="text-gray-600">per month</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Unlimited articles</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Exclusive interviews</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Market insights</span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={config.buttonAction}
                    className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Start Free Trial
                  </button>
                </div>

                {/* Annual Plan */}
                <div className="bg-white rounded-xl p-6 border-2 border-blue-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Annual</h4>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$158.39</div>
                    <p className="text-gray-600">per year</p>
                    <p className="text-sm text-green-600 font-semibold">Save 20%</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Everything in Monthly</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Early access to content</span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={config.buttonAction}
                    className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Login option for login-required content */}
              {accessType === 'login' && (
                <div className="text-center mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-50 text-gray-500 uppercase font-medium">OR</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={config.buttonAction}
                    className="mt-6 bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Login to Continue Reading
                  </button>
                  <p className="text-sm text-gray-500 mt-3">
                    Already have an account? Sign in to access this content
                  </p>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">What Our Subscribers Say</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 mb-4">"The insights and analysis are invaluable for understanding market trends."</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Investment Analyst</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 mb-4">"The exclusive interviews provide unique perspectives you can't find elsewhere."</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Michael Chen</p>
                      <p className="text-sm text-gray-600">Energy Consultant</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 mb-4">"Comprehensive coverage of the energy sector with actionable insights."</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                      <p className="text-sm text-gray-600">Portfolio Manager</p>
                    </div>
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
