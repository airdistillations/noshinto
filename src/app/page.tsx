import { getAllProjects, getAllRoleTags } from '@/lib/work';
import HomeGallery, { type GalleryProject } from '@/components/HomeGallery';

export default function HomePage() {
  const projects = getAllProjects();
  const allTags = getAllRoleTags();

  if (projects.length === 0) {
    return (
      <main className="grid-layout pt-[50vh] pb-24 copy-sm opacity-60">
        <p className="col-span-full lg:col-start-4 lg:col-span-6">
          No projects yet. Add a folder under <code>public/work/</code>.
        </p>
      </main>
    );
  }

  // Pass only serialisable, render-ready data to the client gallery.
  const galleryProjects: GalleryProject[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    role: p.role,
    tags: p.tags,
    location: p.location,
    year: p.year,
    description: p.description,
    firstImage: p.images[0],
    heroImages: p.images.slice(0, 3),
  }));

  return <HomeGallery projects={galleryProjects} allTags={allTags} />;
}
