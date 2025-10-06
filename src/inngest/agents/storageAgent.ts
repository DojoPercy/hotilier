import { createAgent, grok } from "@inngest/agent-kit";
import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';
import { writeClient } from '@/sanity/lib/client';

// Zod schema for storage parameters
const storageParamsSchema = z.object({
  contentId: z.string().describe('The ID of the original content document in Sanity'),
  contentType: z.enum(['article', 'interview', 'publication'])
    .describe('The type of content being summarized'),
  slug: z.string().describe('The slug of the content'),
  summary: z.object({
    shortSummary: z.string().describe('Short version of the summary'),
    mediumSummary: z.string().describe('Medium-length summary'),
    keyPoints: z.array(z.string()).describe('Key points extracted from the content'),
    tags: z.array(z.string()).describe('AI-generated tags for the summary'),
    sentiment: z.string().optional().describe('Sentiment analysis of the content'),
    topics: z.array(z.string()).optional().describe('Topics identified in the content')
  }).describe('The AI-generated summary data')
});

export const storageTool = createTool({
  name: 'storage_tool_agent',
  description: 'Saves AI-generated summaries into Sanity CMS and links them to the original content',
  parameters: storageParamsSchema,
  handler: async ({ contentId, contentType, slug, summary }) => {
    try {
      // Create a summary document in Sanity
      const summaryDoc = {
        _type: 'aiSummary',
        _id: `ai-summary-${contentId}`,
        contentId,
        contentType,
        slug,
        shortSummary: summary.shortSummary,
        mediumSummary: summary.mediumSummary,
        keyPoints: summary.keyPoints,
        aiGeneratedTags: summary.tags,
        sentiment: summary.sentiment,
        topics: summary.topics,
        generatedAt: new Date().toISOString(),
        status: 'completed'
      };

      // Create or update the summary document
      const result = await writeClient.createOrReplace(summaryDoc);

      // Update original content document with reference to summary
      await writeClient
        .patch(contentId)
        .set({
          aiSummary: {
            _type: 'reference',
            _ref: result._id
          },
          hasAISummary: true,
          summaryUpdatedAt: new Date().toISOString()
        })
        .commit();

      return {
        success: true,
        summaryId: result._id,
        message: 'Summary successfully stored and linked to content'
      };
    } catch (error) {
      console.error('StorageAgent Tool Error:', error);
      return {
        success: false,
        message: `Failed to store summary: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

export const storageAgent = createAgent({
    name:'storage_agent',
    description: 'stores the summary in the database',
    system: `
    You are a Storage Agent.
- Receive a validated summary in JSON format with fields: shortSummary, mediumSummary, keyPoints, tags, sentiment, topics.
- Save the summary into Sanity CMS under the appropriate dataset.
- Ensure the original content document links to the summary.
- Return success status and the ID of the stored summary.

    `,
    model: grok({
        model: 'openai/gpt-oss-20b',
        defaultParameters: {
            max_completion_tokens: 200,
            temperature: 0.1,
        },
    }),
    tools: [storageTool]
})

