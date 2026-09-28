import type { Metadata } from "next";
import { site } from "@/content/site";
import personJsonLd from "@/public/person-jsonld.json";

export function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

/** Page metadata with the canonical URL, OG and Twitter cards filled in. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absolute(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * The Person graph from public/person-jsonld.json, extended with the facts the
 * static file cannot know (current roles, the pages on this site).
 */
export function personGraph() {
  return {
    ...personJsonLd,
    "@id": `${site.url}#person`,
    homeLocation: undefined,
    worksFor: [
      { "@type": "Organization", name: "NestuLabs", url: "https://nestulabs.com" },
      { "@type": "Organization", name: "Cloudwick" },
    ],
    affiliation: [
      { "@type": "ResearchOrganization", name: "Rolston Lab, Arizona State University" },
    ],
  };
}

export function websiteGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.title,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}#person` },
  };
}

export function caseStudyGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: absolute(path),
    author: { "@id": `${site.url}#person` },
    isPartOf: { "@id": `${site.url}#website` },
  };
}

/** Renders a JSON-LD block. Kept out of the body text, never user input. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from local data files, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
