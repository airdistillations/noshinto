import Link from 'next/link';
import { getAllProjects } from '@/lib/work';
import { asset } from '@/lib/asset';

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-10 md:pt-20 pb-10 md:pb-16">
        <p className="eyebrow">Selected Work</p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
          A collection of projects — photography, direction, and visual work.
        </h1>
      </section>

      {projects.length === 0 ? (
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 text-muted">
          No projects yet. Add a folder under <code>content/work/</code>.
        </div>
      ) : (
        <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}/`}
                className="group block"
                aria-label={p.title}
              >
                <div className="relative overflow-hidden bg-line aspect-[4/5]">
                  {p.cover && (
                    <img
                      src={asset(p.cover)}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-xl md:text-2xl tracking-tight">{p.title}</h2>
                  {p.year && <span className="text-xs tracking-wide-xl uppercase text-muted">{p.year}</span>}
                </div>
                {p.summary && <p className="mt-1 text-sm text-muted max-w-md">{p.summary}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
