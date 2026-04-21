'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

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

// Wraps a state update in a View Transition when the browser supports it,
// so the masonry reflow is tweened automatically (FLIP for every figure
// with a unique view-transition-name).
function withTransition(update: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (typeof d.startViewTransition === 'function') {
    d.startViewTransition(() => flushSync(update));
  } else {
    update();
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
        className="glass-btn relative w-[60px] h-[60px] rounded-full flex items-center justify-center leading-none disabled:opacity-30 disabled:pointer-events-none"
      >
        {/* Symbol lives in a sibling overlay so it sits outside the
            glass-btn stacking context — that lets mix-blend-difference
            blend against the page backdrop (images + bg), auto-inverting. */}
        <span
          aria-hidden="true"
          className="glass-btn-glyph pointer-events-none text-16"
        >
          {symbol}
        </span>
      </button>
    </span>
  );
}

export default function ImageZoom({ children }: { children: React.ReactNode }) {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  const zoomIn = () => withTransition(() => setIdx((i) => Math.max(0, i - 1)));
  const zoomOut = () => withTransition(() => setIdx((i) => Math.min(STEPS.length - 1, i + 1)));
  const atMax = idx === 0;
  const atMin = idx === STEPS.length - 1;

  // Specular stroke tracking: each .glass-btn picks up a --stroke-angle
  // pointing from its centre toward the cursor, so the bright arc on the
  // conic-gradient ring always faces the mouse. rAF-batched to stay cheap.
  useEffect(() => {
    let raf = 0;
    let latest: { x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!latest) return;
      const buttons = document.querySelectorAll<HTMLElement>('.glass-btn');
      buttons.forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // atan2: 0 = right, +π/2 = down. Add 90° to align with CSS conic (0 = top).
        const angle = (Math.atan2(latest!.y - cy, latest!.x - cx) * 180) / Math.PI + 90;
        btn.style.setProperty('--stroke-angle', `${angle}deg`);
      });
    };
    const onMove = (e: MouseEvent) => {
      latest = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        className="masonry-flow"
        style={{ ['--img-cols' as string]: String(step.count) } as React.CSSProperties}
      >
        {children}
      </div>

      {/* Unified bottom-center row for every viewport. Named view-transition
          group keeps this cluster on its own layer above the masonry during
          reflow animations (otherwise the root snapshot can cover it). */}
      <div
        className="fixed inset-x-0 bottom-[20px] lg:bottom-[40px] z-30 flex justify-center items-end gap-5 lg:gap-6 pointer-events-none"
        style={{ ['viewTransitionName' as string]: 'zoom-cluster' } as React.CSSProperties}
      >
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
