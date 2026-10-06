"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Poster first, video on click. Muted by default, controls on, never
 * autoplays on load, and `preload="none"` so nothing downloads until asked.
 * The poster settles from 0.96 to 1 the first time it is seen.
 */
export function DemoPlayer({
  src,
  poster,
  duration,
  title,
}: {
  src: string;
  poster: string | null;
  duration: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set on the DOM node directly (React never renders the attribute), so
  // without JavaScript or with reduced motion the poster is simply shown.
  useEffect(() => {
    const node = frameRef.current;
    const poster = posterRef.current;
    if (!node || !poster || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    poster.dataset.poster = "armed";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          requestAnimationFrame(() => {
            poster.dataset.poster = "seen";
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (playing) void videoRef.current?.play().catch(() => undefined);
  }, [playing]);

  const label = duration ? `Play demo · ${duration}` : "Play demo";

  return (
    <div ref={frameRef} className="relative aspect-video overflow-hidden rounded-[8px] bg-inset">
      {playing ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          controls
          muted
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-contain"
          aria-label={`${title} demo`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 block size-full"
          aria-label={`${label}: ${title}`}
        >
          <div ref={posterRef} className="absolute inset-0">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element -- fixed 16:9 box, lazy, already WebP
              <img
                src={poster}
                alt=""
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <span className="btn btn-primary absolute bottom-4 left-4 gap-2 py-2 group-active:scale-[0.98]">
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 fill-current">
              <path d="M2 1.2v9.6L10.6 6z" />
            </svg>
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
