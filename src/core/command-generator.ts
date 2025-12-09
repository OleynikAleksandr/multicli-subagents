import type { SubAgentVendor } from "../models/sub-agent";

/**
 * Generate CLI commands that use start.sh/resume.sh scripts
 * Scripts handle logging, session_id extraction, and vendor-specific logic
 */
export const generateCommands = (
  name: string,
  vendor: SubAgentVendor,
  subagentsDir: string
): { start: string; resume: string } => {
  // Commands use the universal start.sh/resume.sh scripts
  // Scripts are located in the subagents directory root
  return {
    start: `"${subagentsDir}/start.sh" ${vendor} ${name} "$TASK"`,
    resume: `"${subagentsDir}/resume.sh" ${vendor} ${name} $SESSION_ID "$ANSWER"`,
  };
};
