import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
// biome-ignore lint/performance/noNamespaceImport: VS Code API requires namespace import
import * as vscode from "vscode";
import type { SubAgent } from "../models/sub-agent";

/**
 * Manifest file structure for .subagents/manifest.json
 */
type ManifestFile = {
  version: string;
  agents: {
    name: string;
    description: string;
    instructionsPath: string;
    commands: { start: string; resume: string };
  }[];
};

/**
 * Slash command template for Codex CLI
 * Note: Codex only supports global prompts in ~/.codex/prompts/
 */
const CODEX_SLASH_COMMAND = `---
description: Call a SubAgent from .subagents/ folder
argument-hint: NAME=<agent> TASK=<description>
---

# Call SubAgent

1. Read \`.subagents/manifest.json\` (or \`~/.subagents/manifest.json\` for global agents)
2. Find agent by $NAME
3. Read the instructions from \`instructionsPath\` field
4. Execute \`commands.start\` with $TASK
5. If agent asks questions, use \`commands.resume\`
`;

/**
 * Slash command template for Claude Code CLI
 */
const CLAUDE_SLASH_COMMAND = `---
description: Call a SubAgent from .subagents/ folder
allowed-tools: Bash, Read
---

# Call SubAgent

$ARGUMENTS

1. Read \`.subagents/manifest.json\` (or \`~/.subagents/manifest.json\` for global agents)
2. Find agent matching the task
3. Read the instructions from \`instructionsPath\` field
4. Execute \`commands.start\`
5. Handle follow-ups with \`commands.resume\`
`;

export class DeployService {
  /**
   * Deploy agent to project workspace (.subagents/)
   * Creates slash command for Claude in project, Codex only globally
   */
  async deployToProject(agent: SubAgent): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("No open workspace. Cannot deploy to project.");
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const homeDir = homedir();

    // Deploy to .subagents/ folder
    const subagentsDir = join(rootPath, ".subagents");
    const agentDir = join(subagentsDir, agent.name);
    const agentFile = join(agentDir, `${agent.name}.md`);
    const manifestFile = join(subagentsDir, "manifest.json");

    // 1. Create directories
    await mkdir(agentDir, { recursive: true });

    // 2. Write instructions file
    await writeFile(agentFile, agent.instructions, "utf-8");

    // 3. Update manifest.json with full path to instructions
    const manifest = await this._loadOrCreateManifest(manifestFile);
    this._upsertAgentInManifest(manifest, agent, agentFile);
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf-8");

    // 4. Create slash commands
    // Codex: ONLY global (~/.codex/prompts/) - Codex doesn't support project-level prompts
    await this._createCodexGlobalSlashCommand(homeDir);
    // Claude: project-level (.claude/commands/)
    await this._createClaudeSlashCommand(rootPath);
  }

  /**
   * Deploy agent to global location (~/.subagents/)
   * Creates global slash commands for both CLIs
   */
  async deployToGlobal(agent: SubAgent): Promise<void> {
    const homeDir = homedir();

    // Deploy to ~/.subagents/ folder
    const subagentsDir = join(homeDir, ".subagents");
    const agentDir = join(subagentsDir, agent.name);
    const agentFile = join(agentDir, `${agent.name}.md`);
    const manifestFile = join(subagentsDir, "manifest.json");

    // 1. Create directories
    await mkdir(agentDir, { recursive: true });

    // 2. Write instructions file
    await writeFile(agentFile, agent.instructions, "utf-8");

    // 3. Update manifest.json with full path to instructions
    const manifest = await this._loadOrCreateManifest(manifestFile);
    this._upsertAgentInManifest(manifest, agent, agentFile);
    await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf-8");

    // 4. Create global slash commands for both CLIs
    await this._createCodexGlobalSlashCommand(homeDir);
    await this._createClaudeGlobalSlashCommand(homeDir);
  }

  /**
   * Load existing manifest or create a new one
   */
  private async _loadOrCreateManifest(
    manifestFile: string
  ): Promise<ManifestFile> {
    try {
      const content = await readFile(manifestFile, "utf-8");
      return JSON.parse(content);
    } catch (_ignored) {
      return { version: "1.0", agents: [] };
    }
  }

  /**
   * Update or add agent in manifest with full instructions path
   */
  private _upsertAgentInManifest(
    manifest: ManifestFile,
    agent: SubAgent,
    instructionsPath: string
  ): void {
    const existingIndex = manifest.agents.findIndex(
      (a) => a.name === agent.name
    );

    const agentEntry = {
      name: agent.name,
      description: agent.description,
      instructionsPath,
      commands: agent.commands,
    };

    if (existingIndex !== -1) {
      manifest.agents[existingIndex] = agentEntry;
    } else {
      manifest.agents.push(agentEntry);
    }
  }

  /**
   * Create Codex slash command ONLY globally
   * Codex CLI doesn't support project-level prompts
   */
  private async _createCodexGlobalSlashCommand(homeDir: string): Promise<void> {
    const codexPromptsDir = join(homeDir, ".codex", "prompts");
    await mkdir(codexPromptsDir, { recursive: true });
    await writeFile(
      join(codexPromptsDir, "call-subagent.md"),
      CODEX_SLASH_COMMAND,
      "utf-8"
    );
  }

  /**
   * Create Claude slash command in project
   */
  private async _createClaudeSlashCommand(rootPath: string): Promise<void> {
    const claudeCommandsDir = join(rootPath, ".claude", "commands");
    await mkdir(claudeCommandsDir, { recursive: true });
    await writeFile(
      join(claudeCommandsDir, "call-subagent.md"),
      CLAUDE_SLASH_COMMAND,
      "utf-8"
    );
  }

  /**
   * Create Claude slash command globally
   */
  private async _createClaudeGlobalSlashCommand(
    homeDir: string
  ): Promise<void> {
    const claudeCommandsDir = join(homeDir, ".claude", "commands");
    await mkdir(claudeCommandsDir, { recursive: true });
    await writeFile(
      join(claudeCommandsDir, "call-subagent.md"),
      CLAUDE_SLASH_COMMAND,
      "utf-8"
    );
  }
}
