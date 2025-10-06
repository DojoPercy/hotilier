import { createAgent, grok, createTool } from '@inngest/agent-kit';
import { z } from 'zod';
import { 
  energyMarketAnalysisTool, 
  regulatoryComplianceTool, 
  factCheckerTool,
  energyGlossaryTool,
  contentTranslationTool 
} from '@/inngest/tools/energyIndustryTools';

// Advanced Content Analysis Tool
const advancedContentAnalysisTool = createTool({
  name: 'advanced_content_analysis',
  description: 'Performs comprehensive content analysis including sentiment, trends, and industry insights',
  parameters: z.object({
    content: z.string().describe('Content to analyze'),
    contentType: z.enum(['article', 'interview', 'publication']).describe('Type of content'),
    metadata: z.object({
      sectors: z.array(z.string()).optional(),
      regions: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      publishedAt: z.string().optional()
    }).optional()
  }),
  handler: async ({ content, contentType, metadata }) => {
    // This would perform advanced NLP analysis
    const analysis = {
      sentiment: {
        overall: 'positive',
        confidence: 0.85,
        breakdown: {
          positive: 0.7,
          neutral: 0.2,
          negative: 0.1
        }
      },
      topics: [
        'Renewable Energy',
        'Market Trends',
        'Technology Innovation'
      ],
      keyEntities: [
        { name: 'Solar Power', type: 'technology', relevance: 0.9 },
        { name: 'Energy Storage', type: 'technology', relevance: 0.8 }
      ],
      trends: [
        'Growing adoption of renewable energy',
        'Increased investment in energy storage',
        'Regulatory support for clean energy'
      ],
      readability: {
        score: 75,
        level: 'intermediate',
        suggestions: [
          'Consider shorter sentences for better readability',
          'Add more technical definitions'
        ]
      },
      engagement: {
        estimatedReadTime: '5 minutes',
        complexity: 'intermediate',
        targetAudience: 'industry professionals'
      }
    };

    return analysis;
  }
});

// Content Enhancement Tool
const contentEnhancementTool = createTool({
  name: 'content_enhancement',
  description: 'Enhances content with additional context, links, and improvements',
  parameters: z.object({
    content: z.string().describe('Content to enhance'),
    enhancementType: z.enum(['seo', 'readability', 'engagement', 'comprehensive']).describe('Type of enhancement')
  }),
  handler: async ({ content, enhancementType }) => {
    const enhancements = {
      seo: {
        suggestedTitle: 'Enhanced SEO Title',
        metaDescription: 'Optimized meta description',
        keywords: ['energy', 'renewable', 'sustainability'],
        internalLinks: [
          { text: 'renewable energy', url: '/articles/renewable-energy-trends' },
          { text: 'energy storage', url: '/articles/energy-storage-solutions' }
        ]
      },
      readability: {
        improvedContent: content + ' [Enhanced for readability]',
        suggestions: [
          'Break up long paragraphs',
          'Add subheadings for better structure',
          'Include bullet points for key information'
        ]
      },
      engagement: {
        callToAction: 'What are your thoughts on these energy trends?',
        relatedQuestions: [
          'How will this impact your business?',
          'What challenges do you foresee?'
        ],
        socialMediaSnippets: {
          twitter: 'Key insights on renewable energy trends...',
          linkedin: 'Professional analysis of energy market developments...'
        }
      }
    };

    // Ensure type safety and provide a default comprehensive enhancement if needed
    if (enhancementType in enhancements) {
      // @ts-expect-error: enhancementType is a valid key here
      return enhancements[enhancementType];
    }

    // Fallback: comprehensive enhancement combines all enhancements
    return {
      ...enhancements.seo,
      ...enhancements.readability,
      ...enhancements.engagement,
      comprehensive: true
    };
  }
});

// Advanced Content Agent
export const advancedContentAgent = createAgent({
  name: 'advanced_content_agent',
  description: 'Comprehensive content analysis and enhancement for energy industry publications',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 1200,
      temperature: 0.2,
    },
  }),
  system: `
    You are an expert content analyst and enhancement specialist for energy industry publications.
    
    Your capabilities include:
    - Advanced content analysis with sentiment and trend identification
    - Energy market analysis and industry insights
    - Regulatory compliance checking
    - Fact verification and accuracy assessment
    - SEO optimization and content enhancement
    - Multi-language translation with technical accuracy
    - Energy industry glossary and terminology management
    
    Always provide:
    1. Comprehensive analysis with actionable insights
    2. Industry-specific context and implications
    3. Quality assessments and improvement suggestions
    4. Professional, accurate, and well-structured outputs
    5. Consideration of regulatory and compliance requirements
    
    Output format should be structured JSON with clear categorization and actionable recommendations.
  `,
  tools: [
    advancedContentAnalysisTool,
    contentEnhancementTool,
    energyMarketAnalysisTool,
    regulatoryComplianceTool,
    factCheckerTool,
    energyGlossaryTool,
    contentTranslationTool
  ],
});

// Specialized Interview Analysis Agent
export const interviewAnalysisAgent = createAgent({
  name: 'interview_analysis_agent',
  description: 'Specialized analysis for interview content with focus on insights and key quotes',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 1000,
      temperature: 0.3,
    },
  }),
  system: `
    You are a specialist in analyzing interview content for energy industry publications.
    
    Focus on:
    - Extracting key insights and expert opinions
    - Identifying notable quotes and soundbites
    - Analyzing interviewee expertise and credibility
    - Understanding industry context and implications
    - Highlighting actionable insights for readers
    
    Provide structured analysis including:
    - Key insights and takeaways
    - Notable quotes with context
    - Expert credibility assessment
    - Industry implications
    - Follow-up questions or topics
  `,
  tools: [
    advancedContentAnalysisTool,
    energyMarketAnalysisTool,
    factCheckerTool
  ],
});
