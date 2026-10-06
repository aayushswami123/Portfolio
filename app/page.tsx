import Link from "next/link";
import { AskBox } from "@/components/AskBox";
import { Container, Footer, GUTTER_GRID, Section, SiteBar } from "@/components/layout";
import { DiagramDetails } from "@/components/DiagramDetails";
import { HackathonCard } from "@/components/HackathonCard";
import { LinkList } from "@/components/LinkList";
import { LogoStrip } from "@/components/LogoStrip";
import { ScrollSpine } from "@/components/ScrollSpine";
import { WordReveal } from "@/components/WordReveal";
import { WorkCard } from "@/components/WorkCard";
import { hackathons } from "@/content/hackathons";
import { featuredWork, experience } from "@/content/work";
import {
  about,
  contact,
  hero,
  leadership,
  moreProjects,
  shippingLog,
  shippingLogCount,
  site,
  skills,
} from "@/content/site";
import { figureCounter, resolveMedia } from "@/lib/media";
import { getGitHubActivity, shortDate } from "@/lib/github-activity";

/** Re-render at most hourly so "On GitHub" picks up new commits and PRs. */
export const revalidate = 3600;

export default async function HomePage() {
  const activity = await getGitHubActivity();
  const recent = shippingLog.slice(0, shippingLogCount);

  // Figures are numbered in page order, so resolve every panel's media first.
  const fig = figureCounter();
  const work = featuredWork.map((item) => {
    const media = resolveMedia(item.slug, item.diagram);
    return { item, media, figure: media ? fig.next() : null };
  });
  const hacks = hackathons.map((item) => {
    const media = resolveMedia(item.slug, item.diagram);
    return { item, media, figure: media ? fig.next() : null };
  });
  const experienceRows = experience.map((row) => ({
    row,
    figure: row.diagram ? fig.next() : null,
  }));

  return (
    <>
      <SiteBar />
      <main id="main">
        {/* Hero: two columns from 1024px — who, what, how to reach; then Ask. */}
        <Container className={`pb-10 pt-10 sm:pb-14 sm:pt-16 ${GUTTER_GRID}`}>
          <div aria-hidden="true" />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-7">
              <h1 className="text-name font-bold sm:text-name-lg">{site.name}</h1>

              <WordReveal
                text={hero.pitch}
                className="mt-5 max-w-[34ch] text-xl font-medium tracking-[-0.015em] text-ink sm:text-[1.625rem] sm:leading-[1.3]"
              />

              <p className="mt-5 max-w-measure text-base text-graphite">{hero.status}</p>

              <p className="mt-4 text-sm text-ink">{hero.education}</p>

              <div className="mt-7 flex flex-wrap gap-3">
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
            </div>

            <div className="min-w-0 lg:col-span-5">
              <AskBox />
            </div>
          </div>
        </Container>

        {/* Logo strip — replaces the proof row. */}
        <Container className={`pb-6 ${GUTTER_GRID}`}>
          <div aria-hidden="true" />
          <div className="border-y border-rule py-6">
            <LogoStrip />
          </div>
        </Container>

        <ScrollSpine>
          {/* Recent — the newest three, quiet and dated. */}
          <Section id="recent" heading="Recent" index={0} size="sm">
            <ul className="max-w-measure space-y-3">
              {recent.map((entry) => (
                <li key={entry.entry} className="flex flex-col gap-x-6 gap-y-0.5 sm:flex-row">
                  {entry.date ? (
                    <span className="shrink-0 text-sm text-graphite sm:w-20 sm:pt-0.5">
                      {entry.date}
                    </span>
                  ) : null}
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

            {activity.length > 0 ? (
              <div className="mt-8 max-w-measure">
                <h3 className="text-sm font-semibold text-ink">On GitHub</h3>
                <ul className="mt-3 space-y-3">
                  {activity.map((item) => (
                    <li
                      key={`${item.repo}-${item.date}`}
                      className="flex flex-col gap-x-6 gap-y-0.5 sm:flex-row"
                    >
                      <span className="shrink-0 text-sm text-graphite sm:w-20 sm:pt-0.5">
                        {shortDate(item.date)}
                      </span>
                      <span className="text-ink">
                        {item.summary}{" "}
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link text-sm"
                        >
                          {item.repo.split("/")[1]}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Section>

          <Section id="work" heading="Selected work" label="Work" index={1} size="lg">
            <div className="space-y-6">
              {work.map(({ item, media, figure }) => (
                <WorkCard key={item.slug} item={item} media={media} figure={figure} />
              ))}
            </div>
          </Section>

          <Section id="hackathons" heading="Hackathons" index={2}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {hacks.map(({ item, media, figure }) => (
                <HackathonCard key={item.slug} item={item} media={media} figure={figure} />
              ))}
            </div>
          </Section>

          <Section id="experience" heading="Experience" index={3}>
            <ul className="divide-y divide-rule border-y border-rule">
              {experienceRows.map(({ row, figure }) => (
                <li key={`${row.company}-${row.role}`} className="py-5">
                  <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                    <div>
                      <h3 className="text-base font-semibold">
                        {row.href ? (
                          <a
                            href={row.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                          >
                            {row.company}
                          </a>
                        ) : (
                          row.company
                        )}
                      </h3>
                      <p className="mt-0.5 text-base text-graphite">{row.role}</p>
                    </div>
                    {row.dates ? (
                      <p className="mt-1 shrink-0 text-sm text-graphite sm:mt-0 sm:text-right">
                        {row.dates}
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-measure text-base text-graphite">{row.result}</p>
                  {row.diagram && figure !== null ? (
                    <DiagramDetails
                      name={row.diagram}
                      figure={figure}
                      label="Show how it fits together"
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="skills" heading="Skills" index={4} size="sm">
            <dl className="space-y-2 text-sm">
              {skills.map((group) => (
                <div key={group.label} className="flex flex-col gap-x-4 sm:flex-row">
                  <dt className="shrink-0 font-semibold text-ink sm:w-36">{group.label}</dt>
                  <dd className="text-graphite">{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="projects" heading="More projects" label="Projects" index={5} size="sm">
            <ul className="max-w-measure space-y-3">
              {moreProjects.map((project) => (
                <li key={project.name} className="text-base">
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
                </li>
              ))}
            </ul>
          </Section>

          {/* Closing: about, leadership, and contact in one section. */}
          <Section id="contact" heading={contact.heading} label="Contact" index={6}>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="space-y-4 lg:col-span-7">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="max-w-measure text-base text-graphite">
                    {paragraph}
                  </p>
                ))}
                <p className="max-w-measure text-base text-ink">{contact.line}</p>
                <LinkList links={contact.links} className="pt-2" />
                <div className="pt-4">
                  <a href={`mailto:${site.email}`} className="btn btn-primary">
                    Email me
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <h3 className="text-base font-semibold">Leadership and community</h3>
                <ul className="mt-3 space-y-2 text-sm text-graphite">
                  {leadership.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </ScrollSpine>
      </main>
      <Footer />
    </>
  );
}
