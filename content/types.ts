/**
 * Content types for aayushswami.com.
 *
 * The one rule that shapes this file: a placeholder from CONTENT.md
 * (`[ADD: ...]` / `[CHECK: ...]`) is modelled as `null`, never as a string.
 * Components render `null` as nothing at all, so brackets cannot reach
 * production even if someone forgets to fill a value in.
 *
 * `todo()` records what is still missing so `npm run todos` can list it.
 */

/** A value Aayush still has to supply. Renders as nothing. */
export type Pending = null;

/** A value that is either real, or still pending. */
export type Maybe<T> = T | Pending;

export interface Metric {
  /** The number itself, as real text. Never animated, never counted up. */
  value: string;
  /** Short plain label, sentence case. */
  label: string;
}

export interface LinkRef {
  label: string;
  href: string;
  /** External links get rel/target handling and are checked by check-links. */
  external?: boolean;
}

export type WorkTag = "Engineering" | "Research" | "Founder" | "Research + Engineering";

export interface WorkItem {
  /** Also the media slug: public/demos/<slug>.mp4, public/work/<slug>.webp. */
  slug: string;
  title: string;
  tag: WorkTag;
  /** The panel description. Two lines at most on desktop. */
  summary: string;
  problem: string;
  built: string;
  /**
   * Up to 3 metrics. Pending ones are dropped before render, and the whole
   * row is hidden unless a real measured number exists — a card full of
   * "target" numbers reads as a card with no numbers.
   */
  metrics: Maybe<Metric>[];
  stack: string[];
  links: Maybe<LinkRef>[];
  /** Live dot next to shipped products only. */
  live?: boolean;
  /** Key in content/diagrams.ts. */
  diagram: Maybe<string>;
  /** Caption for a demo or screenshot, without the "Fig. N — " prefix. */
  mediaCaption: string;
  /** Does this item have a case study page? */
  caseStudy: boolean;
}

export interface HackathonItem {
  slug: string;
  event: string;
  date: string;
  title: string;
  award: Maybe<string>;
  problem: string;
  /** The two-line panel description. */
  built: string;
  how?: string;
  teammate: Maybe<string>;
  stack: Maybe<string>[];
  links: Maybe<LinkRef>[];
  /** Shows "Code private" in place of a code link. */
  codePrivate?: boolean;
  tag: WorkTag;
  diagram: Maybe<string>;
  mediaCaption: string;
}

export interface Logo {
  name: string;
  /** Filename in public/logos/. The entry renders only once the file exists. */
  file: string;
  label: string;
  href: string;
}

export interface ExperienceRow {
  company: string;
  /** Company or lab site. The name becomes a link when this is set. */
  href?: Maybe<string>;
  role: string;
  dates: Maybe<string>;
  result: string;
  diagram?: Maybe<string>;
}

export interface LogEntry {
  date: Maybe<string>;
  entry: string;
  link: Maybe<LinkRef>;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface FallbackAnswer {
  question: string;
  answer: string;
  link: LinkRef;
}

/** Drop pending entries from a list and narrow the type. */
export function present<T>(items: Maybe<T>[]): T[] {
  return items.filter((item): item is T => item !== null);
}
