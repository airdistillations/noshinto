'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const themeRef = useRef<'light' | 'dark'>('light');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    themeRef.current = current;
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = themeRef.current === 'dark' ? 'light' : 'dark';
    themeRef.current = next;
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex items-center justify-center w-[40px] h-[40px]"
    >
      <span aria-hidden="true" className="inline-block h-full w-full">
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
