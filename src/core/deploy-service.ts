import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
// biome-ignore lint/performance/noNamespaceImport: VS Code API requires namespace import
import * as vscode from "vscode";
import type { SubAgent } from "../models/sub-agent";

export class DeployService {
  async deployToProject(agent: SubAgent): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("No open workspace. Cannot deploy to project.");
    }

    // Use the first workspace folder for now
    const rootPath = workspaceFolders[0].uri.fsPath;
    const codexDir = join(rootPath, ".codex");
    const subagentsDir = join(codexDir, "subagents");
    const agentDir = join(subagentsDir, agent.name);
    const agentFile = join(agentDir, `${agent.name}.md`);
    const manifestFile = join(subagentsDir, "manifest.json");

    // 1. Create directories
    await mkdir(agentDir, { recursive: true });

    // 2. Write instructions file
    await writeFile(agentFile, agent.instructions, "utf-8");

    // 3. Update manifest.json
    let manifest: {
      agents: { name: string; triggers: string[]; description: string }[];
    } = { agents: [] };

    try {
      const manifestContent = await readFile(manifestFile, "utf-8");
      manifest = JSON.parse(manifestContent);
    } catch (_ignored) {
      // Manifest might not exist yet
    }

    // Update or add agent
    const existingIndex = manifest.agents.findIndex(
      (a) => a.name === agent.name
    );
    const agentEntry = {
      name: agent.name,
      triggers: agent.triggers,
      description: agent.description,
    };

    if (existingIndex !== -1) {
      manifest.agents[existingIndex] = agentEntry;
    } else {
      manifest.agents.push(agentEntry);
    }

    await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf-8");
  }

  async deployToGlobal(agent: SubAgent): Promise<void> {
    const homeDir = homedir();
    const codexPromptsDir = join(homeDir, ".codex", "prompts");

    // 1. Ensure directory exists
    await mkdir(codexPromptsDir, { recursive: true });

    // 2. Write prompt file (e.g. ~/.codex/prompts/agentname.md)
    const promptFile = join(codexPromptsDir, `${agent.name}.md`);
    await writeFile(promptFile, agent.instructions, "utf-8");
  }
}
