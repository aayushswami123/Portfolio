#!/usr/bin/env node
/**
 * Lists every [ADD] / [CHECK] placeholder still in the content, plus the
 * assets that have not landed yet. Nothing here ships to production — the
 * typed content files render a missing value as nothing at all — so this is
 * the punch list, not a build failure.
 */

import { readFile, readdir, access } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SOURCES = ["content/CONTENT.md", "content/FLOWCHARTS.md"];
const REQUIRED_FILES = [
  ["public/Aayush_Swami_Resume_2026.pdf", "Resume PDF (/resume redirects to /#contact without it)"],
];

async function exists(path) {
  try {
    await access(join(root, path));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const caseDir = join(root, "content", "case-studies");
  const caseFiles = (await readdir(caseDir))
    .filter((name) => name.endsWith(".md"))
    .map((name) => relative(root, join(caseDir, name)));

  const found = [];
  for (const source of [...SOURCES, ...caseFiles]) {
    const text = await readFile(join(root, source), "utf8");
    text.split("\n").forEach((line, index) => {
      // The legend at the top of CONTENT.md explains the syntax; it is not a
      // placeholder anyone has to fill in.
      if (/= Aayush must supply this|= confirm before launch/.test(line)) return;
      for (const match of line.matchAll(/\[(ADD|CHECK)([^\]]*)\]/g)) {
        found.push({
          source,
          line: index + 1,
          kind: match[1],
          note: (match[2] ?? "").replace(/^:\s*/, "").trim() || line.trim(),
        });
      }
    });
  }

  const adds = found.filter((item) => item.kind === "ADD");
  const checks = found.filter((item) => item.kind === "CHECK");

  const print = (title, items) => {
    if (items.length === 0) return;
    console.log(`\n${title} (${items.length})`);
    for (const item of items) {
      console.log(`  ${`${item.source}:${item.line}`.padEnd(46)} ${item.note}`);
    }
  };

  print("Needs a value from Aayush", adds);
  print("Needs confirming before launch", checks);

  const missing = [];
  for (const [path, why] of REQUIRED_FILES) {
    if (!(await exists(path))) missing.push({ path, why });
  }
  if (missing.length > 0) {
    console.log(`\nMissing files (${missing.length})`);
    for (const item of missing) console.log(`  ${item.path.padEnd(46)} ${item.why}`);
  }

  console.log(
    `\n${adds.length} to add, ${checks.length} to confirm, ${missing.length} file(s) missing.`,
  );
  console.log("None of these block the build; empty values render as nothing.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
