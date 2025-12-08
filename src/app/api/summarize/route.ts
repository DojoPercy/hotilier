import { NextRequest, NextResponse } from 'next/server';
import { triggerContentSummarization } from '@/lib/summarization';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, slug, contentId, userId } = body;

    // Validate required fields
    if (!contentType || !slug || !contentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: contentType, slug, contentId' 
        },
        { status: 400 }
      );
    }

    // Validate contentType
    if (!['article', 'interview', 'publication'].includes(contentType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid contentType. Must be: article, interview, or publication' 
        },
        { status: 400 }
      );
    }

    // Trigger the summarization workflow
    const result = await triggerContentSummarization({
      contentType,
      slug,
      contentId,
      userId
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Summarization workflow started successfully',
        eventId: result.eventId
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: result.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Summarization API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get('contentId');

  if (!contentId) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing contentId parameter' 
      },
      { status: 400 }
    );
  }

  try {
    // This would typically query your database for the summarization status
    // For now, we'll return a placeholder response
    return NextResponse.json({
      success: true,
      contentId,
      status: 'processing',
      message: 'Summarization status retrieved'
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get summarization status' 
      },
      { status: 500 }
    );
  }
}
