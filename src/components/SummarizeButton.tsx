'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Eye, Bot } from 'lucide-react';
import SummaryPopup from './SummaryPopup';

interface SummarizeButtonProps {
  contentType: 'article' | 'interview' | 'publication';
  slug: string;
  contentId: string;
  title?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

type SummarizationStatus = 'idle' | 'processing' | 'completed' | 'error';

export default function SummarizeButton({
  contentType,
  slug,
  contentId,
  title,
  className = '',
  variant = 'default'
}: SummarizeButtonProps) {
  const [status, setStatus] = useState<SummarizationStatus>('idle');
  const [message, setMessage] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSummarize = async () => {
    try {
      setStatus('processing');
      setMessage('Generating AI summary...');

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          slug,
          contentId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('completed');
        setMessage('Summary ready! Click to view.');
        
        // Reset message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to generate summary');
        
        // Reset message after 5 seconds
        setTimeout(() => {
          setMessage('');
          setStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Summarization error:', error);
      setStatus('error');
      setMessage('Network error occurred');
      
      // Reset message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setStatus('idle');
      }, 5000);
    }
  };

  const handleViewSummary = () => {
    setShowPopup(true);
  };

  const getButtonText = () => {
    switch (status) {
      case 'processing':
        return 'Generating...';
      case 'completed':
        return 'View Summary';
      case 'error':
        return 'Try Again';
      default:
        return variant === 'compact' ? 'AI Summary' : 'Generate AI Summary';
    }
  };

  const getButtonIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <Eye className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center space-x-2 font-medium transition-colors duration-200 -md';
    
    switch (status) {
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-700 cursor-not-allowed`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-brand-blue text-white hover:bg-vibrant-blue`;
    }

    switch (variant) {
      case 'compact':
        return `${baseClasses} px-3 py-2 text-sm`;
      case 'minimal':
        return `${baseClasses} p-2 -full`;
      default:
        return `${baseClasses} px-4 py-2`;
    }
  };

  const handleClick = () => {
    if (status === 'completed') {
      handleViewSummary();
    } else if (status === 'idle' || status === 'error') {
      handleSummarize();
    }
  };

  return (
    <>
      <div className={`flex flex-col items-start space-y-2 ${className}`}>
  <button
    onClick={handleClick}
    disabled={status === 'processing'}
    className={`flex items-center gap-2 -xl px-5 py-2.5 
                text-sm font-medium transition-all duration-200 shadow-sm
                ${
                  status === 'processing'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-blue text-white hover:bg-[#1d1d59]'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue`}
    aria-label={status === 'completed' ? 'View AI summary' : 'Generate AI summary'}
  >
    <span className="flex-shrink-0">{getButtonIcon()}</span>
    {variant !== 'minimal' && (
      <span className="tracking-wide">{getButtonText()}</span>
    )}
  </button>

  {message && (
    <p
      className={`text-sm font-medium transition-colors ${
        status === 'completed'
          ? 'text-green-700'
          : status === 'error'
          ? 'text-red-600'
          : 'text-brand-blue'
      }`}
    >
      {message}
    </p>
  )}
</div>


      <SummaryPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        contentId={contentId}
        contentType={contentType}
        title={title || 'Content Summary'}
      />
    </>
  );
}
