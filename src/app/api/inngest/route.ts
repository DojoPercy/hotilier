import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";

import { fetchSummarizeAndStoreContent } from "@/inngest/agent";

// Create an API that serves all Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
   fetchSummarizeAndStoreContent
  ],
});