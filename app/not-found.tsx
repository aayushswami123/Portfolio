import Link from "next/link";
import { Container, Footer, SiteBar } from "@/components/layout";
import { site } from "@/content/site";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteBar />
      <main id="main">
        <Container className="py-20 sm:py-28">
          <div className="max-w-reading">
            <p className="font-mono text-sm text-graphite">404</p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              That page isn&apos;t here
            </h1>
            <p className="mt-4 text-base leading-relaxed text-graphite">
              The link may be old, or the page may have moved. The work and the contact details
              are all on the home page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">
                Go to the home page
              </Link>
              <Link href="/#work" className="btn btn-secondary">
                Selected work
              </Link>
              <a href={`mailto:${site.email}`} className="btn btn-secondary">
                Email me
              </a>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
