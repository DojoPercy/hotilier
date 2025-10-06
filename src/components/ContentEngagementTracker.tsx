'use client';

import { useContentEngagement } from '@/hooks/useContentEngagement';

interface ContentEngagementTrackerProps {
  contentId: string;
  contentType: string;
  enabled?: boolean;
}

export default function ContentEngagementTracker({
  contentId,
  contentType,
  enabled = true
}: ContentEngagementTrackerProps) {
  useContentEngagement({
    contentId,
    contentType,
    enabled
  });

  // This component doesn't render anything, it just tracks engagement
  return null;
}

