'use client';

import { useState } from 'react';

// Zoom steps in % of the full column width.
const SIZES = [100, 75, 55, 40, 28] as const;

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

      <div
        className="fixed bottom-6 right-5 lg:right-8 z-30 flex flex-col gap-[1px] blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Larger images"
          disabled={idx === 0}
          className="w-[40px] h-[40px] border border-current flex items-center justify-center link-hover disabled:opacity-30"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Smaller images"
          disabled={idx === SIZES.length - 1}
          className="w-[40px] h-[40px] border border-current flex items-center justify-center link-hover disabled:opacity-30"
        >
          −
        </button>
        <span className="sr-only" aria-live="polite">{size}%</span>
      </div>
    </>
  );
}
