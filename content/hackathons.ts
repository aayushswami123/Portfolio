import type { HackathonItem } from "./types";

/** Newest first. Shown directly after Selected work. */
export const hackathons: HackathonItem[] = [
  {
    slug: "pr-lifeguard",
    event: "MLH Hacktoberfest Hack Day Tempe x sunhacks, ASU",
    date: "Oct 2026",
    title: "PR Lifeguard",
    award: "Winner · Best Use of Snowflake",
    problem:
      "Open-source maintainers have too many pull requests and no quick way to see which ones are small and which need real review time.",
    built:
      "An AI tool that sorts open GitHub pull requests by effort, so maintainers clear the easy ones first.",
    // [ADD: teammate name — ask them first]
    teammate: null,
    // [ADD: rest of stack]
    stack: ["Snowflake"],
    links: [
      // [ADD: demo video]
      null,
      {
        label: "Code",
        href: "https://github.com/makhijaaryan/hactober-asu-hackathon",
        external: true,
      },
      // [ADD: Devpost URL]
      null,
    ],
    tag: "Engineering",
    diagram: null,
    mediaCaption: "PR Lifeguard sorting open pull requests.",
  },
  {
    slug: "aerotrace",
    event: "Honeywell Aerospace Devils Invent, ASU — Future-Ready Avionics",
    date: "Oct 2026",
    title: "AeroTrace (Team Avio)",
    // [ADD: placement/award, if any]
    award: null,
    problem:
      "Avionics software runs on decades-old C, C++, and Ada code. Engineers spend weeks just figuring out what calls what.",
    built:
      "An agent that reads legacy C, C++, and Ada code and builds call trees of how functions and data connect.",
    how: "libclang parses C and C++; Tree-sitter parses Ada.",
    teammate: null,
    // [ADD: LLM/agent stack]
    stack: ["Python", "libclang", "Tree-sitter"],
    links: [
      // [ADD: demo video]
      null,
    ],
    codePrivate: true,
    tag: "Engineering",
    diagram: "aerotrace",
    mediaCaption: "AeroTrace demo.",
  },
];
