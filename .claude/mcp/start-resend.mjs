#!/usr/bin/env node
// Starts the Resend MCP server with settings from the project's .env file.
//
// Order of priority for each setting:
//   1. A real environment variable (set in your shell or with setx)
//   2. The value in .env (git-ignored, never committed)
//   3. The practice default (local practice server, harmless key)
//
// If no real API key is found, everything falls back to practice mode,
// so a missing key can never point a half-set config at real Resend.
//
// Run with --check to print the mode without starting the server.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SERVER_PACKAGE = "resend-mcp@2.27.1";

const PRACTICE = {
  RESEND_API_KEY: "re_practice",
  RESEND_BASE_URL: "http://localhost:4000",
  SENDER_EMAIL_ADDRESS: "onboarding@resend.dev",
};

const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const envFile = join(projectDir, ".env");

// Load .env. Existing environment variables are not overwritten.
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const value = (name) => (process.env[name] ?? "").trim();

const key = value("RESEND_API_KEY");
const hasRealKey =
  key.startsWith("re_") && key !== PRACTICE.RESEND_API_KEY && !key.includes("your_");

const env = { ...process.env };
let mode;

if (hasRealKey) {
  mode = "live";
  env.RESEND_API_KEY = key;
  env.RESEND_BASE_URL = value("RESEND_BASE_URL") || "https://api.resend.com";
  env.SENDER_EMAIL_ADDRESS =
    value("SENDER_EMAIL_ADDRESS") || PRACTICE.SENDER_EMAIL_ADDRESS;
} else {
  mode = "practice";
  Object.assign(env, PRACTICE);
}

const summary =
  `Resend MCP: ${mode} mode, ${env.RESEND_BASE_URL}, ` +
  `key ${env.RESEND_API_KEY.slice(0, 7)}****, sender ${env.SENDER_EMAIL_ADDRESS}`;

if (process.argv.includes("--check")) {
  console.log(summary);
  process.exit(0);
}

// stdout carries the MCP protocol, so status goes to stderr only.
process.stderr.write(summary + "\n");

// npx is a .cmd file on Windows, so it needs a shell there.
const child =
  process.platform === "win32"
    ? spawn(`npx -y ${SERVER_PACKAGE}`, { env, stdio: "inherit", shell: true })
    : spawn("npx", ["-y", SERVER_PACKAGE], { env, stdio: "inherit" });

child.on("error", (err) => {
  process.stderr.write(`Resend MCP: could not start (${err.message})\n`);
  process.exit(1);
});
child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0));

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
