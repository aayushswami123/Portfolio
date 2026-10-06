#!/usr/bin/env node
/**
 * Checks every link that ships.
 *
 * External URLs are fetched (HEAD, then GET for hosts that refuse HEAD).
 * Internal paths are matched against the routes this app actually builds.
 * Exits non-zero if anything is broken, so it can gate a deploy.
 *
 *   npm run check-links            check everything
 *   npm run check-links -- --local skip the network, check internal paths only
 */

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localOnly = process.argv.includes("--local");
const TIMEOUT_MS = 12_000;

/** The site's own origin. These resolve against the routes below, not the network. */
const SELF_ORIGINS = ["https://aayushswami.com", "https://www.aayushswami.com"];

/**
 * Some hosts refuse anything that is not a real browser session: LinkedIn
 * answers 999, LeetCode 403. That is bot protection, not a dead link, so these
 * are reported as unverified rather than failing the check.
 */
const BLOCKED_STATUSES = new Set([401, 403, 429, 999]);

/** Every path this site serves. Keep in step with app/. */
const ROUTES = new Set(["/", "/resume", "/sitemap.xml", "/robots.txt", "/llms.txt"]);

/** Anchors that must exist on the home page. */
const ANCHORS = new Set([
  "main",
  "recent",
  "work",
  "hackathons",
  "experience",
  "skills",
  "projects",
  "contact",
]);

function collectFromSource(text, source, found) {
  // Quoted URLs and href targets in the typed content and components.
  for (const match of text.matchAll(/href:\s*"([^"]+)"/g)) {
    found.push({ url: match[1], source });
  }
  for (const match of text.matchAll(/href="([^"{]+)"/g)) {
    found.push({ url: match[1], source });
  }
  for (const match of text.matchAll(/https?:\/\/[^\s"'`)<>\]]+/g)) {
    found.push({ url: match[0].replace(/[.,;]$/, ""), source });
  }
}

async function gather() {
  const found = [];

  const files = [
    "content/site.ts",
    "content/work.ts",
    "content/case-studies.ts",
    "content/hackathons.ts",
    "content/logos.ts",
    "public/llms.txt",
    "public/person-jsonld.json",
  ];
  for (const file of files) {
    collectFromSource(await readFile(join(root, file), "utf8"), file, found);
  }

  const componentDir = join(root, "components");
  for (const name of await readdir(componentDir)) {
    if (!name.endsWith(".tsx")) continue;
    collectFromSource(await readFile(join(componentDir, name), "utf8"), `components/${name}`, found);
  }

  const caseStudies = JSON.parse(
    (await readFile(join(root, "content", "case-studies.ts"), "utf8"))
      .match(/slug:\s*"([^"]+)"/g)
      ?.map((entry) => `"${entry.split('"')[1]}"`)
      .join(",")
      .replace(/^/, "[")
      .concat("]") ?? "[]",
  );
  for (const slug of caseStudies) ROUTES.add(`/work/${slug}`);

  // De-duplicate, keeping the first place each URL was seen.
  const seen = new Map();
  for (const item of found) {
    const url = item.url.trim();
    if (url.length === 0) continue;
    if (!seen.has(url)) seen.set(url, item.source);
  }
  return [...seen].map(([url, source]) => ({ url, source }));
}

function stripSelfOrigin(url) {
  for (const origin of SELF_ORIGINS) {
    if (url === origin) return "/";
    if (url.startsWith(`${origin}/`)) return url.slice(origin.length);
  }
  return null;
}

async function checkExternal(url) {
  const attempt = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: {
          // Some hosts 403 a bare fetch; identify as an ordinary browser.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,*/*",
        },
      });
      return response.status;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    let status = await attempt("HEAD");
    if (status === 405 || status === 403 || status === 404) status = await attempt("GET");
    if (BLOCKED_STATUSES.has(status)) {
      return { ok: true, warn: true, detail: `${status} bot-blocked, check by hand` };
    }
    return { ok: status < 400, detail: String(status) };
  } catch (error) {
    return { ok: false, detail: error.name === "AbortError" ? "timeout" : "unreachable" };
  }
}

function checkInternal(url) {
  if (url.startsWith("mailto:")) {
    return { ok: /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url), detail: "mailto" };
  }
  const [path, hash] = url.split("#");
  if (path === "" && hash) {
    return { ok: ANCHORS.has(hash), detail: `#${hash}` };
  }
  if (!ROUTES.has(path)) return { ok: false, detail: "no such route" };
  if (hash && !ANCHORS.has(hash)) return { ok: false, detail: `no such anchor #${hash}` };
  return { ok: true, detail: "route" };
}

async function main() {
  const raw = await gather();
  // A link to this site's own canonical URL is an internal route, not a
  // network call — the pages exist in this build even if the deployed site
  // has not caught up yet.
  const seen = new Set();
  const links = [];
  for (const link of raw) {
    const self = stripSelfOrigin(link.url);
    const url = self ?? link.url;
    if (seen.has(url)) continue;
    seen.add(url);
    links.push({ ...link, url });
  }

  const internal = links.filter((link) => !link.url.startsWith("http"));
  const external = links.filter((link) => link.url.startsWith("http"));

  const failures = [];
  const warnings = [];

  console.log(`Internal (${internal.length})`);
  for (const link of internal) {
    const result = checkInternal(link.url);
    console.log(`  ${result.ok ? "ok  " : "FAIL"} ${link.url.padEnd(44)} ${result.detail}`);
    if (!result.ok) failures.push({ ...link, detail: result.detail });
  }

  if (localOnly) {
    console.log(`\nSkipped ${external.length} external links (--local).`);
  } else {
    console.log(`\nExternal (${external.length})`);
    const results = await Promise.all(
      external.map(async (link) => ({ link, result: await checkExternal(link.url) })),
    );
    for (const { link, result } of results) {
      const tag = result.ok ? (result.warn ? "warn" : "ok  ") : "FAIL";
      console.log(`  ${tag} ${link.url.padEnd(44)} ${result.detail}`);
      if (!result.ok) failures.push({ ...link, detail: result.detail });
      else if (result.warn) warnings.push({ ...link, detail: result.detail });
    }
  }

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} link(s) could not be verified automatically:`);
    for (const warning of warnings) console.log(`  ${warning.url}  ${warning.detail}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} broken link(s):`);
    for (const failure of failures) {
      console.error(`  ${failure.url}  (${failure.source})  ${failure.detail}`);
    }
    process.exit(1);
  }

  console.log("\nAll links good.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
