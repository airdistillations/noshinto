'use client';

import { useEffect, useState } from 'react';

type ProjectSummary = {
  title: string;
  description?: string;
  role?: string;
  location?: string;
  year?: string | number;
};

export default function ActiveProjectTitle({ projects }: { projects: ProjectSummary[] }) {
  const [index, setIndex] = useState(1);

  useEffect(() => {
    if (projects.length === 0) return;
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
  }, [projects.length]);

  const project = projects[index - 1];
  if (!project) return null;

  const meta = [project.role, project.location, project.year]
    .filter(Boolean)
    .map(String)
    .join(' — ');

  return (
    <div
      aria-hidden
      className="hidden lg:block fixed inset-0 z-20 pointer-events-none blend-difference"
      style={{ color: 'var(--color-white)' }}
    >
      <div className="grid-layout h-full items-center">
        <div className="col-start-4 col-span-6">
          {/* key={index} forces a remount on every project change so the
              counter-tick keyframes restart on the whole title + info
              block in one synchronized motion. */}
          <div key={index} className="counter-tick">
            <h2 className="text-[3em] leading-[1.05]">{project.title}</h2>
            <div className="mt-6 max-w-[44ch]">
              {project.description && (
                <p className="copy-sm whitespace-pre-line opacity-80">
                  {project.description}
                </p>
              )}
              {meta && <p className="copy-sm pt-2 opacity-50">{meta}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
