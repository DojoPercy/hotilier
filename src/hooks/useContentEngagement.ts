'use client';

import { useEffect, useRef } from 'react';
import { trackTimeOnContent, trackScrollDepth, trackContentEngagement } from '@/lib/analytics';

interface UseContentEngagementProps {
  contentId: string;
  contentType: string;
  enabled?: boolean;
}

export const useContentEngagement = ({ 
  contentId, 
  contentType, 
  enabled = true 
}: UseContentEngagementProps) => {
  const startTimeRef = useRef<number>(Date.now());
  const lastScrollDepthRef = useRef<number>(0);
  const hasTrackedEngagementRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    // Track content view
    trackContentEngagement(contentId, contentType, 'view');

    // Track time on content every 30 seconds
    const timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnContent(contentId, contentType, timeSpent);
    }, 30000);

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);

      // Track at 25%, 50%, 75%, and 100% scroll depth
      if (scrollDepth >= 25 && lastScrollDepthRef.current < 25) {
        trackScrollDepth(contentId, contentType, 25);
      } else if (scrollDepth >= 50 && lastScrollDepthRef.current < 50) {
        trackScrollDepth(contentId, contentType, 50);
      } else if (scrollDepth >= 75 && lastScrollDepthRef.current < 75) {
        trackScrollDepth(contentId, contentType, 75);
      } else if (scrollDepth >= 100 && lastScrollDepthRef.current < 100) {
        trackScrollDepth(contentId, contentType, 100);
      }

      lastScrollDepthRef.current = scrollDepth;
    };

    // Track when user leaves the page
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnContent(contentId, contentType, timeSpent);
      trackContentEngagement(contentId, contentType, 'exit');
    };

    // Track when user becomes inactive (no mouse/keyboard activity for 30 seconds)
    let inactivityTimer: NodeJS.Timeout;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!hasTrackedEngagementRef.current) {
          trackContentEngagement(contentId, contentType, 'inactive');
          hasTrackedEngagementRef.current = true;
        }
      }, 30000);
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    // Start inactivity timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      clearInterval(timeInterval);
      clearTimeout(inactivityTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);

      // Final time tracking
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      trackTimeOnContent(contentId, contentType, timeSpent);
    };
  }, [contentId, contentType, enabled]);

  // Function to manually track engagement events
  const trackEngagement = (action: string) => {
    trackContentEngagement(contentId, contentType, action);
  };

  return { trackEngagement };
};

