/**
 * URL utility functions for generating correct production URLs
 */

const PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://theboardroommagazine.com';

/**
 * Get the base URL for the current environment
 */
export const getBaseUrl = (): string => {
  // In production, use the production domain
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_DOMAIN;
  }
  
  // In development, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side rendering
  return 'http://localhost:3000';
};

/**
 * Generate a full URL for content sharing
 */
export const getContentUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate URLs for different content types
 */
export const getArticleUrl = (slug: string): string => {
  return getContentUrl(`/articles/${slug}`);
};

export const getInterviewUrl = (slug: string): string => {
  return getContentUrl(`/interviews/${slug}`);
};

export const getPublicationUrl = (slug: string): string => {
  return getContentUrl(`/publications/${slug}`);
};

export const getVideoUrl = (slug: string): string => {
  return getContentUrl(`/videos/${slug}`);
};

export const getEventUrl = (slug: string): string => {
  return getContentUrl(`/events/${slug}`);
};

export const getSpecialReportUrl = (slug: string): string => {
  return getContentUrl(`/special-reports/${slug}`);
};
