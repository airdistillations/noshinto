'use client';

import { Fragment, useEffect, useState } from 'react';
import TagPills from './TagPills';

type ProjectSummary = {
  title: string;
  description?: string;
  role?: string;
  location?: string;
  year?: string | number;
};

/**
 * Splits a title into per-word spans, each with the .title-wiggle
 * animation and a staggered animation-delay so the words drift out
 * of phase instead of moving in lockstep.
 */
function WigglingTitle({ children }: { children: string }) {
  const words = children.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="title-wiggle inline-block"
            style={{ animationDelay: `${i * -1.3}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}

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

  // Location + year stay as a plain text line; role is broken into pills.
  const meta = [project.location, project.year]
    .filter(Boolean)
    .map(String)
    .join(' — ');

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-20 pointer-events-none blend-difference"
      style={{ color: 'var(--color-white)' }}
    >
      {/* Mobile: title alone, centred in the viewport. */}
      <div className="lg:hidden h-full flex items-center justify-center px-5">
        <div key={`m-${index}`} className="counter-tick">
          <h2 className="text-[3em] leading-[1.05] tracking-tight text-center">
            <WigglingTitle>{project.title}</WigglingTitle>
          </h2>
        </div>
      </div>

      {/* Desktop: title at col-start-4 with info paragraph hanging below
          via absolute positioning, so the title alone is what gets
          centred and lines up with the watermark + counter at top-1/2.
          content-center (not items-center) is what actually centres the
          auto-sized row within the full-height grid container. */}
      <div className="hidden lg:block h-full">
        <div className="grid-layout h-full content-center">
          <div className="col-start-4 col-span-6">
            <div key={`d-${index}`} className="counter-tick relative">
              <h2 className="text-[3em] leading-[1.05]">
                <WigglingTitle>{project.title}</WigglingTitle>
              </h2>
              <div className="absolute top-full left-0 w-full mt-6 max-w-[44ch]">
                {project.description && (
                  <p className="copy-sm whitespace-pre-line opacity-80">
                    {project.description}
                  </p>
                )}
                <TagPills value={project.role} className="pt-3" />
                {meta && <p className="copy-sm pt-2 opacity-50">{meta}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
