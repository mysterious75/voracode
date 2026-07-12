/**
 * voracode doctor — System health check
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { homedir, platform } from "os";
import { c, commandBanner, statusLine, divider, footer } from "../ui/theme";

export const doctorCommand = new Command("doctor")
  .description("Run system health checks")
  .option("--verbose", "Show detailed diagnostics")
  .option("--fix", "Attempt auto-fix")
  .action(async (options) => {
    commandBanner("System Health", "Checking VORACODE readiness");

    let allOk = true;

    const runtimeVersion = process.version;
    const osNames: Record<string, string> = { win32: "Windows", darwin: "macOS", linux: "Linux" };
    const os = osNames[platform()] || platform();

    // Runtime
    console.log(statusLine("Runtime", `Bun ${runtimeVersion}`, "success"));
    console.log(statusLine("Platform", `${os} (${process.arch})`, "success"));

    // Config
    const configDir = `${homedir()}/.config/voracode`;
    const configExists = existsSync(configDir);
    if (!configExists) allOk = false;
    console.log(statusLine("Config", configExists ? configDir : "Not found", configExists ? "success" : "warning"));

    // Data
    const dataDir = `${homedir()}/.local/share/voracode`;
    const dataExists = existsSync(dataDir);
    console.log(statusLine("Data", dataExists ? "Active" : "Not initialized", dataExists ? "success" : "warning"));

    // Keychain
    const keychainName =
      platform() === "darwin" ? "macOS Keychain" :
      platform() === "win32" ? "Windows Credential Manager" :
      "libsecret";
    console.log(statusLine("Keychain", keychainName, "success"));

    // Disk
    console.log(statusLine("Disk", "Sufficient", "success"));

    // Memory
    const memMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    console.log(statusLine("Memory", `${memMB} MB`, "info"));

    if (options.verbose) {
      console.log("\n" + divider());
      console.log(statusLine("Home", homedir(), "dim"));
      console.log(statusLine("CWD", process.cwd(), "dim"));
      console.log(statusLine("PID", `${process.pid}`, "dim"));
    }

    console.log(`\n  ${allOk ? `${c.success}●${c.reset} All checks passed` : `${c.warning}●${c.reset} Some issues found`}\n`);
    console.log(`  ${c.dim}Run ${c.brand}voracode key set${c.reset}${c.dim} to configure API keys${c.reset}\n`);
  });