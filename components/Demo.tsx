import { DemoPlayer } from "@/components/DemoPlayer";
import { demoFor } from "@/lib/media";

/**
 * Reads public/demos/<slug>.mp4 and <slug>-poster.webp. If the mp4 is
 * missing, renders nothing.
 */
export function Demo({ slug, title }: { slug: string; title: string }) {
  const demo = demoFor(slug);
  if (!demo) return null;
  return <DemoPlayer src={demo.src} poster={demo.poster} duration={demo.duration} title={title} />;
}
