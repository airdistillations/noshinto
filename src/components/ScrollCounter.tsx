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
      className="pointer-events-none fixed bottom-6 right-5 lg:right-8 z-20 blend-difference text-16"
      style={{ color: 'var(--color-white)' }}
      aria-hidden
    >
      {pad(index)} / {pad(total)}
    </div>
  );
}
