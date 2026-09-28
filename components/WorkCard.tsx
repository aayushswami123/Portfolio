import Link from "next/link";
import { Flowchart, isFlowchart } from "@/components/Flowchart";
import { present, type WorkItem } from "@/content/types";

/**
 * One item in Selected work: a Surface panel, text left and diagram right at
 * roughly 60/40 on desktop.
 *
 * Bordered, not shadowed, and no hover lift — DESIGN.md calls both out as the
 * things that make a site look generated. Metrics are plain text in the HTML;
 * nothing counts up, and the row is hidden entirely unless a real measured
 * number exists.
 */
export function WorkCard({ item }: { item: WorkItem }) {
  const metrics = present(item.metrics);
  const links = present(item.links);
  const caseStudyHref = item.caseStudy ? `/work/${item.slug}` : null;
  const hasDiagram = Boolean(item.diagram && isFlowchart(item.diagram));

  return (
    <article className="panel">
      <div className={`grid gap-8 ${hasDiagram ? "lg:grid-cols-5" : ""}`}>
        <div className={hasDiagram ? "lg:col-span-3" : ""}>
          <p className="text-sm text-graphite">{item.tag}</p>

          <h3 className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold text-ink">
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

          <p className="mt-3 max-w-measure text-base leading-relaxed text-graphite">
            {item.problem}
          </p>
          <p className="mt-3 max-w-measure text-base leading-relaxed text-ink">{item.built}</p>

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

          <p className="mt-5 text-sm text-graphite">{item.stack.join(", ")}</p>

          {links.length > 0 ? (
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
        </div>

        {item.diagram && isFlowchart(item.diagram) ? (
          // Centred in its column: these diagrams are much wider than they are
          // tall, so top-aligning one leaves a tall empty block beside the text.
          <div className="lg:col-span-2 lg:self-center">
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
      </div>
    </article>
  );
}
