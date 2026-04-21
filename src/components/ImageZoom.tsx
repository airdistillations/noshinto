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

      {/* Three floating liquid-glass buttons in the bottom-right corner */}
      <div className="fixed bottom-[24px] right-[24px] lg:bottom-[40px] lg:right-[40px] z-30 flex flex-col gap-3">
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Larger images"
          disabled={idx === 0}
          className="float-a glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Smaller images"
          disabled={idx === SIZES.length - 1}
          className="float-b glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30"
        >
          −
        </button>
        <button
          type="button"
          onClick={scrollEverythingToTop}
          aria-label="Back to top"
          className="float-c glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none"
        >
          ↑
        </button>
        <span className="sr-only" aria-live="polite">{size}%</span>
      </div>
    </>
  );
}
