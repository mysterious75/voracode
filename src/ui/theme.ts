/**
 * VORACODE Theme — Apple-inspired premium design system
 *
 * Consistent colors, typography, and spacing for all CLI output.
 * Inspired by Apple's design language: minimal, clean, confident.
 */

import { version } from "../../package.json";

const VERSION = version || "0.0.1";

// ── Color Palette (ANSI 256-bit, cross-platform) ──

export const c = {
  // Primary
  brand: "\x1b[38;2;155;89;182m",     // Purple (#9b59b6)
  brandLight: "\x1b[38;2;186;135;205m", // Light purple

  // Status
  success: "\x1b[38;2;46;204;113m",   // Mint green
  error: "\x1b[38;2;231;76;60m",       // Coral red
  warning: "\x1b[38;2;241;196;15m",    // Warm gold
  info: "\x1b[38;2;52;152;219m",       // Sky blue

  // Text
  white: "\x1b[38;2;255;255;255m",
  dim: "\x1b[38;2;149;165;166m",       // Slate
  bright: "\x1b[38;2;189;195;199m",    // Silver
  muted: "\x1b[38;2;127;140;141m",     // Gray

  // Accent
  cyan: "\x1b[38;2;0;184;212m",
  orange: "\x1b[38;2;230;126;34m",
  pink: "\x1b[38;2;236;100;175m",
  teal: "\x1b[38;2;0;184;148m",

  // Reset
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim2: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
};

// ── Icons (Unicode) ──

export const icon = {
  check: `${c.success}●${c.reset}`,
  cross: `${c.error}●${c.reset}`,
  warn: `${c.warning}●${c.reset}`,
  info: `${c.info}●${c.reset}`,
  arrow: `${c.brand}→${c.reset}`,
  dot: `${c.dim}·${c.reset}`,
  diamond: `${c.brand}◆${c.reset}`,
  star: `${c.warning}★${c.reset}`,
  bolt: `${c.cyan}⚡${c.reset}`,
  shield: `${c.teal}◇${c.reset}`,
  key: `${c.orange}◇${c.reset}`,
  brain: `${c.purple || c.pink}◈${c.reset}`,
};

// ── Layout Helpers ──

export function divider(char = "─", width = 48): string {
  return `${c.dim}${char.repeat(width)}${c.reset}`;
}

export function indent(text: string, spaces = 4): string {
  return text.split("\n").map((l) => " ".repeat(spaces) + l).join("\n");
}

// ── Box Drawing (Premium) ──

export function box(lines: string[], width = 50): string {
  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));
  const top = `  ┌${"─".repeat(width)}┐`;
  const bot = `  └${"─".repeat(width)}┘`;
  const mid = lines.map((l) => `  │ ${pad(l, width - 1)}│`).join("\n");
  return `${top}\n${mid}\n${bot}`;
}

// ── Branded Output ──

export function branded(text: string): string {
  return `${c.brand}${text}${c.reset}`;
}

export function success(text: string): string {
  return `${icon.check}  ${text}`;
}

export function error(text: string): string {
  return `${icon.cross}  ${text}`;
}

export function warning(text: string): string {
  return `${icon.warn}  ${text}`;
}

export function info(text: string): string {
  return `${icon.info}  ${text}`;
}

// ── Banner ──

export function printBanner(): void {
  console.log(`
  ${c.brand}    ◆${c.reset}   ${c.bold}V O R A C O D E${c.reset}   ${c.brand}◆${c.reset}

  ${c.dim}Your AI engineering partner.${c.reset}
  ${c.dim}One agent, every surface.${c.reset}

  ${c.muted}v${VERSION}${c.reset}  ${c.dim}·${c.reset}  ${c.muted}${new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}${c.reset}
  `);
}

// ── Command Banner ──

export function commandBanner(title: string, subtitle?: string): void {
  console.log(`
  ${c.brand}◆${c.reset}  ${c.bold}${title}${c.reset}
  ${c.dim}${subtitle || ""}${c.reset}
  `);
}

// ── Status Line ──

export function statusLine(label: string, value: string, type: "success" | "error" | "warning" | "info" | "dim" = "info"): string {
  const colorMap = { success: c.success, error: c.error, warning: c.warning, info: c.info, dim: c.dim };
  return `  ${c.dim}${label.padEnd(20)}${c.reset}  ${colorMap[type]}${value}${c.reset}`;
}

// ── Table ──

export function table(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) => {
    const maxData = Math.max(...rows.map((r) => (r[i] || "").length));
    return Math.max(h.length, maxData);
  });

  const line = `  ┌${widths.map((w) => "─".repeat(w + 2)).join("┬")}┐`;
  const head = `  │${headers.map((h, i) => ` ${c.bold}${h.padEnd(widths[i])}${c.reset} │`).join("")}`;
  const sep = `  ├${widths.map((w) => "─".repeat(w + 2)).join("┼")}┤`;
  const body = rows.map((r) =>
    `  │${r.map((cell, i) => ` ${cell.padEnd(widths[i])} │`).join("")}`
  ).join("\n");

  return `${line}\n${head}\n${sep}\n${body}\n${line}`;
}

// ── Progress ──

export function spinner(text: string): string {
  return `  ${c.brand}◆${c.reset}  ${text}`;
}

// ── Footer ──

export function footer(): void {
  console.log(`
  ${c.dim}${c.brand}◆${c.reset}  ${c.muted}voracode${c.reset}  ${c.dim}|${c.reset}  ${c.muted}github.com/mysterious75/voracode${c.reset}  ${c.dim}|${c.reset}  ${c.muted}MIT${c.reset}
  `);
}