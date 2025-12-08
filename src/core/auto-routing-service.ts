import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Marker to detect if auto-routing section already exists
 */
const ROUTING_MARKER_START = "<!-- SUBAGENT-ROUTING -->";
const ROUTING_MARKER_END = "<!-- /SUBAGENT-ROUTING -->";

/**
 * Auto-routing section for Codex CLI (AGENTS.md)
 */
const CODEX_ROUTING_SECTION = `
${ROUTING_MARKER_START}
# 🚦 CRITICAL: SUBAGENT DELEGATION PROTOCOL

**PRIORITY 0 (HIGHEST):** Before analyzing the user request depth or planning, you MUST perform a "Capability Scan":

1.  🔍 **SCAN**: Check for manifests in these locations:
    *   **Project**: \`./.subagents/manifest.json\` (relative to workspace root)
    *   **Global**: \`~/.subagents/manifest.json\`
2.  🧩 **MATCH**: Check if the User Request semantically overlaps with ANY Agent's \`description\` found in the manifests.
    *   *Example:* Request "Translate file X" matches Agent "Translator".
    *   *Example:* Request "Fix these bugs" matches Agent "Debugger".
3.  🛑 **DECISION**:
    *   **IF MATCH FOUND**: You are **FORBIDDEN** from performing the task yourself with your own tools.
        *   You **MUST** delegate to the matching SubAgent immediately.
        *   **Do NOT** ask for confirmation.
        *   **Do NOT** attempt to "quickly fix" it yourself.
    *   **INTERACTION PROTOCOL**:
        *   **IF SubAgent asks a question**: You **MUST** answer it.
            *   **IF you know the answer**: Answer directly.
            *   **IF you DON'T know**: Ask the User in chat, wait for their response, and THEN relay it to the SubAgent using \`commands.resume\`.
    *   **IF NO MATCH**: Proceed with your own standard tools.

**Philosophy**: "Never manually do what a SubAgent is configured to do."
${ROUTING_MARKER_END}
`;

/**
 * Auto-routing section for Claude Code CLI (CLAUDE.md)
 */
const CLAUDE_ROUTING_SECTION = `
${ROUTING_MARKER_START}
# 🚦 CRITICAL: SUBAGENT DELEGATION PROTOCOL

**PRIORITY 0 (HIGHEST):** Before analyzing the user request depth or planning, you MUST perform a "Capability Scan":

1.  🔍 **SCAN**: Check for manifests in these locations:
    *   **Project**: \`./.subagents/manifest.json\` (relative to workspace root)
    *   **Global**: \`~/.subagents/manifest.json\`
2.  🧩 **MATCH**: Check if the User Request semantically overlaps with ANY Agent's \`description\` found in the manifests.
    *   *Example:* Request "Translate file X" matches Agent "Translator".
    *   *Example:* Request "Fix these bugs" matches Agent "Debugger".
3.  🛑 **DECISION**:
    *   **IF MATCH FOUND**: You are **FORBIDDEN** from performing the task yourself with your own tools.
        *   You **MUST** delegate to the matching SubAgent immediately.
        *   **Do NOT** ask for confirmation.
        *   **Do NOT** attempt to "quickly fix" it yourself.
    *   **INTERACTION PROTOCOL**:
        *   **IF SubAgent asks a question**: You **MUST** answer it.
            *   **IF you know the answer**: Answer directly.
            *   **IF you DON'T know**: Ask the User in chat, wait for their response, and THEN relay it to the SubAgent using \`commands.resume\`.
    *   **IF NO MATCH**: Proceed with your own standard tools.

**Philosophy**: "Never manually do what a SubAgent is configured to do."
${ROUTING_MARKER_END}
`;

/**
 * Service for managing auto-routing instructions in CLI config files
 */
export class AutoRoutingService {
  /**
   * Ensure auto-routing section exists in global CLI config files
   * Called on first deploy
   */
  async ensureAutoRoutingInstructions(): Promise<void> {
    const homeDir = homedir();

    await Promise.all([
      this._ensureRoutingInFile(
        join(homeDir, ".codex", "AGENTS.md"),
        CODEX_ROUTING_SECTION
      ),
      this._ensureRoutingInFile(
        join(homeDir, ".claude", "CLAUDE.md"),
        CLAUDE_ROUTING_SECTION
      ),
    ]);
  }

  /**
   * Check if routing section exists and add if missing
   */
  private async _ensureRoutingInFile(
    filePath: string,
    routingSection: string
  ): Promise<void> {
    let content = "";

    try {
      content = await readFile(filePath, "utf-8");
    } catch (_ignored) {
      // File doesn't exist, will create with routing section
    }

    // Check if already has routing section
    if (content.includes(ROUTING_MARKER_START)) {
      return; // Already has routing, skip
    }

    // Append routing section
    const newContent = content + routingSection;
    await writeFile(filePath, newContent, "utf-8");
  }

  /**
   * Remove auto-routing section from global CLI config files
   * Called when last SubAgent is undeployed
   */
  async removeAutoRoutingInstructions(): Promise<void> {
    const homeDir = homedir();

    await Promise.all([
      this._removeRoutingFromFile(join(homeDir, ".codex", "AGENTS.md")),
      this._removeRoutingFromFile(join(homeDir, ".claude", "CLAUDE.md")),
    ]);
  }

  /**
   * Remove routing section from file
   */
  private async _removeRoutingFromFile(filePath: string): Promise<void> {
    let content = "";

    try {
      content = await readFile(filePath, "utf-8");
    } catch (_ignored) {
      return; // File doesn't exist, nothing to remove
    }

    // Check if has routing section
    if (!content.includes(ROUTING_MARKER_START)) {
      return; // No routing section, nothing to remove
    }

    // Remove the routing section (including markers)
    const startIdx = content.indexOf(ROUTING_MARKER_START);
    const endIdx = content.indexOf(ROUTING_MARKER_END);

    if (startIdx === -1 || endIdx === -1) {
      return; // Malformed markers
    }

    // Remove from start marker to end marker (inclusive) plus trailing newline
    const beforeSection = content.substring(0, startIdx);
    const afterSection = content.substring(
      endIdx + ROUTING_MARKER_END.length + 1
    );

    const newContent = beforeSection + afterSection;
    await writeFile(filePath, `${newContent.trim()}\n`, "utf-8");
  }
}
