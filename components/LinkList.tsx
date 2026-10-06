import Link from "next/link";
import type { LinkRef } from "@/content/types";

/** A row of plain links. External ones open in a new tab. */
export function LinkList({
  links,
  className = "",
  children,
}: {
  links: LinkRef[];
  className?: string;
  /** Extra items after the links, e.g. "Code private". */
  children?: React.ReactNode;
}) {
  return (
    <p className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${className}`}>
      {links.map((link) =>
        link.external ? (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {link.label}
          </a>
        ) : (
          <Link key={link.href} href={link.href} className="link">
            {link.label}
          </Link>
        ),
      )}
      {children}
    </p>
  );
}
