#!/usr/bin/env node
/**
 * Checks the demo videos in public/demos/ against docs/DESIGN.md:
 * under 6 MB, at most 40 seconds, with a matching <slug>-poster.webp.
 * Warns only — a missing demo just means the panel falls back to a
 * screenshot or diagram.
 *
 *   npm run demos:check
 */

import { readdir, stat, open } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "demos");

const SLUGS = [
  "nestulabs-ai-visibility",
  "crdt-engine",
  "rolston-research",
  "agentic-trading",
  "pr-lifeguard",
  "aerotrace",
];
const MAX_BYTES = 6 * 1024 * 1024;
const MAX_SECONDS = 40;

async function durationSeconds(file) {
  const handle = await open(file, "r");
  try {
    const { size } = await handle.stat();
    const chunk = Math.min(size, 512 * 1024);
    for (const position of [0, size - chunk]) {
      const buffer = Buffer.alloc(chunk);
      await handle.read(buffer, 0, chunk, position);
      const at = buffer.indexOf("mvhd");
      if (at === -1) continue;
      const v1 = buffer[at + 4] === 1;
      const timescale = v1 ? buffer.readUInt32BE(at + 24) : buffer.readUInt32BE(at + 16);
      const units = v1 ? Number(buffer.readBigUInt64BE(at + 28)) : buffer.readUInt32BE(at + 20);
      if (timescale) return units / timescale;
    }
  } finally {
    await handle.close();
  }
  return null;
}

async function main() {
  const files = existsSync(dir) ? (await readdir(dir)).filter((name) => name.endsWith(".mp4")) : [];
  let warnings = 0;
  const warn = (message) => {
    warnings += 1;
    console.log(`  warn  ${message}`);
  };

  for (const name of files) {
    const file = join(dir, name);
    const slug = name.replace(/\.mp4$/, "");
    const { size } = await stat(file);
    const mb = (size / 1024 / 1024).toFixed(1);
    if (size > MAX_BYTES) warn(`${name} is ${mb} MB (limit 6 MB)`);
    const seconds = await durationSeconds(file);
    if (seconds !== null && seconds > MAX_SECONDS) {
      warn(`${name} is ${Math.round(seconds)} s (limit ${MAX_SECONDS} s)`);
    }
    if (!existsSync(join(dir, `${slug}-poster.webp`))) warn(`${name} has no ${slug}-poster.webp`);
    if (!SLUGS.includes(slug)) warn(`${name} does not match any project slug`);
    console.log(`  ok    ${name}  ${mb} MB${seconds !== null ? `  ${Math.round(seconds)} s` : ""}`);
  }

  const missing = SLUGS.filter((slug) => !files.includes(`${slug}.mp4`));
  if (missing.length > 0) {
    console.log(`\n  No demo yet (panel falls back to screenshot or diagram):`);
    for (const slug of missing) console.log(`        public/demos/${slug}.mp4`);
  }

  console.log(`\n  ${files.length} demo(s) checked, ${warnings} warning(s).\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
