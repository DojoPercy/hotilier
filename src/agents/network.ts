import { createAgent, createNetwork, openai } from '@inngest/agent-kit';

// Content Fetcher Agent
const contentFetcherAgent = createAgent({
  name: 'Content Fetcher',
  description: 'Retrieves raw content (articles, blogs, news) from Sanity CMS.',
  model: openai({ model: 'gemini-2.5-flash-lite' }),
  system: `
    You are a Content Fetcher.
    - Your job is to retrieve raw content from Sanity CMS.
    - Do not modify or clean the content.
    - Always return content in its original structure (title, body, author, tags).
    - If content is missing or incomplete, return an error message.
  `,
});

// Content Cleaner Agent  
const contentCleanerAgent = createAgent({
  name: 'Content Cleaner',
  description: 'Cleans and preprocesses raw content for AI summarization.',
  model: openai({ model: 'gemini-2.5-flash-lite' }),
  system: `
    You are a Content Cleaner.
    - Remove unnecessary formatting, broken HTML, or irrelevant text (ads, unrelated links).
    - Ensure clean structured output with fields: {title, body, author, tags}.
    - Do NOT summarize or shorten, just clean and prepare for summarization.
  `,
});

// Summarizer Agent
const summarizerAgent = createAgent({
  name: 'Content Summarizer',
  description: 'Generates structured summaries of business and energy content.',
  model: openai({ model: 'gemini-2.5-flash-lite' }),
  system: `
    You are an Expert Content Summarizer for The Boardroom Magazine.
    - Your goal is to create detailed, yet concise summaries of business and energy articles.
    - Always cover:
      1. Main topic
      2. Key insights
      3. Business or energy impact
      4. Notable quotes/statistics
    - Write in a professional, journalistic style (neutral tone).
    - Output in JSON: {title, summary, keyInsights, tags}.
  `,
});

// Review & Validator Agent (NEW - ensures quality before saving)
const reviewAgent = createAgent({
  name: 'Review Agent',
  description: 'Validates AI-generated summaries for accuracy and structure.',
  model: openai({ model: 'gemini-2.5-flash-lite' }),
  system: `
    You are a Review Agent.
    - Verify the summary is factually consistent with the cleaned content.
    - Ensure output matches required JSON format.
    - Flag issues if content is missing, biased, or improperly structured.
  `,
});

// Storage Agent
const storageAgent = createAgent({
  name: 'Storage Agent', 
  description: 'Stores AI-generated summaries into Sanity CMS.',
  model: openai({ model: 'gemini-2.5-flash-lite' }),
  system: `
    You are a Storage Agent.
    - Receive a validated summary in JSON format.
    - Save it into Sanity CMS under the "summaries" dataset.
    - Confirm successful storage with an acknowledgment.
  `,
});

// Create the network
export const contentProcessingNetwork = createNetwork({
  name: 'Content Processing Network',
  agents: [
    contentFetcherAgent,
    contentCleanerAgent,
    summarizerAgent,
    reviewAgent,
    storageAgent,
  ],
  defaultModel: openai({ model: 'gemini-2.5-flash-lite' }),
});
