"use client";

import { useEffect, useRef } from "react";

/**
 * Draws a diagram's main path the first time it is half on screen.
 *
 * The server renders no `data-dg` at all, so without JavaScript — or with
 * reduced motion — the diagram is simply drawn. After hydration the element is
 * "armed" (main path hidden), then "drawn" once by an IntersectionObserver.
 * The attribute is set on the DOM node directly: React never renders it, so
 * no re-render is involved.
 */
export function DrawOnView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.dg = "armed";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Wait a frame so the armed state paints before the transition.
          requestAnimationFrame(() => {
            node.dataset.dg = "drawn";
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
