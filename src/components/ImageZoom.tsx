'use client';

import { useState } from 'react';

// Zoom steps as % of the full column width.
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

      {/* Floating zoom controls, nestled under the logo (top-right) */}
      <div
        className="fixed right-5 lg:right-8 top-[68px] lg:top-[80px] z-30 flex flex-col items-center gap-[6px] blend-difference"
        style={{ color: 'var(--color-white)' }}
        aria-label="Image zoom"
      >
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Larger images"
          disabled={idx === 0}
          className="wiggle-a w-[32px] h-[32px] rounded-full border border-current flex items-center justify-center link-hover disabled:opacity-30 leading-none"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Smaller images"
          disabled={idx === SIZES.length - 1}
          className="wiggle-b w-[32px] h-[32px] rounded-full border border-current flex items-center justify-center link-hover disabled:opacity-30 leading-none"
        >
          −
        </button>
        <span className="sr-only" aria-live="polite">{size}%</span>
      </div>
    </>
  );
}
