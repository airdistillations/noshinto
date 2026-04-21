'use client';

import { useState } from 'react';

/**
 * Zoom steps are expressed as a preferred *column width*. We flow the
 * images through CSS Multi-Column Layout so they pack masonry-style —
 * adjacent columns never align on the same row, there's no visible row
 * height, and images "click" into the next one vertically.
 *
 * The `min(…, 100%)` guard stops a column from overflowing a narrow
 * viewport (phones), which otherwise caused horizontal scroll and
 * pushed the floating buttons off-screen.
 */
const STEPS = [
  { min: '100%',  label: '1 col' },
  { min: '520px', label: 'large' },
  { min: '340px', label: 'medium' },
  { min: '220px', label: 'small' },
  { min: '150px', label: 'xs' },
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

type BtnProps = {
  onClick: () => void;
  label: string;
  symbol: string;
  float: 'float-a' | 'float-b' | 'float-c';
  disabled?: boolean;
};

function GlassButton({ onClick, label, symbol, float, disabled }: BtnProps) {
  return (
    <span className={`${float} inline-block`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        disabled={disabled}
        className="glass-btn w-[60px] h-[60px] rounded-full flex items-center justify-center text-16 leading-none disabled:opacity-30 disabled:pointer-events-none"
      >
        {symbol}
      </button>
    </span>
  );
}

export default function ImageZoom({ children }: { children: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  const zoomIn = () => setIdx((i) => Math.max(0, i - 1));
  const zoomOut = () => setIdx((i) => Math.min(STEPS.length - 1, i + 1));
  const atMax = idx === 0;
  const atMin = idx === STEPS.length - 1;

  return (
    <>
      <div
        className="masonry-flow"
        style={{ ['--img-min' as string]: step.min } as React.CSSProperties}
      >
        {children}
      </div>

      {/* MOBILE / TABLET: horizontal row centered at the bottom */}
      <div className="lg:hidden fixed inset-x-0 bottom-[20px] z-30 flex justify-center items-end gap-5">
        <GlassButton onClick={zoomIn}  label="Larger images — fewer columns" symbol="+" float="float-a" disabled={atMax} />
        <GlassButton onClick={zoomOut} label="Smaller images — more columns" symbol="−" float="float-b" disabled={atMin} />
        <GlassButton onClick={scrollEverythingToTop} label="Back to top"      symbol="↑" float="float-c" />
      </div>

      {/* DESKTOP: triangle cluster anchored at the bottom-right corner */}
      <div className="hidden lg:block">
        <div className="fixed z-30 bottom-[40px] right-[40px]">
          <GlassButton onClick={scrollEverythingToTop} label="Back to top" symbol="↑" float="float-c" />
        </div>
        <div className="fixed z-30 bottom-[150px] right-[40px]">
          <GlassButton onClick={zoomOut} label="Smaller images — more columns" symbol="−" float="float-b" disabled={atMin} />
        </div>
        <div className="fixed z-30 bottom-[150px] right-[150px]">
          <GlassButton onClick={zoomIn} label="Larger images — fewer columns" symbol="+" float="float-a" disabled={atMax} />
        </div>
      </div>

      <span className="sr-only" aria-live="polite">{step.label}</span>
    </>
  );
}
