'use client';

import { useEffect } from 'react';

// Keeps data-theme in sync if the user changes the OS theme and hasn't picked explicitly.
export default function ThemeBoot() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return null;
}
