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

      {/*
        Triangle formation anchored to the bottom-right corner.
        ↑ at the corner; − directly above; + diagonally up-and-left from −.
        Each button is independently positioned and floats out of phase,
        so the triangle gently breathes without anything touching.
      */}

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
            aria-label="Smaller images"
            disabled={idx === SIZES.length - 1}
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
            aria-label="Larger images"
            disabled={idx === 0}
            className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
          >
            +
          </button>
        </span>
      </div>

      <span className="sr-only" aria-live="polite">{size}%</span>
    </>
  );
}
