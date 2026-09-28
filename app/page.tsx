import Link from "next/link";
import { AskBox } from "@/components/AskBox";
import { Container, Footer, Section } from "@/components/layout";
import { DiagramDetails } from "@/components/DiagramDetails";
import { WorkCard } from "@/components/WorkCard";
import { featuredWork, experience } from "@/content/work";
import {
  about,
  contact,
  hero,
  leadership,
  moreProjects,
  proofRow,
  shippingLog,
  shippingLogCount,
  site,
  skills,
} from "@/content/site";

export default function HomePage() {
  const recent = shippingLog.slice(0, shippingLogCount);

  return (
    <>
      <main id="main">
        {/* Hero — work first, no long preamble. */}
        <Container className="pb-16 pt-14 sm:pb-24 sm:pt-20">
          <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-hero">{site.name}</h1>

          <p className="mt-5 max-w-[22ch] text-xl font-medium leading-tight text-ink sm:max-w-[26ch] sm:text-2xl">
            {hero.pitch}
          </p>

          <p className="mt-5 max-w-measure text-base leading-relaxed text-graphite">
            {hero.status}
          </p>

          <AskBox />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/resume" className="btn btn-primary">
              Download resume
            </Link>
            <a
              href="https://github.com/aayushswami123"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-secondary">
              Email me
            </a>
          </div>
        </Container>

        {/* Proof row */}
        <Section className="!py-8">
          <h2 className="sr-only">Where I work and study</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-graphite">
            {proofRow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* Recent — the shipping log, quiet and dated. */}
        <Section heading="Recent">
          <ul className="max-w-measure space-y-3">
            {recent.map((entry) => (
              <li
                key={entry.entry}
                className="flex flex-col gap-x-6 gap-y-1 text-base sm:flex-row"
              >
                {entry.date ? (
                  <span className="shrink-0 font-mono text-sm text-graphite sm:w-24 sm:pt-0.5">
                    {entry.date}
                  </span>
                ) : (
                  <span aria-hidden="true" className="hidden shrink-0 sm:block sm:w-24" />
                )}
                <span className="text-ink">
                  {entry.entry}
                  {entry.link ? (
                    <>
                      {" "}
                      <a
                        href={entry.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {entry.link.label}
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Selected work */}
        <Section id="work" heading="Selected work">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
            {featuredWork.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section id="experience" heading="Experience">
          <ul className="divide-y divide-rule border-t border-rule">
            {experience.map((row) => (
              <li key={`${row.company}-${row.role}`} className="py-5">
                <div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-semibold text-ink">
                    {row.company}
                    <span className="font-normal text-graphite"> — {row.role}</span>
                  </h3>
                  {row.dates ? (
                    <p className="shrink-0 font-mono text-sm text-graphite">{row.dates}</p>
                  ) : null}
                </div>
                <p className="mt-2 max-w-measure text-base leading-relaxed text-graphite">
                  {row.result}
                </p>
                {row.diagram ? (
                  <DiagramDetails name={row.diagram} label="Show how it fits together" />
                ) : null}
              </li>
            ))}
          </ul>
        </Section>

        {/* Skills */}
        <Section heading="Skills">
          <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.label}>
                <dt className="text-base font-semibold text-ink">{group.label}</dt>
                <dd className="mt-1 font-mono text-sm leading-relaxed text-graphite">
                  {group.items.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* More projects */}
        <Section heading="More projects">
          <ul className="max-w-measure space-y-4">
            {moreProjects.map((project) => (
              <li key={project.name} className="text-base leading-relaxed">
                <span className="font-semibold text-ink">{project.name}</span>
                <span className="text-graphite"> — {project.text}</span>
                {project.link ? (
                  <>
                    {" "}
                    <a
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {project.link.label}
                    </a>
                  </>
                ) : null}
                {"diagram" in project && project.diagram ? (
                  <DiagramDetails name={project.diagram} label="Show how it fits together" />
                ) : null}
              </li>
            ))}
          </ul>
        </Section>

        {/* Leadership & community */}
        <Section heading="Leadership and community">
          <ul className="max-w-measure space-y-2 text-base text-graphite">
            {leadership.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* About */}
        <Section heading="About">
          <div className="max-w-measure space-y-4">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed text-graphite">
                {paragraph}
              </p>
            ))}
            {about.gpa ? (
              <p className="font-mono text-sm text-graphite">{`GPA ${about.gpa}`}</p>
            ) : null}
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" heading={contact.heading}>
          <p className="max-w-measure text-base leading-relaxed text-ink">{contact.line}</p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
            {contact.links.map((link) =>
              link.external ? (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className="link">
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <a href={`mailto:${site.email}`} className="btn btn-primary mt-8">
            Email me
          </a>
        </Section>
      </main>
      <Footer />
    </>
  );
}
