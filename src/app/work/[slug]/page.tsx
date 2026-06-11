import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getAllSlugs, getProject, type Project } from '@/lib/work';
import { asset } from '@/lib/asset';
import ImageZoom from '@/components/ImageZoom';
import TagPills from '@/components/TagPills';

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

/** Mobile-only version of project metadata — still rendered inline
 *  above the images. Desktop uses three fixed corner blocks instead. */
function ProjectInfoMobile({ project }: { project: Project }) {
  return (
    <div className="text-16">
      <h1 className="text-16">{project.title}</h1>
      {project.description && (
        <p className="copy-sm pt-2 whitespace-pre-line opacity-80">{project.description}</p>
      )}
      <dl className="pt-6 copy-sm space-y-1 opacity-70">
        {project.year && (
          <div className="flex gap-2"><dt>Year</dt><dd>{project.year}</dd></div>
        )}
        {project.location && (
          <div className="flex gap-2"><dt>Location</dt><dd>{project.location}</dd></div>
        )}
      </dl>
      {project.role && (
        <TagPills value={project.role} className="pt-4 pb-2" />
      )}
      {/* Generous air above and below the nav links row. */}
      <p className="pt-16 pb-6 flex items-baseline gap-8 text-[1.3rem] uppercase tracking-[0.18em]">
        <Link href="/" className="link-hover"><span className="arrow-drift" aria-hidden>←</span> Back to work</Link>
        <Link href="/about/" className="link-hover">about</Link>
      </p>
      {project.body && (
        <div className="pt-10 copy-sm whitespace-pre-line opacity-80">{project.body}</div>
      )}
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = getAllSlugs();
  if (!slugs.includes(slug)) notFound();
  const project = getProject(slug);

  const all = getAllProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = all.length > 1 ? all[(idx - 1 + all.length) % all.length] : undefined;
  const next = all.length > 1 ? all[(idx + 1) % all.length] : undefined;

  return (
    // Mobile starts the info block near the top-left (clearing the header
    // logo); desktop keeps the original 50vh editorial offset.
    <main className="grid-layout pt-24 lg:pt-[50vh] pb-24">
      {/* DESKTOP: project info pinned to the top-left corner. top-8
          matches the header's lg:py-8 so this block sits on the same
          baseline as the rotating logo in the top-right. */}
      <aside
        className="hidden lg:block fixed top-8 left-0 z-10 pl-8 pr-4 max-w-[280px] text-16 blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        <h1 className="text-16">{project.title}</h1>
        {project.description && (
          <p className="copy-sm pt-2 whitespace-pre-line opacity-80">{project.description}</p>
        )}
        <dl className="pt-6 copy-sm space-y-1 opacity-70">
          {project.year && (
            <div className="flex gap-2"><dt>Year</dt><dd>{project.year}</dd></div>
          )}
          {project.location && (
            <div className="flex gap-2"><dt>Location</dt><dd>{project.location}</dd></div>
          )}
        </dl>
        {project.role && <TagPills value={project.role} className="pt-6" />}
      </aside>

      {/* DESKTOP: nav stack vertically centred on the left — Back to work
          and about. Replaces the header nav on project pages so the
          top-right corner can hold only the rotating logo. Uppercase +
          tracking to match the global nav style. */}
      <nav
        aria-label="Primary"
        className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-10 pl-8 pr-4 flex-col gap-2 text-[1.1rem] uppercase tracking-[0.18em] blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        <Link href="/" className="link-hover"><span className="arrow-drift" aria-hidden>←</span> Back to work</Link>
        <Link href="/about/" className="link-hover">about</Link>
      </nav>

      {/* DESKTOP: project body / copy pinned to the bottom-left corner.
          max-h + overflow-y-auto keeps long bodies from running off the
          screen. */}
      {project.body && (
        <div
          className="hidden lg:block fixed bottom-12 left-0 z-10 pl-8 pr-4 max-w-[280px] max-h-[40vh] overflow-y-auto text-16 blend-difference"
          style={{ color: 'var(--color-white)' }}
        >
          <div className="copy-sm whitespace-pre-line opacity-80">{project.body}</div>
        </div>
      )}

      {/* MOBILE: info inline above the images (no blend). */}
      {/* relative z-20 lifts the text above the fixed top/bottom scrims
          (z-10) so it never gets caught in their backdrop blur. */}
      <div className="col-span-full lg:hidden relative z-20">
        <ProjectInfoMobile project={project} />
      </div>

      {/* Stacked images, cols 4-12 on desktop */}
      <div className="col-span-full lg:col-start-4 lg:col-span-9 mt-10 lg:mt-0">
        <ImageZoom>
          {project.images.map((img, i) => (
            <figure
              key={img.src}
              className="bg-[var(--color-gray)]/10"
            >
              <img
                src={asset(img.src)}
                alt={img.alt}
                className="w-full h-auto"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
              />
            </figure>
          ))}
        </ImageZoom>
      </div>

      {/* Prev / Next footer — aligned to the image strip (cols 4-12) so
          the divider matches the images' left edge and clears the fixed
          left-side text blocks. Extra top margin on desktop. */}
      {(prev || next) && (
        <div className="col-span-full lg:col-start-4 lg:col-span-9 relative z-20 mt-24 lg:mt-48 pt-10 border-t border-current/10 flex items-baseline justify-between gap-6">
          {prev ? (
            <Link href={`/work/${prev.slug}/`} className="link-hover text-16 min-w-0">
              <span className="copy-sm opacity-60 block">← Previous project</span>
              <span className="block truncate">{prev.title}</span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {next ? (
            <Link href={`/work/${next.slug}/`} className="link-hover text-16 text-right min-w-0">
              <span className="copy-sm opacity-60 block">Next project →</span>
              <span className="block truncate">{next.title}</span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
        </div>
      )}
    </main>
  );
}
