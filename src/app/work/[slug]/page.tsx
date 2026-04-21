import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getAllSlugs, getProject } from '@/lib/work';
import { asset } from '@/lib/asset';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const project = getProject(slug);
    return { title: `${project.title} — Noshinto` };
  } catch {
    return { title: 'Noshinto' };
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = getAllSlugs();
  if (!slugs.includes(slug)) notFound();
  const project = getProject(slug);

  const all = getAllProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <main className="grid-layout pt-[50vh] pb-24">
      {/* Header row: cols 2-3 for meta, cols 4-12 for first image full-width */}
      <div className="col-span-full lg:col-start-2 lg:col-span-2 text-16">
        <h1 className="text-16">{project.title}</h1>
        {project.description && (
          <p className="copy-sm pt-2 whitespace-pre-line opacity-80">{project.description}</p>
        )}
        <dl className="pt-6 copy-sm space-y-1 opacity-70">
          {project.year && (
            <div className="flex gap-2"><dt>Year</dt><dd>{project.year}</dd></div>
          )}
          {project.role && (
            <div className="flex gap-2"><dt>Role</dt><dd>{project.role}</dd></div>
          )}
          {project.location && (
            <div className="flex gap-2"><dt>Location</dt><dd>{project.location}</dd></div>
          )}
        </dl>

        <p className="pt-10 copy-sm">
          <Link href="/" className="link-hover">← Back to work</Link>
        </p>
      </div>

      {/* Stacked images, cols 4-12 */}
      <div className="col-span-full lg:col-start-4 lg:col-span-9 mt-10 lg:mt-0 flex flex-col gap-[10px]">
        {project.images.map((img, i) => (
          <figure key={img.src} className="bg-[var(--color-gray)]/10">
            <img
              src={asset(img.src)}
              alt={img.alt}
              className="w-full h-auto"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
            />
          </figure>
        ))}
      </div>

      {project.body && (
        <div className="col-span-full lg:col-start-4 lg:col-span-6 mt-16 text-16 whitespace-pre-line opacity-85">
          {project.body}
        </div>
      )}

      {next && next.slug !== project.slug && (
        <div className="col-span-full lg:col-start-2 lg:col-span-10 mt-24 pt-10 border-t border-current/10">
          <Link href={`/work/${next.slug}/`} className="link-hover text-16 flex items-baseline justify-between gap-6">
            <span className="copy-sm opacity-60">Next project</span>
            <span>{next.title} →</span>
          </Link>
        </div>
      )}
    </main>
  );
}
