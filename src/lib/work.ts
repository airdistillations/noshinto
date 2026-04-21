import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Project = {
  slug: string;
  title: string;
  year?: string | number;
  role?: string;
  location?: string;
  summary?: string;
  cover: string;
  images: string[];
  order: number;
  body: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'public', 'work');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

function isImage(file: string) {
  return IMAGE_EXT.has(path.extname(file).toLowerCase());
}

function publicImagePath(slug: string, filename: string) {
  return `/work/${slug}/${filename}`;
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = fs.readdirSync(CONTENT_DIR).filter((name) => {
    const full = path.join(CONTENT_DIR, name);
    return fs.statSync(full).isDirectory();
  });

  const projects: Project[] = slugs.map((slug) => getProject(slug));
  return projects.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export function getProject(slug: string): Project {
  const dir = path.join(CONTENT_DIR, slug);
  const mdPath = path.join(dir, 'project.md');
  const raw = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  const parsed = raw ? matter(raw) : { data: {} as Record<string, unknown>, content: '' };
  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content;

  const files = fs.readdirSync(dir).filter(isImage).sort();

  const explicitCover = typeof data.cover === 'string' ? data.cover : undefined;
  const explicitImages = Array.isArray(data.images) ? (data.images as string[]) : undefined;

  const imageFiles = explicitImages?.length ? explicitImages : files;
  const coverFile = explicitCover || imageFiles[0] || files[0];

  return {
    slug,
    title: (data.title as string) || slug.replace(/-/g, ' '),
    year: data.year as string | number | undefined,
    role: data.role as string | undefined,
    location: data.location as string | undefined,
    summary: data.summary as string | undefined,
    cover: coverFile ? publicImagePath(slug, coverFile) : '',
    images: imageFiles.map((f) => publicImagePath(slug, f)),
    order: typeof data.order === 'number' ? data.order : 999,
    body: content.trim(),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => fs.statSync(path.join(CONTENT_DIR, name)).isDirectory());
}
