import { readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
// biome-ignore lint/performance/noNamespaceImport: VS Code API requires namespace import
import * as vscode from "vscode";
import type { SubAgent, SubAgentVendor } from "../models/sub-agent";

/**
 * Manifest agent entry from .subagents/manifest.json
 */
type ManifestAgent = {
  name: string;
  description: string;
  commands: { start: string; resume: string };
};

/**
 * Manifest file structure
 */
type ManifestFile = {
  version: string;
  agents: ManifestAgent[];
};

/**
 * Deployed SubAgent with source info
 */
export type DeployedSubAgent = SubAgent & {
  source: "project" | "global";
  agentDir: string;
};

/**
 * Service for reading and managing deployed SubAgents
 */
export class DeployedService {
  /**
   * Get all deployed SubAgents from project and global locations
   */
  async getDeployedAgents(): Promise<{
    project: DeployedSubAgent[];
    global: DeployedSubAgent[];
  }> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const homeDir = homedir();

    const [projectAgents, globalAgents] = await Promise.all([
      workspaceFolders?.[0]
        ? this._loadFromManifest(
            join(workspaceFolders[0].uri.fsPath, ".subagents"),
            "project"
          )
        : Promise.resolve([]),
      this._loadFromManifest(join(homeDir, ".subagents"), "global"),
    ]);

    return { project: projectAgents, global: globalAgents };
  }

  /**
   * Remove a deployed SubAgent
   */
  async undeployAgent(
    name: string,
    source: "project" | "global"
  ): Promise<void> {
    const baseDir = this._getBaseDir(source);
    if (!baseDir) {
      throw new Error("No workspace open for project undeploy");
    }

    const subagentsDir = join(baseDir, ".subagents");
    const agentDir = join(subagentsDir, name);
    const manifestFile = join(subagentsDir, "manifest.json");

    // Remove agent directory
    await rm(agentDir, { recursive: true, force: true });

    // Update manifest
    try {
      const content = await readFile(manifestFile, "utf-8");
      const manifest: ManifestFile = JSON.parse(content);
      manifest.agents = manifest.agents.filter((a) => a.name !== name);
      await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf-8");
    } catch (_ignored) {
      // Manifest doesn't exist or is invalid
    }
  }

  private _getBaseDir(source: "project" | "global"): string | null {
    if (source === "global") {
      return homedir();
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    return workspaceFolders?.[0]?.uri.fsPath ?? null;
  }

  private async _loadFromManifest(
    subagentsDir: string,
    source: "project" | "global"
  ): Promise<DeployedSubAgent[]> {
    const manifestFile = join(subagentsDir, "manifest.json");

    try {
      const content = await readFile(manifestFile, "utf-8");
      const manifest: ManifestFile = JSON.parse(content);

      const agents: DeployedSubAgent[] = [];

      for (const entry of manifest.agents) {
        const agentDir = join(subagentsDir, entry.name);
        const instructionsFile = join(agentDir, `${entry.name}.md`);

        let instructions = "";
        try {
          instructions = await readFile(instructionsFile, "utf-8");
        } catch (_ignored) {
          // Instructions file missing
        }

        // Detect vendor from command
        const vendor: SubAgentVendor = entry.commands.start.includes("codex")
          ? "codex"
          : "claude";

        agents.push({
          id: `deployed-${source}-${entry.name}`,
          name: entry.name,
          description: entry.description,
          vendor,
          instructions,
          commands: entry.commands,
          metadata: { createdAt: "", updatedAt: "" },
          source,
          agentDir,
        });
      }

      return agents;
    } catch (_ignored) {
      return [];
    }
  }
}
