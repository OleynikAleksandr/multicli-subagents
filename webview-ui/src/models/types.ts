// Duplicate of src/models/sub-agent.ts in extension
// Ideally we would share this, but for MVP separate file is fine.

export type AgentProviderId = "codex" | "claude" | "custom";

export type ProviderConfig = {
  model?: string;
  temperature?: number;
  [key: string]: unknown;
};

export type SubAgentMetadata = {
  author?: string;
  version?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type SubAgent = {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  instructions: string; // Markdown content
  supportedProviders: AgentProviderId[];
  providerConfigs?: Record<string, ProviderConfig>;
  metadata: SubAgentMetadata;
};
