'use client';

import { useRef, useState } from 'react';

/**
 * Each zoom step pins the exact column count — every "−" tap adds one
 * column, every "+" tap removes one. Images flow masonry-style inside
 * each column via CSS multi-column layout.
 */
const STEPS = [
  { count: 1, label: '1 column' },
  { count: 2, label: '2 columns' },
  { count: 3, label: '3 columns' },
  { count: 4, label: '4 columns' },
  { count: 5, label: '5 columns' },
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
    <span className={float}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        disabled={disabled}
        className="glass-btn relative w-[60px] h-[60px] rounded-full overflow-hidden disabled:opacity-30 disabled:pointer-events-none"
      >
        <span aria-hidden="true" className="glass-effect" />
        <span aria-hidden="true" className="glass-refraction" />
        <span aria-hidden="true" className="glass-tint" />
        <span aria-hidden="true" className="glass-stroke" />
        <span aria-hidden="true" className="glass-btn-glyph text-16">{symbol}</span>
      </button>
    </span>
  );
}

export default function ImageZoom({ children }: { children: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];
  // Track idx synchronously so rapid clicks see the latest value before React re-renders.
  const idxRef = useRef(0);

  const zoomIn = () => {
    idxRef.current = Math.max(0, idxRef.current - 1);
    setIdx(idxRef.current);
  };
  const zoomOut = () => {
    idxRef.current = Math.min(STEPS.length - 1, idxRef.current + 1);
    setIdx(idxRef.current);
  };
  const atMax = idx === 0;
  const atMin = idx === STEPS.length - 1;

  return (
    <>
      <div
        className="masonry-flow"
        style={{ ['--img-cols' as string]: String(step.count) } as React.CSSProperties}
      >
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-[20px] lg:bottom-[40px] z-30 flex justify-center items-end gap-5 lg:gap-6 pointer-events-none">
        <div className="pointer-events-auto">
          <GlassButton onClick={zoomIn}  label="Larger images — fewer columns"  symbol="+" float="float-a" disabled={atMax} />
        </div>
        <div className="pointer-events-auto">
          <GlassButton onClick={zoomOut} label="Smaller images — more columns"  symbol="−" float="float-b" disabled={atMin} />
        </div>
        <div className="pointer-events-auto">
          <GlassButton onClick={scrollEverythingToTop} label="Back to top"       symbol="↑" float="float-c" />
        </div>
      </div>

      <span className="sr-only" aria-live="polite">{step.label}</span>
    </>
  );
}
