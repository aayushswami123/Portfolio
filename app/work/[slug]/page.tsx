import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container, Footer, SiteBar } from "@/components/layout";
import { Flowchart, isFlowchart } from "@/components/Flowchart";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { present } from "@/content/types";
import { JsonLd, caseStudyGraph, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({
    title: study.title,
    description: study.description,
    path: `/work/${study.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const links = present(study.links);
  const metrics = present(study.metrics);
  const measured = study.table?.rows.filter((row) => row.measured !== null) ?? [];

  return (
    <>
      <SiteBar />
      <main id="main">
        <Container className="py-14 sm:py-20">
          {/* Narrow reading column, per docs/DESIGN.md. */}
          <div className="max-w-reading">
            <p className="text-sm text-graphite">{study.tag}</p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              {study.title}
            </h1>
            <p className="mt-4 text-lg leading-snug text-graphite">{study.summary}</p>

            <dl className="mt-8 space-y-2 border-y border-rule py-5 text-sm">
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-graphite">Status</dt>
                <dd className="text-ink">{study.status}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-16 shrink-0 text-graphite">Stack</dt>
                <dd className="font-mono text-ink">{study.stack.join(", ")}</dd>
              </div>
              {links.length > 0 ? (
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-graphite">Links</dt>
                  <dd className="flex flex-wrap gap-x-4 gap-y-1">
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
                  </dd>
                </div>
              ) : null}
            </dl>

            {metrics.length > 0 ? (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="sr-only">{metric.label}</dt>
                    <dd>
                      <span className="block font-mono text-xl text-ink">{metric.value}</span>
                      <span className="mt-1 block text-sm text-graphite">{metric.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {study.sections.map((section) => (
              <section key={section.heading} className="mt-12">
                <h2 className="section-heading">{section.heading}</h2>

                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 text-base leading-relaxed text-graphite"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && present(section.bullets).length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {present(section.bullets).map((bullet) => (
                      <li
                        key={bullet.slice(0, 40)}
                        className="relative pl-5 text-base leading-relaxed text-graphite before:absolute before:left-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-graphite"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.diagram && isFlowchart(section.diagram) ? (
                  <Flowchart
                    name={section.diagram}
                    caption={section.diagramCaption}
                    className="mt-6"
                  />
                ) : null}
              </section>
            ))}

            {study.table && measured.length > 0 ? (
              <section className="mt-12">
                <h2 className="section-heading">{study.table.caption}</h2>
                <div className="diagram-scroll mt-4">
                  <table className="w-full min-w-[420px] border-collapse text-base">
                    <thead>
                      <tr className="border-b border-rule text-left">
                        {study.table.columns.map((column) => (
                          <th key={column} className="py-2 pr-4 font-medium text-graphite">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {measured.map((row) => (
                        <tr key={row.what} className="border-b border-rule">
                          <td className="py-2 pr-4 text-ink">{row.what}</td>
                          <td className="py-2 pr-4 font-mono text-graphite">{row.target}</td>
                          <td className="py-2 pr-4 font-mono text-ink">{row.measured}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {study.table && measured.length === 0 ? (
              <section className="mt-12">
                <h2 className="section-heading">Targets</h2>
                <p className="mt-2 text-sm text-graphite">
                  These are the targets the engine is built against. Measured numbers replace them
                  once the benchmarks are published.
                </p>
                <ul className="mt-4 space-y-2">
                  {study.table.rows.map((row) => (
                    <li key={row.what} className="flex flex-wrap gap-x-3 text-base">
                      <span className="text-ink">{row.what}</span>
                      <span className="font-mono text-graphite">{row.target}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="mt-16 border-t border-rule pt-6 text-sm">
              <Link href="/#work" className="link">
                All selected work
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <JsonLd
        data={caseStudyGraph({
          title: study.title,
          description: study.description,
          path: `/work/${study.slug}`,
        })}
      />
    </>
  );
}
