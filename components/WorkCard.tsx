import Link from "next/link";
import { Flowchart, isFlowchart } from "@/components/Flowchart";
import { present, type WorkItem } from "@/content/types";

/**
 * One item in Selected work.
 *
 * Bordered, not a shadowed card, and no hover lift — DESIGN.md calls both out
 * as the things that make a site look generated. Metrics are plain text in the
 * HTML; nothing counts up.
 */
export function WorkCard({ item }: { item: WorkItem }) {
  const metrics = present(item.metrics);
  const shown = metrics.length > 0 ? metrics : (item.targets ?? []);
  const links = present(item.links);
  const caseStudyHref = item.caseStudy ? `/work/${item.slug}` : null;

  return (
    <article className="flex flex-col border-t border-rule pt-6">
      <p className="text-sm text-graphite">{item.tag}</p>

      <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold text-ink">
        {caseStudyHref ? (
          <Link href={caseStudyHref} className="hover:text-cobalt">
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

      <p className="mt-3 max-w-measure text-base leading-relaxed text-graphite">{item.problem}</p>
      <p className="mt-3 max-w-measure text-base leading-relaxed text-ink">{item.built}</p>

      {shown.length > 0 ? (
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {shown.slice(0, 3).map((metric) => (
            <div key={metric.label}>
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block font-mono text-lg text-ink">{metric.value}</span>
                <span className="mt-0.5 block text-sm text-graphite">{metric.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className="mt-5 font-mono text-sm text-graphite">{item.stack.join(", ")}</p>

      {item.diagram && isFlowchart(item.diagram) ? (
        <div className="mt-6">
          {caseStudyHref ? (
            // No aria-label here on purpose: the link takes its accessible
            // name from the diagram's own <title> plus the caption, so the
            // name a screen reader announces matches the text on screen.
            <Link href={caseStudyHref} className="block rounded">
              <Flowchart
                name={item.diagram}
                variant="preview"
                caption="Open the full diagram on the case study page"
              />
            </Link>
          ) : (
            <Flowchart name={item.diagram} variant="preview" />
          )}
        </div>
      ) : null}

      {links.length > 0 ? (
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="link">
                {link.label}
              </Link>
            ),
          )}
        </p>
      ) : null}
    </article>
  );
}
