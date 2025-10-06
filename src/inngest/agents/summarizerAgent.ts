import { createAgent, grok } from '@inngest/agent-kit';
import { createTool } from '@inngest/agent-kit';
import { z } from 'zod';
import { client } from '@/sanity/lib/client';
import { getArticleBySlug, getInterviewBySlug, getPublicationBySlug } from '@/sanity/lib/queries';

const cleanerParamsSchema = z.object({
    contentId: z.string().describe('The internal ID of the content'),
    contentType: z.enum(['article', 'interview', 'publication'])
      .describe('The type of content being cleaned'),
    slug: z.string().describe('The unique slug of the content'),
    fetchedContent: z.object({
      content: z.object({
        title: z.string().optional(),
        body: z.any().optional(),
        dek: z.string().optional(),
        interviewee: z.any().optional(),
        roleAtTime: z.string().optional(),
        organizationAtTime: z.any().optional(),
        sectors: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        regions: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        tags: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        publishedAt: z.string().optional(),
        _id: z.string().optional(),
        _type: z.string().optional()
      }).describe('Raw content fetched from CMS'),
      metadata: z.object({
        type: z.string(),
        sectors: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        regions: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        tags: z.array(z.object({
          title: z.string(),
          _id: z.string().optional()
        })).optional(),
        publishedAt: z.string().optional(),
      }),
    }).describe('Content and metadata fetched from CMS')
  });
  
  export const contentCleaner = createTool({
    name: 'content_cleaner_tool',
    description: 'Cleans raw content from CMS: removes HTML, fixes formatting, and structures data for summarization',
    parameters: cleanerParamsSchema,
    handler: async ({ contentId, contentType, slug, fetchedContent }) => {
      try {
        const { content, metadata } = fetchedContent;
  
        // Extract and clean body content
        let bodyText = '';
        if (content.body && Array.isArray(content.body)) {
          bodyText = content.body
            .map((block: any) => {
              if (block._type === 'block' && block.children) {
                return block.children.map((child: any) => child.text || '').join('');
              }
              return '';
            })
            .join('\n\n')
            .trim();
        }
  
        bodyText = bodyText
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n\n')
          .trim();
  
        // Extract interviewee info if applicable
        let interviewee;
        if (contentType === 'interview' && content.interviewee) {
          interviewee = {
            name: content.interviewee.name || '',
            role: (content as any).roleAtTime || content.interviewee.role || '',
            organization: (content as any).organizationAtTime?.name || content.interviewee.organization?.name || '',
            bio: content.interviewee.bio || ''
          };
        }
  
        // Prepare cleaned content
        const cleanedContent = {
          title: content.title || '',
          dek: content.dek || '',
          body: bodyText,
          interviewee,
          metadata: {
            type: metadata.type,
            sectors: metadata.sectors?.map((s: any) => s.title) || [],
            regions: metadata.regions?.map((r: any) => r.title) || [],
            tags: metadata.tags?.map((t: any) => t.title) || [],
            publishedAt: metadata.publishedAt
          }
        };
  
        return { cleanedContent };
      } catch (error) {
        console.error('ContentCleaner Tool Error:', error);
        throw new Error(`Failed to clean content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });
// Define parameters using Zod with descriptions
const fetcherParamsSchema = z.object({
  contentType: z.enum(['article', 'interview', 'publication'])
    .describe('The type of content to fetch: article, interview, or publication.'),
  slug: z.string().min(1, 'Slug is required')
    .describe('The unique slug identifier of the content.'),
  contentId: z.string().optional()
    .describe('Optional internal content ID for reference.'),
});

export const contentFetcher = createTool({
  name: 'content_fetcher_tool',
  description: 'Retrieves content from Sanity CMS based on content type and slug.',
  parameters: fetcherParamsSchema,
  handler: async ({ contentType, slug, contentId }) => {
    try {
      let content;

      switch (contentType) {
        case 'article':
          content = await client.fetch(getArticleBySlug, { slug });
          break;
        case 'interview':
          content = await client.fetch(getInterviewBySlug, { slug });
          break;
        case 'publication':
          content = await client.fetch(getPublicationBySlug, { slug });
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      if (!content) {
        throw new Error(`Content not found for ${contentType} with slug: ${slug}`);
      }

      const metadata = {
        type: contentType,
        id: content._id,
        title: content.title,
        slug: content.slug?.current || slug,
        publishedAt: content.publishedAt,
        sectors: content.sectors || [],
        regions: content.regions || [],
        tags: content.tags || [],
      };

      return { content, metadata };
    } catch (error) {
      console.error('ContentFetcher Error:', error);
      throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});


export const summarizerAgent = createAgent({
  name: 'summarizer_agent',
  description: 'Responsible for summarizing content in a professional, journalist tone',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 500,
      temperature: 0.3,
    },
  }),
  system: `
    You are an expert content summarizer for business and energy publications.
    - Write in a professional, neutral, and journalist style.
    - Extract main topics, key insights, implications, notable quotes, and tags.
    - Output must be JSON in the format:
      {
        title: string,
        summary: string,
        keyInsights: string[],
        tags: string[]
      }
    - Do not add opinions or speculative statements.
    - Ensure the output is clean and structured.
  `,
  tools: [
    contentFetcher,
    contentCleaner
  ],
});



