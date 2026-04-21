'use client';

import { useState } from 'react';

const SIZES = [100, 75, 55, 40, 28] as const;

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
  const size = SIZES[idx];

  const zoomIn = () => setIdx((i) => Math.max(0, i - 1));
  const zoomOut = () => setIdx((i) => Math.min(SIZES.length - 1, i + 1));

  return (
    <>
      <div
        className="flex flex-col items-center gap-[10px]"
        style={{ ['--img-size' as string]: `${size}%` } as React.CSSProperties}
      >
        {children}
      </div>

      {/* Liquid water-drop cluster, bottom-right */}
      <div className="fixed bottom-[24px] right-[24px] lg:bottom-[40px] lg:right-[40px] z-30 flex flex-col items-center gap-[28px]">
        {/*
          Float animation lives on the wrapper; hover scale/lift lives on the
          button. Keeping the two transforms on separate elements lets both
          run without overriding each other.
        */}
        <span className="float-a inline-block">
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Larger images"
            disabled={idx === 0}
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
          >
            +
          </button>
        </span>

        <span className="float-b inline-block">
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Smaller images"
            disabled={idx === SIZES.length - 1}
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
          >
            −
          </button>
        </span>

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

        <span className="sr-only" aria-live="polite">{size}%</span>
      </div>
    </>
  );
}
