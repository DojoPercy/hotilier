import { createNetwork, createAgent, grok, createTool } from "@inngest/agent-kit";
import { z } from "zod";

// Enhanced Content Analysis Agent
export const contentAnalysisAgent = createAgent({
  name: 'content_analysis_agent',
  description: 'Advanced content analysis with sentiment, topic extraction, and trend identification',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 800,
      temperature: 0.2,
    },
  }),
  system: `
    You are an expert content analyst for energy and business publications.
    - Analyze content for sentiment, key themes, and industry trends
    - Extract actionable insights and implications
    - Identify potential follow-up stories or related topics
    - Assess content quality and engagement potential
    - Output structured JSON with comprehensive analysis
  `,
  tools: [
    // Add specialized analysis tools here
  ],
});

// Content Recommendation Agent
export const recommendationAgent = createAgent({
  name: 'recommendation_agent',
  description: 'Generates personalized content recommendations based on user behavior and content analysis',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 600,
      temperature: 0.3,
    },
  }),
  system: `
    You are a content recommendation specialist.
    - Analyze user reading patterns and preferences
    - Suggest relevant articles, interviews, and publications
    - Consider content recency, relevance, and user engagement
    - Generate personalized reading lists and topic suggestions
  `,
  tools: [
    // Add recommendation tools here
  ],
});

// SEO Optimization Agent
export const seoAgent = createAgent({
  name: 'seo_optimization_agent',
  description: 'Optimizes content for search engines and social media',
  model: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 500,
      temperature: 0.4,
    },
  }),
  system: `
    You are an SEO and content optimization expert.
    - Generate SEO-friendly titles and meta descriptions
    - Suggest relevant keywords and tags
    - Create social media snippets and summaries
    - Optimize content structure for readability and engagement
  `,
  tools: [
    // Add SEO tools here
  ],
});

// Enhanced Network with Advanced Routing
export const enhancedContentNetwork = createNetwork({
  name: 'Enhanced Content Processing Network',
  agents: [
    contentAnalysisAgent,
    recommendationAgent,
    seoAgent,
  ],
  defaultModel: grok({
    model: 'openai/gpt-oss-20b',
    defaultParameters: {
      max_completion_tokens: 1000,
      temperature: 0.3,
    },
  }),
  defaultRouter: ({ network, input }) => {
    const inputData = typeof input === 'object' && input !== null ? input as any : {};
    const { contentType, analysisType } = inputData;
    
    // Route based on analysis type
    switch (analysisType) {
      case 'content_analysis':
        return contentAnalysisAgent;
      case 'recommendations':
        return recommendationAgent;
      case 'seo_optimization':
        return seoAgent;
      default:
        return contentAnalysisAgent;
    }
  }
});
