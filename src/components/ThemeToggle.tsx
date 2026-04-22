'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const transitioning = useRef(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    // Read from the DOM rather than React state: rapid successive clicks
    // fire before the component re-renders, so the `theme` closure would be
    // stale and both clicks would compute the same `next`.
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    const apply = () => {
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch {}
      setTheme(next);
    };

    const d = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<unknown> };
    };

    // Rapid successive clicks bypass the view transition so every tap
    // registers immediately — the API otherwise drops/queues overlapping
    // transitions, which felt like unresponsive clicks.
    if (typeof d.startViewTransition === 'function' && !transitioning.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty('--theme-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--theme-y', `${rect.top + rect.height / 2}px`);
      transitioning.current = true;
      const t = d.startViewTransition(apply);
      t.finished.finally(() => { transitioning.current = false; });
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
