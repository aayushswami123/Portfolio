import { existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
import { join } from "node:path";
import { isDiagram, type DiagramName } from "@/content/diagrams";

/**
 * Picks the media for a project panel, in the order DESIGN.md sets:
 * demo video -> screenshot -> diagram. Runs at build time; the pages are static.
 */

export type Media =
  | { kind: "demo"; slug: string; src: string; poster: string | null; duration: string | null }
  | { kind: "screenshot"; slug: string; src: string }
  | { kind: "diagram"; name: DiagramName };

const publicDir = join(process.cwd(), "public");

function publicFile(path: string): boolean {
  return existsSync(join(publicDir, path));
}

/**
 * Reads the duration from an MP4's `mvhd` box. The box sits in the first few
 * kilobytes of a web-optimised (faststart) file, or at the end otherwise, so
 * both ends are checked. Returns null rather than guessing.
 */
function mp4Duration(file: string): string | null {
  try {
    const size = statSync(file).size;
    const chunk = Math.min(size, 512 * 1024);
    const fd = openSync(file, "r");
    const head = Buffer.alloc(chunk);
    const tail = Buffer.alloc(chunk);
    readSync(fd, head, 0, chunk, 0);
    readSync(fd, tail, 0, chunk, size - chunk);
    closeSync(fd);

    for (const buffer of [head, tail]) {
      const at = buffer.indexOf("mvhd");
      if (at === -1) continue;
      const version = buffer[at + 4];
      const timescale =
        version === 1 ? buffer.readUInt32BE(at + 24) : buffer.readUInt32BE(at + 16);
      const units =
        version === 1 ? Number(buffer.readBigUInt64BE(at + 28)) : buffer.readUInt32BE(at + 20);
      if (!timescale) continue;
      const seconds = Math.round(units / timescale);
      return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    }
  } catch {
    // Unreadable file: show the button without a duration.
  }
  return null;
}

export function demoFor(slug: string): Extract<Media, { kind: "demo" }> | null {
  const src = `demos/${slug}.mp4`;
  if (!publicFile(src)) return null;
  const poster = `demos/${slug}-poster.webp`;
  return {
    kind: "demo",
    slug,
    src: `/${src}`,
    poster: publicFile(poster) ? `/${poster}` : null,
    duration: mp4Duration(join(publicDir, src)),
  };
}

export function resolveMedia(slug: string, diagram: string | null): Media | null {
  const demo = demoFor(slug);
  if (demo) return demo;
  const shot = `work/${slug}.webp`;
  if (publicFile(shot)) return { kind: "screenshot", slug, src: `/${shot}` };
  if (diagram && isDiagram(diagram)) return { kind: "diagram", name: diagram };
  return null;
}

/** Numbers figures in page order: call `next()` once per figure, top to bottom. */
export function figureCounter() {
  let n = 0;
  return { next: () => (n += 1) };
}

export function logoExists(file: string): boolean {
  return publicFile(join("logos", file));
}
