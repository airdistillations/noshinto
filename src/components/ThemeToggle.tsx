'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="group inline-flex items-center justify-center h-10 w-10 rounded-full border border-current/20 overflow-hidden"
      style={{ transition: 'transform 1s var(--ease-out-expo)' }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-full w-full transition-transform duration-[1000ms] group-hover:[transform:rotate(720deg)]"
        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
      >
        <img
          src={asset('/logo.svg')}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </span>
      <span className="sr-only">{mounted ? theme : ''}</span>
    </button>
  );
}
