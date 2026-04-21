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

      {/*
        Two separately-positioned floating buttons around the logo corner.
        Each has its own slow, out-of-phase drift animation, so they feel
        like they're orbiting the logo rather than sitting in a stack.
      */}
      <div className="pointer-events-none">
        {/* + : roughly to the left of the logo */}
        <div
          className="fixed z-30 right-[60px] lg:right-[80px] top-[18px] lg:top-[24px] float-a"
        >
          <button
            type="button"
            onClick={zoomIn}
            aria-label="Larger images"
            disabled={idx === 0}
            className="pointer-events-auto glass-btn w-[40px] h-[40px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30"
          >
            +
          </button>
        </div>

        {/* − : below the logo */}
        <div
          className="fixed z-30 right-5 lg:right-8 top-[76px] lg:top-[88px] float-b"
        >
          <button
            type="button"
            onClick={zoomOut}
            aria-label="Smaller images"
            disabled={idx === SIZES.length - 1}
            className="pointer-events-auto glass-btn w-[40px] h-[40px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30"
          >
            −
          </button>
        </div>

        <span className="sr-only" aria-live="polite">{size}%</span>
      </div>
    </>
  );
}
