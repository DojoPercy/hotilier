import { createServer } from '@inngest/agent-kit/server';
import { contentProcessingNetwork } from './network';

// Create the AgentKit server
export const agentKitServer = createServer({
  networks: [contentProcessingNetwork],
});

// Start the server
const PORT = process.env.AGENTKIT_PORT || 3010;

if (process.env.NODE_ENV !== 'production') {
  agentKitServer.listen(PORT, () => {
    console.log(`🤖 AgentKit server running on port ${PORT}`);
  });
}
