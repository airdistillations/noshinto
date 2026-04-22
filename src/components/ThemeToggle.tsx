'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  // Synchronous source of truth for the current theme. Flipped at the top
  // of every click so a second rapid click can't see a stale value — the
  // View Transition callback (and React state) update asynchronously, so
  // DOM attributes and React state both lag behind the click stream.
  const themeRef = useRef<'light' | 'dark'>('light');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    themeRef.current = current;
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next = themeRef.current === 'dark' ? 'light' : 'dark';
    themeRef.current = next;

    // Read the latest intent at callback time — a second click may have
    // already flipped themeRef by the time this actually runs.
    const apply = () => {
      const latest = themeRef.current;
      document.documentElement.setAttribute('data-theme', latest);
      try { localStorage.setItem('theme', latest); } catch {}
      setTheme(latest);
    };

    const d = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };

    if (typeof d.startViewTransition === 'function') {
      // Radiate the reveal from the logo's position.
      const rect = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--theme-y', `${rect.top + rect.height / 2}px`);
      // Let the browser skip any in-flight transition — apply() reads the
      // live ref, so whichever callback actually runs still converges on
      // the correct final state.
      d.startViewTransition(apply);
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
