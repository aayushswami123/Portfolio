"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

/**
 * The scroll spine (DESIGN.md, signature detail). At >=1280px a 1px Rule line
 * runs down the left gutter; an Accent line fills it as the page scrolls, and
 * each section's margin label has a dot that fills once the Accent line
 * reaches it. The label of the section on screen turns Ink.
 *
 * Everything is derived from the current scroll position — no stored
 * progress — so it is correct on first paint, after a reload halfway down,
 * after a hash jump, and after a resize.
 */

/** Where sticky margin labels sit, in px from the top of the viewport. */
const SPINE_STICKY_TOP = 96;

const SpineContext = createContext<{ active: number; filled: number }>({
  active: -1,
  filled: 0,
});

export function ScrollSpine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ active: -1, filled: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${SPINE_STICKY_TOP + 8}px`, "end end"],
  });

  const measure = useCallback(() => {
    const root = ref.current;
    if (!root) return;

    const sections = root.querySelectorAll<HTMLElement>("[data-spine-section]");
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= SPINE_STICKY_TOP + 16) active = index;
    });

    const rect = root.getBoundingClientRect();
    const tip = rect.top + scrollYProgress.get() * rect.height;
    let filled = 0;
    root.querySelectorAll<HTMLElement>("[data-spine-dot]").forEach((dot) => {
      const box = dot.getBoundingClientRect();
      if (box.height > 0 && box.top + box.height / 2 <= tip + 0.5) filled += 1;
    });

    setState((previous) =>
      previous.active === active && previous.filled === filled ? previous : { active, filled },
    );
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", measure);

  useEffect(() => {
    // useScroll measures after mount; read once it has, and again whenever
    // layout can move (resize, fonts, late images, the ask answer growing).
    const frame = requestAnimationFrame(measure);
    const onChange = () => measure();
    window.addEventListener("resize", onChange);
    window.addEventListener("load", onChange);
    window.addEventListener("scroll", onChange, { passive: true });
    void document.fonts?.ready.then(onChange);
    const resize = new ResizeObserver(onChange);
    if (ref.current) resize.observe(ref.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("load", onChange);
      window.removeEventListener("scroll", onChange);
      resize.disconnect();
    };
  }, [measure]);

  return (
    <SpineContext.Provider value={state}>
      <div ref={ref} className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
          <div className="relative mx-auto h-full max-w-wide px-8">
            <div className="absolute bottom-0 left-[calc(2rem+5px)] top-0 w-px bg-rule" />
            <motion.div
              className="absolute bottom-0 left-[calc(2rem+5px)] top-0 w-px origin-top bg-accent"
              style={{ scaleY: scrollYProgress }}
            />
          </div>
        </div>
        {children}
      </div>
    </SpineContext.Provider>
  );
}

/** A section's name in the gutter, sticky while the section is on screen. */
export function MarginLabel({ index, label }: { index: number; label: string }) {
  const { active, filled } = useContext(SpineContext);
  const isActive = active === index;
  const isFilled = index < filled;

  return (
    <div
      aria-hidden="true"
      className="sticky hidden items-center gap-3 xl:flex"
      style={{ top: SPINE_STICKY_TOP }}
    >
      <span
        data-spine-dot=""
        className={`relative size-[11px] shrink-0 rounded-full border transition-colors duration-200 ${
          isFilled ? "border-accent bg-accent" : "border-rule bg-surface"
        }`}
      />
      <span
        className={`text-sm transition-colors duration-200 ${isActive ? "text-ink" : "text-graphite"}`}
      >
        {label}
      </span>
    </div>
  );
}
