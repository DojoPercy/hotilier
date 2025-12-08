import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  try {
    const { contentId } = await params;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // Query for the AI summary document
    const summaryQuery = `*[_type == "aiSummary" && contentId == $contentId][0]`;
    const summary = await client.fetch(summaryQuery, { contentId });

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedSummary = {
      shortSummary: summary.shortSummary,
      mediumSummary: summary.mediumSummary,
      keyPoints: summary.keyPoints || [],
      tags: summary.aiGeneratedTags || [],
      sentiment: summary.sentiment || 'neutral',
      topics: summary.topics || [],
      generatedAt: summary.generatedAt
    };

    return NextResponse.json({
      success: true,
      summary: formattedSummary
    });

  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
