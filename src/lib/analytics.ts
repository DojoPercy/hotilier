// Analytics utilities for tracking content recommendation engagement
// This helps measure the effectiveness of the smart content suggestions

interface RecommendationClickEvent {
  content_id: string;
  content_type: string;
  recommendation_source: 'smart_suggestions' | 'related_content' | 'trending' | 'diverse_types';
  current_content_id: string;
  current_content_type: string;
  position?: number;
  taxonomy_match?: string[];
}

interface RecommendationViewEvent {
  current_content_id: string;
  current_content_type: string;
  recommendation_count: number;
  recommendation_types: string[];
}

// Google Analytics 4 event tracking
export const trackRecommendationClick = (event: RecommendationClickEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'recommendation_click', {
      content_id: event.content_id,
      content_type: event.content_type,
      recommendation_source: event.recommendation_source,
      current_content_id: event.current_content_id,
      current_content_type: event.current_content_type,
      position: event.position,
      taxonomy_match: event.taxonomy_match?.join(',')
    });
  }

  // Also track in console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Recommendation Click:', event);
  }
};

export const trackRecommendationView = (event: RecommendationViewEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'recommendation_view', {
      current_content_id: event.current_content_id,
      current_content_type: event.current_content_type,
      recommendation_count: event.recommendation_count,
      recommendation_types: event.recommendation_types.join(',')
    });
  }

  // Also track in console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Recommendation View:', event);
  }
};

// Track content engagement metrics
export const trackContentEngagement = (contentId: string, contentType: string, action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'content_engagement', {
      content_id: contentId,
      content_type: contentType,
      action: action
    });
  }
};

// Track time spent on content (can be called periodically)
export const trackTimeOnContent = (contentId: string, contentType: string, timeSpent: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'time_on_content', {
      content_id: contentId,
      content_type: contentType,
      time_spent: timeSpent
    });
  }
};

// Track scroll depth for content engagement
export const trackScrollDepth = (contentId: string, contentType: string, depth: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll_depth', {
      content_id: contentId,
      content_type: contentType,
      scroll_depth: depth
    });
  }
};

// Track search queries for content discovery
export const trackContentSearch = (query: string, resultsCount: number, contentType?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'content_search', {
      search_term: query,
      results_count: resultsCount,
      content_type: contentType
    });
  }
};

// Track filter usage for content discovery
export const trackContentFilter = (filterType: string, filterValue: string, resultsCount: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'content_filter', {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount
    });
  }
};

// Track user preferences for personalization
export const trackUserPreference = (preferenceType: string, preferenceValue: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_preference', {
      preference_type: preferenceType,
      preference_value: preferenceValue
    });
  }
};

// Track conversion events (subscriptions, downloads, etc.)
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency
    });
  }
};

// Utility to get common taxonomy matches for analytics
export const getTaxonomyMatches = (currentContent: any, recommendedContent: any): string[] => {
  const matches: string[] = [];
  
  // Check sector matches
  if (currentContent.sectors && recommendedContent.sectors) {
    const currentSectorIds = currentContent.sectors.map((s: any) => s._id);
    const matchingSectors = recommendedContent.sectors.filter((s: any) => 
      currentSectorIds.includes(s._id)
    );
    matchingSectors.forEach((sector: any) => matches.push(`sector:${sector.title}`));
  }
  
  // Check region matches
  if (currentContent.regions && recommendedContent.regions) {
    const currentRegionIds = currentContent.regions.map((r: any) => r._id);
    const matchingRegions = recommendedContent.regions.filter((r: any) => 
      currentRegionIds.includes(r._id)
    );
    matchingRegions.forEach((region: any) => matches.push(`region:${region.title}`));
  }
  
  // Check tag matches
  if (currentContent.tags && recommendedContent.tags) {
    const currentTagIds = currentContent.tags.map((t: any) => t._id);
    const matchingTags = recommendedContent.tags.filter((t: any) => 
      currentTagIds.includes(t._id)
    );
    matchingTags.forEach((tag: any) => matches.push(`tag:${tag.title}`));
  }
  
  return matches;
};

// Social Share Analytics
export const trackSocialShare = (data: {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'copy';
  content_url: string;
  content_title: string;
  content_type: string;
}) => {
  try {
    // Google Analytics 4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: data.platform,
        content_type: data.content_type,
        item_id: data.content_url,
        item_name: data.content_title,
        custom_parameter_1: data.platform
      });
    }

    // Custom analytics event
    const shareEvent = {
      event: 'social_share',
      timestamp: new Date().toISOString(),
      platform: data.platform,
      content_url: data.content_url,
      content_title: data.content_title,
      content_type: data.content_type,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      referrer: typeof window !== 'undefined' ? document.referrer : ''
    };

    // Send to your analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareEvent),
      }).catch(error => {
        console.error('Error tracking social share:', error);
      });
    }

    console.log('Social share tracked:', shareEvent);
  } catch (error) {
    console.error('Error tracking social share:', error);
  }
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

