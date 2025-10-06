'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAccess, AccessType } from '@/hooks/useAccess'
import { LockClosedIcon, UserIcon, StarIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface PaywallOverlayProps {
  accessType: AccessType
  contentId: string
  contentType: string
  children: React.ReactNode
  scrollThreshold?: number // Percentage of content to show before paywall
  className?: string
}

export function PaywallOverlay({
  accessType,
  contentId,
  contentType,
  children,
  scrollThreshold = 10, // Show paywall after 20% of content
  className = ''
}: PaywallOverlayProps) {
  const { user, checkAccess, hasActiveSubscription } = useAccess()
  const [showPaywall, setShowPaywall] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [paywallPosition, setPaywallPosition] = useState(100) // 100 = fully hidden, 0 = fully visible
  const [isScrollHijacked, setIsScrollHijacked] = useState(false)
  const [triggerScrollPosition, setTriggerScrollPosition] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const access = checkAccess(accessType)

  // Set up scroll listener to detect when to show paywall
  useEffect(() => {
    if (!access.hasAccess && access.canViewPartial) {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight
        const currentProgress = Math.min((scrollTop / documentHeight) * 100, 100)
        
        setScrollProgress(currentProgress)
        
        if (currentProgress >= scrollThreshold && !showPaywall) {
          // Paywall trigger point reached
          setShowPaywall(true)
          setTriggerScrollPosition(scrollTop)
          setPaywallPosition(45) // Start at 35% (covering bottom 65% of screen)
          setIsScrollHijacked(true)
          
          // Lock body scroll when paywall appears
          document.body.style.overflow = 'hidden'
          document.body.style.position = 'fixed'
          document.body.style.width = '100%'
          document.body.style.top = `-${scrollTop}px`
        }
      }

      // Initial check
      handleScroll()
      
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [access.hasAccess, access.canViewPartial, scrollThreshold, showPaywall])

  // Handle scroll hijacking when paywall is active
  useEffect(() => {
    if (isScrollHijacked) {
      let animationFrame: number
      let targetPosition = paywallPosition
      let isAnimating = false
      let lastUpdateTime = 0
      const throttleDelay = 16 // ~60fps
      
      const handleHijackedScroll = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const now = Date.now()
        if (now - lastUpdateTime < throttleDelay) {
          return // Throttle updates
        }
        lastUpdateTime = now
        
        // Get scroll delta from wheel event
        const delta = e.deltaY
        const scrollSensitivity = 15 // Optimized sensitivity
        
        // Calculate new target position (0 = fully visible, 35 = initial position)
        const newTargetPosition = Math.max(0, Math.min(35, targetPosition - (delta / scrollSensitivity)))
        targetPosition = newTargetPosition
        
        // Only start animation if not already animating
        if (!isAnimating) {
          isAnimating = true
          
          const animateToTarget = () => {
            setPaywallPosition(currentPosition => {
              const difference = targetPosition - currentPosition
              
              if (Math.abs(difference) > 0.3) {
                const newPosition = currentPosition + (difference * 0.25) // Optimized easing
                animationFrame = requestAnimationFrame(animateToTarget)
                return newPosition
              } else {
                isAnimating = false
                return targetPosition
              }
            })
          }
          
          if (animationFrame) {
            cancelAnimationFrame(animationFrame)
          }
          animationFrame = requestAnimationFrame(animateToTarget)
        }
      }

      // Add wheel event listener for scroll hijacking
      window.addEventListener('wheel', handleHijackedScroll, { passive: false })
      
      return () => {
        window.removeEventListener('wheel', handleHijackedScroll)
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
        isAnimating = false
      }
    }
  }, [isScrollHijacked]) // Removed paywallPosition from dependencies

  // Cleanup body scroll lock when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [])

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
            paywallPosition={0}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={contentRef} className="relative">
        {/* Content with subtle blur effect when paywall is shown */}
        <div className={`transition-all duration-700 ${showPaywall ? 'blur-[2px] opacity-60' : ''}`}>
          {children}
        </div>

        {/* Paywall overlay */}
        <AnimatePresence>
          {showPaywall && (
            <PaywallContent 
              accessType={accessType}
              contentId={contentId}
              contentType={contentType}
              scrollProgress={scrollProgress}
              paywallPosition={paywallPosition}
            />
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
  paywallPosition?: number
}

function PaywallContent({ 
  accessType, 
  contentId, 
  contentType, 
  scrollProgress = 0,
  isImmediate = false,
  paywallPosition = 100
}: PaywallContentProps) {
  const { user, hasActiveSubscription } = useAccess()

  const getPaywallConfig = () => {
    // If premium content and user not logged in, show login first
    if (accessType === 'premium' && !user) {
      return {
        icon: UserIcon,
        title: 'Login to Continue Reading',
        subtitle: 'Create a free account to access this content',
        buttonText: 'Login',
        buttonAction: () => window.location.href = '/auth/login',
        gradient: 'from-blue-500 to-blue-600'
      }
    }
    
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3
      }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl"
      style={{ 
        transform: `translateY(${paywallPosition}%)`,
        height: '120vh' // Increased height for easier movement and more content space
      }}
    >
   

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            This article is only available to subscribers
          </h2>
          <p className="text-xl text-gray-600">
            Subscribe now for unlimited access to The Boardroom Magazine
          </p>
        </div>

        {/* Subscription Plans Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide">
              Step 1. Select Your Plan
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {/* Plan Options */}
          <div className="space-y-4">
            {/* Monthly Plan */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">All access - Monthly</h4>
                  <p className="text-sm text-gray-600">Unlimited access to The Boardroom Magazine</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">See details</span>
                <span className="text-lg font-bold text-gray-900">$16.50</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Annual Plan */}
            <div className="flex items-center justify-between p-4 border-2 border-brand-blue rounded-lg bg-blue-50">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 border-2 border-brand-blue rounded-full bg-brand-blue relative">
                  <div className="absolute inset-0.5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">All access - Annual</h4>
                  <p className="text-sm text-gray-600">Unlimited access to The Boardroom Magazine</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">See details</span>
                <span className="text-lg font-bold text-gray-900">$158.39</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* OR Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase font-medium">OR</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={config.buttonAction}
              className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 ${
                config.gradient.includes('blue') 
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-brand-blue text-white hover:bg-blue-700'
              }`}
            >
              {config.buttonText}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              {accessType === 'premium' && !user 
                ? 'Already have an account? Sign in to access this content'
                : 'Start your free trial today'
              }
            </p>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Subscribe?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Exclusive Content</h4>
                  <p className="text-sm text-gray-600">Access premium articles, interviews, and industry reports</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Expert Analysis</h4>
                  <p className="text-sm text-gray-600">In-depth insights from industry leaders and analysts</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Early Access</h4>
                  <p className="text-sm text-gray-600">Be the first to read breaking news and trends</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mobile App</h4>
                  <p className="text-sm text-gray-600">Read on-the-go with our mobile application</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Our Subscribers Say</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-brand-blue pl-4">
              <p className="text-gray-700 italic">"The Boardroom Magazine provides the most comprehensive coverage of business and industry insights. Worth every penny!"</p>
              <p className="text-sm text-gray-500 mt-2">- Sarah Johnson, Business Analyst</p>
            </div>
            <div className="border-l-4 border-brand-blue pl-4">
              <p className="text-gray-700 italic">"The exclusive interviews and market insights have been invaluable for my investment decisions."</p>
              <p className="text-sm text-gray-500 mt-2">- Michael Chen, Portfolio Manager</p>
            </div>
          </div>
        </div>

        {/* Progress indicator (only for scroll-based paywall) */}
        {!isImmediate && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <span>Scroll to continue</span>
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )}
        
        </div>
      </div>
    </motion.div>
  )
}

