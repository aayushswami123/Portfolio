import Link from "next/link";
import { MarginLabel } from "@/components/ScrollSpine";
import { contact, site } from "@/content/site";

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Hackathons", href: "/#hackathons" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: "/resume" },
];

/**
 * Page width. Below 1280px it is the 1120px content column; from 1280px up it
 * widens to make room for the margin-index gutter, so content stays 1120px.
 */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-4 sm:px-8 xl:max-w-wide ${className}`}>
      {children}
    </div>
  );
}

/** The two-column grid every row uses at >=1280px: gutter, then content. */
export const GUTTER_GRID = "xl:grid xl:grid-cols-[136px_minmax(0,1fr)] xl:gap-x-8";

const HEADING_CLASS = {
  lg: "heading-lg",
  md: "heading-md",
  sm: "heading-sm",
} as const;

/**
 * A page section. The heading stays in the content column at every width; at
 * >=1280px the section's name is also echoed in the gutter as a sticky margin
 * label on the scroll spine.
 *
 * Spacing is 64px on mobile and 112px on desktop between sections, half on
 * each side.
 */
export function Section({
  id,
  heading,
  label,
  index,
  size = "md",
  children,
}: {
  id?: string;
  heading: string;
  /** Margin index label; defaults to the heading. */
  label?: string;
  /** Position on the scroll spine, top to bottom. */
  index: number;
  size?: keyof typeof HEADING_CLASS;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-spine-section=""
      aria-labelledby={id ? `${id}-heading` : undefined}
      className="scroll-mt-16 py-8 sm:py-14"
    >
      <Container className={GUTTER_GRID}>
        <div className="xl:pt-1.5">
          <MarginLabel index={index} label={label ?? heading} />
        </div>
        <div className="min-w-0">
          <h2 id={id ? `${id}-heading` : undefined} className={`${HEADING_CLASS[size]} mb-8`}>
            {heading}
          </h2>
          {children}
        </div>
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
    <header className="sticky top-0 z-40 border-b border-rule bg-surface/95 backdrop-blur-[2px]">
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="text-sm font-semibold text-ink hover:text-accent">
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
          <summary className="flex cursor-pointer list-none items-center rounded-btn border border-rule bg-card px-3 py-1.5 text-sm text-ink [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            aria-label="Site"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-panel border border-rule bg-card py-1"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-ink hover:bg-accent-soft"
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
      <Container className={GUTTER_GRID}>
        <div aria-hidden="true" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-graphite">{contact.footer}</p>
          <p className="text-sm">
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
