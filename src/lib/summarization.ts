import { inngest } from '@/inngest/client';

interface TriggerSummarizationParams {
  contentType: 'article' | 'interview' | 'publication';
  slug: string;
  contentId: string;
  userId?: string;
}

/**
 * Triggers the AI content summarization workflow
 */
export async function triggerContentSummarization({
  contentType,
  slug,
  contentId,
  userId
}: TriggerSummarizationParams) {
  try {
    const result = await inngest.send({
      name: 'content.summarize.requested',
      data: {
        contentType,
        slug,
        contentId,
        userId
      }
    });

    console.log('Summarization workflow triggered:', result);
    return {
      success: true,
      eventId: result.ids[0],
      message: 'Summarization workflow started successfully'
    };
  } catch (error) {
    console.error('Failed to trigger summarization workflow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to start summarization workflow'
    };
  }
}

/**
 * Get the status of a summarization workflow
 */
export async function getSummarizationStatus(contentId: string) {
  try {
    // This would typically query your database or Inngest's event history
    // For now, we'll return a placeholder
    return {
      contentId,
      status: 'processing', // 'pending' | 'processing' | 'completed' | 'failed'
      message: 'Summarization in progress'
    };
  } catch (error) {
    console.error('Failed to get summarization status:', error);
    return {
      contentId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
