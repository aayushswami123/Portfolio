import Link from "next/link";
import { contact, site } from "@/content/site";

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
 */
export function Section({
  id,
  heading,
  children,
  className = "",
}: {
  id?: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-8 border-t border-rule py-16 sm:py-24 ${className}`}>
      <Container>
        {heading ? <h2 className="section-heading mb-8">{heading}</h2> : null}
        {children}
      </Container>
    </section>
  );
}

/** A quiet bar for the pages that are not the home page. */
export function SiteBar() {
  return (
    <header className="border-b border-rule">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="text-sm font-semibold text-ink hover:text-cobalt">
          {site.name}
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          <Link href="/#work" className="text-graphite hover:text-ink">
            Work
          </Link>
          <Link href="/#experience" className="text-graphite hover:text-ink">
            Experience
          </Link>
          <Link href="/resume" className="text-graphite hover:text-ink">
            Resume
          </Link>
          <Link href="/#contact" className="text-graphite hover:text-ink">
            Contact
          </Link>
        </nav>
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
