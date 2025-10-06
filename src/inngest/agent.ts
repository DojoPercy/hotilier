import { createNetwork, getDefaultRoutingAgent, grok, createTool, createAgent } from "@inngest/agent-kit";

import { createServer } from "@inngest/agent-kit/server";
import Events from "./constants";
import { inngest } from "./client";
import { summarizerAgent } from "./agents/summarizerAgent";
import { storageAgent } from "./agents/storageAgent";
import { z } from "zod";


const agentNetwork = createNetwork({
    name: 'Content Processing Network',
    agents: [
        summarizerAgent,
        storageAgent
    ],
    defaultModel: grok({
       model: 'openai/gpt-oss-20b',
       defaultParameters:{
        max_completion_tokens: 1000,
        temperature: 0.3,
       } 
    }),
    defaultRouter: ({ network, input }) => {
        // Check if content has been processed and saved
        const savedToDatabase = network.state.data.savedItem;
        
        if (savedToDatabase) {
            // If already saved, end the workflow
            return undefined;
        }
        
        // Check if we have content to process
        const hasContent = network.state.data.content;
        
        // Check if input is an object with contentId and contentType
        const inputData = typeof input === 'object' && input !== null ? input as any : {};
        
        if (!hasContent && inputData?.contentId && inputData?.contentType) {
            // If we have contentId and contentType but no content yet, use summarizer to fetch and process
            return summarizerAgent;
        }
        
        if (hasContent && !savedToDatabase) {
            // If we have content but haven't saved yet, use storage agent
            return storageAgent;
        }
        
        // Default to summarizer agent for initial processing
        return summarizerAgent;
    }
})

export const server = createServer({
    agents: [summarizerAgent, storageAgent],
    networks: [agentNetwork]
});

export const fetchSummarizeAndStoreContent = inngest.createFunction(
    {id: 'fetch-summarize-and-store-content'},
    {event: Events.fetchSummarizeAndStoreContent},
    async ({ event }) => {
        const { contentId, contentType, slug } = event.data;
      
        const result = await agentNetwork.run(
          `Please process this content for summarization:
          
          Content ID: ${contentId}
          Content Type: ${contentType}
          Slug: ${slug}
          
          Step 1: Use the content_fetcher_tool with these parameters:
          - contentType: "${contentType}"
          - slug: "${slug}"
          - contentId: "${contentId}"
          
          Step 2: Use the content_cleaner_tool to clean the fetched content
          
          Step 3: Create a comprehensive summary following the JSON format specified in your system prompt
          
          Step 4: Use the storage agent to save the summary to the database
          
          Make sure to follow this exact sequence and use the tools in the correct order.`
        );
      
        return result.state.data.savedItem;
      }
      
)