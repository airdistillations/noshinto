'use client';

import { useState } from 'react';

/**
 * Zoom steps expressed as a minimum column width. With
 *   grid-template-columns: repeat(auto-fill, minmax(var(--img-min), 1fr))
 * the browser fits as many columns as the available width allows, so
 * each click of "−" will add a column whenever there's actually room.
 *
 * Step 0 → one image per row (full column width).
 * Further steps shrink the minimum so more fit per row on wider screens.
 */
const STEPS = [
  { min: '100%',  label: '1 col' },
  { min: '520px', label: 'large' },
  { min: '360px', label: 'medium' },
  { min: '260px', label: 'small' },
  { min: '180px', label: 'xs' },
] as const;

function scrollEverythingToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll<HTMLElement>('[data-scroll-root], .snap-y').forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } catch {
    window.scrollTo(0, 0);
  }
}

export default function ImageZoom({ children }: { children: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  const zoomIn = () => setIdx((i) => Math.max(0, i - 1));
  const zoomOut = () => setIdx((i) => Math.min(STEPS.length - 1, i + 1));

  return (
    <>
      <div
        className="grid gap-[10px]"
        style={{
          ['--img-min' as string]: step.min,
          gridTemplateColumns: 'repeat(auto-fill, minmax(var(--img-min), 1fr))',
        } as React.CSSProperties}
      >
        {children}
      </div>

      {/* Triangle cluster in the bottom-right corner */}

      {/* ↑ Back to top — corner anchor */}
      <div className="fixed z-30 bottom-[20px] right-[20px] lg:bottom-[40px] lg:right-[40px]">
        <span className="float-c inline-block">
          <button
            type="button"
            onClick={scrollEverythingToTop}
            aria-label="Back to top"
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none"
          >
            ↑
          </button>
        </span>
      </div>

      {/* − Smaller — directly above ↑ */}
      <div className="fixed z-30 bottom-[110px] right-[20px] lg:bottom-[150px] lg:right-[40px]">
        <span className="float-b inline-block">
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Smaller images — more columns"
            disabled={idx === STEPS.length - 1}
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
          >
            −
          </button>
        </span>
      </div>

      {/* + Larger — up-and-left from − */}
      <div className="fixed z-30 bottom-[110px] right-[110px] lg:bottom-[150px] lg:right-[150px]">
        <span className="float-a inline-block">
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Larger images — fewer columns"
            disabled={idx === 0}
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
          >
            +
          </button>
        </span>
      </div>

      <span className="sr-only" aria-live="polite">{step.label}</span>
    </>
  );
}
