import Link from 'next/link';
import { getAllProjects } from '@/lib/work';
import { asset } from '@/lib/asset';
import ScrollCounter from '@/components/ScrollCounter';
import ActiveProjectTitle from '@/components/ActiveProjectTitle';

export default function HomePage() {
  const projects = getAllProjects();
  const total = projects.length;

  if (total === 0) {
    return (
      <main className="grid-layout pt-[50vh] pb-24 copy-sm opacity-60">
        <p className="col-span-full lg:col-start-4 lg:col-span-6">
          No projects yet. Add a folder under <code>public/work/</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="relative">
      {/* MOBILE: full-bleed snap-scroll stack. isolate here (not on <main>)
          so the ScrollCounter's z-20 lands in the body's stacking context
          and renders above Nav's bottom scrim (z-10) — while still
          containing the blend-difference titles below. */}
      <div className="lg:hidden snap-y snap-mandatory h-svh overflow-auto isolate">
        {projects.map((p, i) => {
          const firstImage = p.images[0];
          return (
            <section
              key={p.slug}
              data-project-index={i + 1}
              className="relative h-svh snap-center"
            >
              <Link
                href={`/work/${p.slug}/`}
                className="absolute inset-0"
                aria-label={p.title}
              >
                {firstImage && (
                  <img
                    src={asset(firstImage.src)}
                    alt={firstImage.alt || p.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                  />
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center p-5 blend-difference"
                  style={{ color: 'var(--color-white)' }}
                >
                  <h2 className="text-16 tracking-tight">{p.title}</h2>
                </div>
              </Link>
            </section>
          );
        })}
      </div>

      {/* DESKTOP: 12-col editorial grid */}
      <div className="hidden lg:block">
        <div className="grid-layout pt-[50vh]">
          {projects.map((p, i) => {
            const heroImages = p.images.slice(0, 3);
            return (
              <section
                key={p.slug}
                data-project-index={i + 1}
                className="col-span-12 grid grid-cols-12 gap-x-[10px] pb-20 scroll-mt-[50vh]"
              >
                {/* Cols 4-12: image strip. Title + description + meta now
                    live in the fixed ActiveProjectTitle overlay. */}
                <Link
                  href={`/work/${p.slug}/`}
                  className="col-start-4 col-span-9"
                  aria-label={p.title}
                >
                  <div className="grid grid-cols-3 gap-x-[10px]">
                    {heroImages.map((img, idx) => (
                      <div
                        key={img.src}
                        className="aspect-[3/4] overflow-hidden bg-[var(--color-gray)]/10"
                      >
                        <img
                          src={asset(img.src)}
                          alt={img.alt || `${p.title} — ${idx + 1}`}
                          className="h-full w-full object-cover"
                          loading={i === 0 && idx === 0 ? 'eager' : 'lazy'}
                          fetchPriority={i === 0 && idx === 0 ? 'high' : undefined}
                        />
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - heroImages.length) }).map((_, k) => (
                      <div key={`ph-${k}`} className="aspect-[3/4]" />
                    ))}
                  </div>
                </Link>
              </section>
            );
          })}
        </div>
      </div>

      <ActiveProjectTitle
        projects={projects.map((p) => ({
          title: p.title,
          description: p.description,
          role: p.role,
          location: p.location,
          year: p.year,
        }))}
      />
      <ScrollCounter total={total} />
    </main>
  );
}
