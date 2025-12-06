/**
 * Home Screen - Entry point with Create/Browse options
 */
type HomeScreenProps = {
  onCreateClick: () => void;
  onBrowseClick: () => void;
};

export const HomeScreen = ({
  onCreateClick,
  onBrowseClick,
}: HomeScreenProps) => (
  <div
    className="container flex flex-col items-center justify-center"
    style={{ minHeight: "80vh" }}
  >
    <h1 className="mb-md text-center">SubAgent Manager</h1>
    <p className="mb-md text-center text-muted">
      Create and manage sub-agents for Codex CLI and Claude Code CLI
    </p>

    <div className="mt-md flex gap-lg">
      <button
        className="btn-primary btn-large"
        onClick={onCreateClick}
        type="button"
      >
        ➕ Create New
      </button>
      <button
        className="btn-secondary btn-large"
        onClick={onBrowseClick}
        type="button"
      >
        📋 Browse
      </button>
    </div>
  </div>
);
