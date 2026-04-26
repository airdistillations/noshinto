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
      className="fixed inset-0 z-20 pointer-events-none blend-difference"
      style={{ color: 'var(--color-white)' }}
    >
      {/* Mobile: title alone, centred in the viewport. Same key/animation
          pattern as desktop so it fades up when the active project
          changes. The in-flow image-overlay title in <main> is removed —
          this fixed one takes over. */}
      <div className="lg:hidden h-full flex items-center justify-center px-5">
        <div key={`m-${index}`} className="counter-tick">
          <h2 className="title-wiggle text-[3em] leading-[1.05] tracking-tight text-center">
            {project.title}
          </h2>
        </div>
      </div>

      {/* Desktop: title at col-start-4 with info paragraph hanging below
          via absolute positioning, so the title alone is what gets
          centred and lines up with the watermark + counter at top-1/2. */}
      <div className="hidden lg:block">
        <div className="grid-layout h-full items-center">
          <div className="col-start-4 col-span-6">
            <div key={`d-${index}`} className="counter-tick relative">
              <h2 className="title-wiggle text-[3em] leading-[1.05]">
                {project.title}
              </h2>
              <div className="absolute top-full left-0 w-full mt-6 max-w-[44ch]">
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
    </div>
  );
}
