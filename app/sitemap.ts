import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/resume`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 },
  ];
}
