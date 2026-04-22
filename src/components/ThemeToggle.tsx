'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

type ViewTransition = {
  skipTransition: () => void;
  finished: Promise<unknown>;
};

// Rapid clicks bypass the View Transition API entirely: a burst within
// this window flips the DOM synchronously with no snapshot/overlay, so
// there's nothing for the browser to paint around.
const BURST_WINDOW_MS = 250;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const themeRef = useRef<'light' | 'dark'>('light');
  const activeTransition = useRef<ViewTransition | null>(null);
  const lastClickAt = useRef(0);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    themeRef.current = current;
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const now = performance.now();
    const burst = now - lastClickAt.current < BURST_WINDOW_MS;
    lastClickAt.current = now;

    themeRef.current = themeRef.current === 'dark' ? 'light' : 'dark';

    const apply = () => {
      const latest = themeRef.current;
      document.documentElement.setAttribute('data-theme', latest);
      try { localStorage.setItem('theme', latest); } catch {}
      setTheme(latest);
    };

    // Tear down any in-flight animation: the overlay would mask the change.
    if (activeTransition.current) {
      activeTransition.current.skipTransition();
      activeTransition.current = null;
    }

    const d = document as Document & {
      startViewTransition?: (cb: () => void) => ViewTransition;
    };

    // Burst of clicks, or no API: flip the DOM now, no animation.
    if (burst || typeof d.startViewTransition !== 'function') {
      apply();
      return;
    }

    // Isolated click: run the pretty radial reveal.
    const rect = event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty('--theme-x', `${rect.left + rect.width / 2}px`);
    document.documentElement.style.setProperty('--theme-y', `${rect.top + rect.height / 2}px`);
    const t = d.startViewTransition(apply);
    activeTransition.current = t;
    t.finished.finally(() => {
      if (activeTransition.current === t) activeTransition.current = null;
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex items-center justify-center w-[40px] h-[40px] transition-transform duration-300 ease-out hover:scale-[1.18]"
    >
      <span aria-hidden="true" className="spin-slow inline-block h-full w-full">
        <img
          src={asset('/logo.svg')}
          alt=""
          className="h-full w-full object-contain blend-difference"
          draggable={false}
        />
      </span>
      <span className="sr-only">{mounted ? theme : ''}</span>
    </button>
  );
}
