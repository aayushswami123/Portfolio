import type { Logo } from "./types";

/**
 * The logo strip under the hero. An entry renders only once its file exists in
 * public/logos/ — drop in an SVG or PNG with the exact filename below.
 * Snowflake is deliberately not here: it was a hackathon prize sponsor, not a
 * place Aayush works or studies.
 */
export const logos: Logo[] = [
  {
    name: "Cloudwick",
    file: "cloudwick.svg",
    label: "Incoming intern",
    href: "https://www.cloudwick.com",
  },
  { name: "SHOPLINE", file: "shopline.svg", label: "Partner", href: "https://www.shopline.com" },
  {
    name: "Arizona State University",
    file: "asu.svg",
    label: "Rolston Lab · Interplanetary Lab",
    href: "https://www.asu.edu",
  },
];

/** Qualcomm is text only. */
export const logoNote = "Capstone sponsored by Qualcomm";
