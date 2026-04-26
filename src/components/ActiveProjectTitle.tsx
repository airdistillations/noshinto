'use client';

import { useEffect, useState } from 'react';

export default function ActiveProjectTitle({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (titles.length === 0) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-project-index]'));
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
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
  }, [titles.length]);

  const title = titles[index - 1] ?? '';

  return (
    <div
      aria-hidden
      className="hidden lg:block fixed inset-0 z-20 pointer-events-none blend-difference"
      style={{ color: 'var(--color-white)' }}
    >
      <div className="grid-layout h-full items-center">
        <h2 className="col-start-4 col-span-6 text-[3em] leading-[1.05]">
          <span key={index} className="counter-tick inline-block">
            {title}
          </span>
        </h2>
      </div>
    </div>
  );
}
