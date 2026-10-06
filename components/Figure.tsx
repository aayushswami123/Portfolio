import Image from "next/image";
import Link from "next/link";
import { Demo } from "@/components/Demo";
import { Diagram } from "@/components/Diagram";
import { diagrams } from "@/content/diagrams";
import type { Media } from "@/lib/media";

/**
 * One numbered figure: "Fig. 3 — PR Lifeguard sorting open pull requests."
 * Demos and screenshots use the project's caption; diagrams use their own.
 * Media sits on an Inset well — never a second border inside a panel.
 */
export function Figure({
  media,
  number,
  title,
  caption,
  href,
  uid,
  captionOverride,
}: {
  media: Media;
  number: number;
  title: string;
  /** Caption for a demo or screenshot. */
  caption: string;
  /** Diagrams link to the case study when there is one. */
  href?: string | null;
  uid: string;
  /** Replaces the diagram's default caption (case study pages have their own). */
  captionOverride?: string;
}) {
  const text =
    captionOverride ?? (media.kind === "diagram" ? diagrams[media.name].caption : caption);

  let body: React.ReactNode;
  if (media.kind === "demo") {
    body = <Demo slug={media.slug} title={title} />;
  } else if (media.kind === "screenshot") {
    body = (
      <div className="relative aspect-video overflow-hidden rounded-[8px] bg-inset">
        <Image
          src={media.src}
          alt={caption.replace(/\.$/, "")}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover object-top"
        />
      </div>
    );
  } else {
    const diagram = (
      <div className="well p-3 sm:p-5">
        <Diagram name={media.name} uid={uid} />
      </div>
    );
    body = href ? (
      // The link's accessible name comes from the diagram's <title>.
      <Link href={href} className="block rounded-[8px]">
        {diagram}
      </Link>
    ) : (
      diagram
    );
  }

  return (
    <figure className="min-w-0">
      {body}
      <figcaption className="mt-3 text-sm text-graphite">
        {`Fig. ${number} — ${text}`}
      </figcaption>
    </figure>
  );
}
