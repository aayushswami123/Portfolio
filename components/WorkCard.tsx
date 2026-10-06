import Link from "next/link";
import { Figure } from "@/components/Figure";
import { LinkList } from "@/components/LinkList";
import { present, type WorkItem } from "@/content/types";
import type { Media } from "@/lib/media";

/**
 * One item in Selected work. At >=1024px: text left (5/12), media right
 * (7/12). Media is the demo, else a screenshot, else the diagram.
 *
 * Metrics are plain text in the HTML; nothing counts up, and the row is hidden
 * entirely unless a real measured number exists.
 */
export function WorkCard({
  item,
  media,
  figure,
}: {
  item: WorkItem;
  media: Media | null;
  figure: number | null;
}) {
  const metrics = present(item.metrics);
  const links = present(item.links);
  const caseStudyHref = item.caseStudy ? `/work/${item.slug}` : null;

  return (
    <article className="panel">
      <div className={`grid grid-cols-1 gap-8 ${media ? "lg:grid-cols-12 lg:gap-10" : ""}`}>
        <div className={`flex min-w-0 flex-col ${media ? "lg:col-span-5" : ""}`}>
          <p className="text-sm text-graphite">{item.tag}</p>

          <h3 className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold tracking-[-0.01em]">
            {caseStudyHref ? (
              <Link href={caseStudyHref} className="hover:text-accent">
                {item.title}
              </Link>
            ) : (
              item.title
            )}
            {item.live ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-normal text-graphite">
                <span aria-hidden="true" className="size-2 rounded-full bg-live" />
                Live
              </span>
            ) : null}
          </h3>

          <p className="mt-3 max-w-measure text-base text-ink">{item.summary}</p>

          {metrics.length > 0 ? (
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {metrics.slice(0, 3).map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-lg font-semibold tabular-nums text-ink">
                      {metric.value}
                    </span>
                    <span className="mt-0.5 block text-sm text-graphite">{metric.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-4 text-sm text-graphite">{item.stack.join(", ")}</p>

          {links.length > 0 ? <LinkList links={links} className="mt-5 lg:mt-auto lg:pt-6" /> : null}
        </div>

        {media && figure !== null ? (
          <div className="min-w-0 lg:col-span-7 lg:self-center">
            <Figure
              media={media}
              number={figure}
              title={item.title}
              caption={item.mediaCaption}
              href={caseStudyHref}
              uid={`fig-${item.slug}`}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
