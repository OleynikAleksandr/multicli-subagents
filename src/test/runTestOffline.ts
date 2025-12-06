// biome-ignore lint/performance/noNamespaceImport: Compatibility
import glob = require("glob");
// biome-ignore lint/performance/noNamespaceImport: Compatibility
import Mocha = require("mocha");

import * as moduleAlias from "module-alias";
import * as path from "path";

// --- Mock VS Code Module Loading ---
// Register alias before loading any other modules
moduleAlias.addAlias("vscode", path.resolve(__dirname, "./vscode-mock"));
// -----------------------------------

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    reporter: "spec",
  });

  const testsRoot = path.resolve(__dirname, "suite");

  return new Promise((resolve, reject) => {
    glob("**/*.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return reject(err);
      }

      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        mocha.run((failures) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

// Auto-run if executed directly
if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
