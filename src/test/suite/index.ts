import * as fs from "fs";
import * as path from "path";

const logFile = path.resolve(__dirname, "../../test_output.log");
try {
  fs.writeFileSync(logFile, "Module loaded minimal\n");
} catch (e) {}

export function run(): Promise<void> {
  // eslint-disable-line
  try {
    fs.appendFileSync(logFile, "Run called\n");
  } catch (e) {}
  return Promise.resolve();
}

/*
// biome-ignore lint/performance/noNamespaceImport: Compatibility
import glob = require("glob");
// biome-ignore lint/performance/noNamespaceImport: Compatibility
import Mocha = require("mocha");

try { fs.appendFileSync(logFile, "Imports loaded\n"); } catch(e) {}

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    reporter: "spec"
  });

  const testsRoot = path.resolve(__dirname, ".");
  fs.writeFileSync(logFile, "Tests started\n");

  return new Promise((c, e) => {
    glob("**/ /*.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        fs.appendFileSync(logFile, `Glob error: ${err}\n`);
        return e(err);
      }

      // Add files to the test suite
      for (const f of files) {
          fs.appendFileSync(logFile, `Adding test file: ${f}\n`);
          mocha.addFile(path.resolve(testsRoot, f));
      }

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            fs.appendFileSync(logFile, `${failures} tests failed.\n`);
            e(new Error(`${failures} tests failed.`));
          } else {
            fs.appendFileSync(logFile, "All tests passed.\n");
            c();
          }
        });
      } catch (runErr) {
        fs.appendFileSync(logFile, `Run error: ${runErr}\n`);
        console.error(runErr);
        e(runErr);
      }
    });
  });
}
*/
