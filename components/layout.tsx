import Link from "next/link";
import { contact, site } from "@/content/site";

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: "/resume" },
];

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-content px-5 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * A page section. Headings are plain sentence case — DESIGN.md rules out
 * numbered markers and small all-caps labels above every heading.
 *
 * Spacing is 64px on mobile and 112px on desktop *between* sections, so each
 * section carries half of it on each side. Putting the full value on both
 * sides doubles it and leaves the page full of empty bands.
 *
 * `tight` is for the proof row, which is a single line and would otherwise
 * float in space of its own.
 */
export function Section({
  id,
  heading,
  children,
  tight = false,
  className = "",
}: {
  id?: string;
  heading?: string;
  children: React.ReactNode;
  tight?: boolean;
  className?: string;
}) {
  const padding = tight ? "py-6 sm:py-8" : "py-8 sm:py-14";
  return (
    <section id={id} className={`scroll-mt-20 border-t border-rule ${padding} ${className}`}>
      <Container>
        {heading ? <h2 className="section-heading mb-8">{heading}</h2> : null}
        {children}
      </Container>
    </section>
  );
}

/**
 * Sticky top bar. On mobile the links collapse into a <details> disclosure,
 * which needs no JavaScript and keeps its own keyboard and screen-reader
 * behaviour.
 */
export function SiteBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="text-sm font-semibold text-ink hover:text-cobalt">
          {site.name}
        </Link>

        <nav aria-label="Site" className="hidden items-center gap-6 text-sm sm:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-graphite hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="relative sm:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded border border-rule bg-surface px-3 py-1.5 text-sm text-ink [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Site"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded border border-rule bg-surface py-1"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-ink hover:bg-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rule py-10">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-graphite">{contact.footer}</p>
        <p className="text-sm text-graphite">
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
        </p>
      </Container>
    </footer>
  );
}
