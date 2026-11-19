/** Copied from planttrust-backend contracts/m3-mcp-ai.md. Keep the two in sync. */
export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskCheckResult {
  projectId: string;
  level: RiskLevel;
  reasons: string[];
}

export interface ChatReply {
  reply: string;
  /** Which MCP tool answered, e.g. list_open_projects. */
  tool?: string;
}

export interface ModuleHealth {
  module: string;
  status: string;
}
