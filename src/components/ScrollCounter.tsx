'use client';

import { useEffect, useState } from 'react';

export default function ScrollCounter({ total }: { total: number }) {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (total <= 0) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-project-index]'));
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio that's in view.
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const n = Number((best.target as HTMLElement).dataset.projectIndex);
          if (!Number.isNaN(n)) setIndex(n);
        }
      },
      { threshold: [0.4, 0.6, 0.8], rootMargin: '-10% 0px -10% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [total]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className="pointer-events-none fixed z-20 blend-difference text-[3em] leading-none tabular-nums bottom-6 left-1/2 -translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-auto lg:right-0 lg:pr-8 lg:translate-x-0 lg:-translate-y-1/2"
      style={{ color: 'var(--color-white)' }}
      aria-hidden
    >
      <span key={index} className="counter-tick inline-block">
        {pad(index)}
      </span>
      {' / '}
      {pad(total)}
    </div>
  );
}
