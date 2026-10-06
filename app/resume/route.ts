import { existsSync } from "node:fs";
import { join } from "node:path";
import { redirect } from "next/navigation";
import { resumeFile } from "@/content/site";

/**
 * /resume redirects to the current resume PDF.
 *
 * If the PDF has not been dropped into public/ yet, send people to the contact
 * section instead of handing them a 404 — a dead resume link is the worst link
 * on a portfolio.
 */
export const dynamic = "force-static";

export function GET() {
  const onDisk = existsSync(join(process.cwd(), "public", resumeFile.replace(/^\//, "")));
  redirect(onDisk ? resumeFile : "/#contact");
}
