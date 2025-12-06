import { runTests } from "@vscode/test-electron";
import * as path from "path";

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index.js");

    console.log("RunTest paths:");
    console.log("extensionDevelopmentPath:", extensionDevelopmentPath);
    console.log("extensionTestsPath:", extensionTestsPath);
    console.log("__dirname:", __dirname);

    // Download VS Code, unzip it and run the integration test
    await runTests({
      version: "1.85.0",
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ["--no-sandbox", "--verbose"],
    });
  } catch (err) {
    console.error("Failed to run tests", err);
    process.exit(1);
  }
}

main();
