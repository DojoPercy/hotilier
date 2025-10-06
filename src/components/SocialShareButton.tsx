'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { trackSocialShare } from '@/lib/analytics';
import { getBaseUrl } from '@/lib/urls';

interface SocialShareButtonProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showLabel?: boolean;
}

export default function SocialShareButton({
  url,
  title,
  description = '',
  hashtags = [],
  className = '',
  variant = 'default',
  showLabel = true
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    const encodedHashtags = hashtags.map(tag => `%23${tag.replace('#', '')}`).join('');

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=TheBoardroomMag${encodedHashtags ? `&hashtags=${encodedHashtags}` : ''}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setIsOpen(false);
        return;
    }

    // Track social share
    trackSocialShare({
      platform,
      content_url: url,
      content_title: title,
      content_type: 'article' // This will be passed from parent components
    });

    // Open share window
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    setIsOpen(false);
  };

  const getButtonText = () => {
    if (variant === 'compact') return 'Share';
    if (variant === 'minimal') return '';
    return 'Share Article';
  };

  const getButtonSize = () => {
    switch (variant) {
      case 'compact':
        return 'px-3 py-2 text-sm';
      case 'minimal':
        return 'p-2';
      default:
        return 'px-4 py-2';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 'w-4 h-4';
      case 'minimal':
        return 'w-5 h-5';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center space-x-2 
           text-brand-blue 
          hover:text-vibrant-blue 
          transition-colors duration-200 
          cursor-pointer
          font-medium
          ${getButtonSize()}
          ${variant === 'minimal' ? '-full' : ''}
        `}
        aria-label="Share article"
      >
        <Share2 className={getIconSize()} />
        {showLabel && variant !== 'minimal' && (
          <span>{getButtonText()}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                Share on Facebook
              </button>

              {/* Twitter/X */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                <Twitter className="w-4 h-4 mr-3 text-gray-900" />
                Share on X (Twitter)
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 mr-3 text-blue-700" />
                Share on LinkedIn
              </button>

              {/* Copy Link */}
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-3 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-3 text-gray-600" />
                )}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Individual Social Share Buttons for inline use
export function FacebookShareButton({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const handleShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    trackSocialShare({
      platform: 'facebook',
      content_url: url,
      content_title: title,
      content_type: 'article'
    });
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 ${className}`}
      aria-label="Share on Facebook"
    >
      <Facebook className="w-5 h-5" />
    </button>
  );
}

export function TwitterShareButton({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const handleShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&via=TheBoardroomMag`;
    trackSocialShare({
      platform: 'twitter',
      content_url: url,
      content_title: title,
      content_type: 'article'
    });
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200 ${className}`}
      aria-label="Share on X (Twitter)"
    >
      <Twitter className="w-5 h-5" />
    </button>
  );
}

export function LinkedInShareButton({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const handleShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    trackSocialShare({
      platform: 'linkedin',
      content_url: url,
      content_title: title,
      content_type: 'article'
    });
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors duration-200 ${className}`}
      aria-label="Share on LinkedIn"
    >
      <Linkedin className="w-5 h-5" />
    </button>
  );
}

// Horizontal Social Share Bar
export function SocialShareBar({ 
  url, 
  title, 
  description, 
  hashtags = [],
  className = '' 
}: {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex items-center space-x-2">
        <FacebookShareButton url={url} title={title} />
        <TwitterShareButton url={url} title={title} />
        <LinkedInShareButton url={url} title={title} />
      </div>
    </div>
  );
}
