import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getAllSlugs, getProject } from '@/lib/work';
import { asset } from '@/lib/asset';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const project = getProject(params.slug);
    return { title: `${project.title} — Noshinto` };
  } catch {
    return { title: 'Noshinto' };
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const slugs = getAllSlugs();
  if (!slugs.includes(params.slug)) notFound();
  const project = getProject(params.slug);

  const all = getAllProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <article>
      <header className="mx-auto max-w-[1400px] px-6 md:px-10 pt-10 md:pt-16 pb-6 md:pb-10">
        <p className="eyebrow">
          <Link href="/" className="hover:opacity-60">Work</Link>
          <span> / </span>
          <span>{project.title}</span>
        </p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
          {project.title}
        </h1>

        <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 max-w-3xl border-t border-line pt-6">
          {project.year && (
            <div>
              <dt className="eyebrow">Year</dt>
              <dd className="mt-1 text-sm">{project.year}</dd>
            </div>
          )}
          {project.role && (
            <div>
              <dt className="eyebrow">Role</dt>
              <dd className="mt-1 text-sm">{project.role}</dd>
            </div>
          )}
          {project.location && (
            <div>
              <dt className="eyebrow">Location</dt>
              <dd className="mt-1 text-sm">{project.location}</dd>
            </div>
          )}
        </dl>

        {project.summary && (
          <p className="mt-8 max-w-2xl text-base md:text-lg text-ink/80">{project.summary}</p>
        )}
      </header>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-16 flex flex-col gap-4 md:gap-6">
        {project.images.map((src, i) => (
          <figure key={src} className="bg-line">
            <img
              src={asset(src)}
              alt={`${project.title} — ${i + 1}`}
              className="w-full h-auto"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </figure>
        ))}
      </section>

      {project.body && (
        <section className="mx-auto max-w-[720px] px-6 md:px-10 pb-16 font-serif text-lg leading-relaxed whitespace-pre-line">
          {project.body}
        </section>
      )}

      {next && next.slug !== project.slug && (
        <nav className="border-t border-line">
          <Link
            href={`/work/${next.slug}/`}
            className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-14 flex items-baseline justify-between gap-6 group"
          >
            <span className="eyebrow">Next project</span>
            <span className="font-serif text-2xl md:text-4xl tracking-tight group-hover:opacity-60 transition-opacity">
              {next.title} →
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
