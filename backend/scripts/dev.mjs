import { spawn } from "node:child_process";
import { resolve } from "node:path";
import chokidar from "chokidar";

const nodeBin = "/Users/alinashrestha/.nvm/versions/node/v22.16.0/bin/node";
const entryFile = resolve("src/server.ts");
const watchPaths = ["src"];

let childProcess;
let restartTimer;

function startServer() {
  childProcess = spawn(nodeBin, ["--import", "tsx", entryFile], {
    stdio: "inherit"
  });

  childProcess.on("exit", (code, signal) => {
    if (signal) {
      console.log(`Server stopped with signal ${signal}`);
      return;
    }

    if (code && code !== 0) {
      console.log(`Server exited with code ${code}`);
    }
  });
}

function restartServer() {
  clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    if (childProcess && !childProcess.killed) {
      childProcess.kill("SIGTERM");
    }

    startServer();
  }, 150);
}

chokidar.watch(watchPaths, {
  ignoreInitial: true
}).on("all", () => {
  console.log("File change detected, restarting...");
  restartServer();
});

process.on("SIGINT", () => {
  if (childProcess && !childProcess.killed) {
    childProcess.kill("SIGTERM");
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (childProcess && !childProcess.killed) {
    childProcess.kill("SIGTERM");
  }
  process.exit(0);
});

startServer();
