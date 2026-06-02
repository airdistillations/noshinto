'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { asset } from '@/lib/asset';
import ScrollCounter from './ScrollCounter';
import ActiveProjectTitle from './ActiveProjectTitle';
import ProjectFilterBar from './ProjectFilterBar';

export type GalleryImage = { src: string; alt: string };

export type GalleryProject = {
  slug: string;
  title: string;
  role?: string;
  tags: string[];
  location?: string;
  year?: string | number;
  description?: string;
  firstImage?: GalleryImage;
  heroImages: GalleryImage[];
};

export default function HomeGallery({
  projects,
  allTags,
}: {
  projects: GalleryProject[];
  allTags: string[];
}) {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // OR filter: a project matches if it carries at least one active tag.
  const filtered = useMemo(() => {
    if (activeTags.length === 0) return projects;
    return projects.filter((p) => activeTags.some((t) => p.tags.includes(t)));
  }, [projects, activeTags]);

  // Stable callbacks so the filterStore subscription in ProjectFilterBar
  // doesn't re-register on every parent render.
  const toggle = useCallback((tag: string) => {
    setActiveTags((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag],
    );
  }, []);
  const clearTags = useCallback(() => setActiveTags([]), []);

  // Changing this remounts the observer-driven overlays so they re-scan the
  // newly-rendered set of [data-project-index] sections from scratch.
  const filterKey = activeTags.slice().sort().join('|') || 'all';
  const total = filtered.length;

  return (
    <main className="relative">
      <ProjectFilterBar
        tags={allTags}
        active={activeTags}
        onToggle={toggle}
        onClear={clearTags}
      />

      {/* MOBILE: full-bleed snap-scroll stack. */}
      <div className="lg:hidden snap-y snap-mandatory h-svh overflow-auto isolate">
        {filtered.map((p, i) => (
          <section
            key={p.slug}
            data-project-index={i + 1}
            className="relative h-svh snap-center"
          >
            <Link href={`/work/${p.slug}/`} className="absolute inset-0" aria-label={p.title}>
              {p.firstImage && (
                <img
                  src={asset(p.firstImage.src)}
                  alt={p.firstImage.alt || p.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
              )}
            </Link>
          </section>
        ))}
      </div>

      {/* DESKTOP: 12-col editorial grid. */}
      <div className="hidden lg:block">
        <div className="grid-layout pt-[50vh]">
          {filtered.map((p, i) => (
            <section
              key={p.slug}
              data-project-index={i + 1}
              className="col-span-12 grid grid-cols-12 gap-x-[10px] pb-20 scroll-mt-[50vh]"
            >
              <Link href={`/work/${p.slug}/`} className="col-start-4 col-span-9" aria-label={p.title}>
                <div className="grid grid-cols-3 gap-x-[10px]">
                  {p.heroImages.map((img, idx) => (
                    <div key={img.src} className="aspect-[3/4] overflow-hidden bg-[var(--color-gray)]/10">
                      <img
                        src={asset(img.src)}
                        alt={img.alt || `${p.title} — ${idx + 1}`}
                        className="h-full w-full object-cover"
                        loading={i === 0 && idx === 0 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 && idx === 0 ? 'high' : undefined}
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - p.heroImages.length) }).map((_, k) => (
                    <div key={`ph-${k}`} className="aspect-[3/4]" />
                  ))}
                </div>
              </Link>
            </section>
          ))}
        </div>
      </div>

      <ActiveProjectTitle
        key={`title-${filterKey}`}
        projects={filtered.map((p) => ({
          title: p.title,
          description: p.description,
          role: p.role,
          location: p.location,
          year: p.year,
        }))}
      />
      <ScrollCounter key={`counter-${filterKey}`} total={total} />
    </main>
  );
}
