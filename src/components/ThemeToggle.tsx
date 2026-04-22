'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

type ViewTransition = {
  skipTransition: () => void;
  finished: Promise<unknown>;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  // Synchronous source of truth — flipped at the top of every click so a
  // second rapid click can't see a stale value (the DOM attribute and
  // React state both lag the click stream).
  const themeRef = useRef<'light' | 'dark'>('light');
  const activeTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    themeRef.current = current;
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = themeRef.current === 'dark' ? 'light' : 'dark';
    themeRef.current = next;

    const apply = () => {
      const latest = themeRef.current;
      document.documentElement.setAttribute('data-theme', latest);
      try { localStorage.setItem('theme', latest); } catch {}
      setTheme(latest);
    };

    // Rapid second click during an active animation: skip the in-flight
    // transition and apply immediately so the DOM flips NOW instead of
    // waiting for a new snapshot/skip cycle.
    if (activeTransition.current) {
      activeTransition.current.skipTransition();
      activeTransition.current = null;
      apply();
      return;
    }

    const d = document as Document & {
      startViewTransition?: (cb: () => void) => ViewTransition;
    };

    if (typeof d.startViewTransition === 'function') {
      const rect = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--theme-y', `${rect.top + rect.height / 2}px`);
      const t = d.startViewTransition(apply);
      activeTransition.current = t;
      t.finished.finally(() => {
        if (activeTransition.current === t) activeTransition.current = null;
      });
    } else {
      apply();
    }
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
