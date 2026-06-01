import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  year?: string | number;
  role?: string;
  /** `role` split on commas — the filterable tag list. */
  tags: string[];
  location?: string;
  description?: string;
  cover: string;
  images: ProjectImage[];
  order: number;
  body: string;
};

/** Parse a comma-separated role string into trimmed, non-empty tags. */
export function parseTags(role?: string): string[] {
  return (role || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

const CONTENT_DIR = path.join(process.cwd(), 'public', 'work');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

function isImage(file: string) {
  return IMAGE_EXT.has(path.extname(file).toLowerCase());
}

function publicImagePath(slug: string, filename: string) {
  return `/work/${slug}/${filename}`;
}

function filenameToAlt(filename: string, title: string) {
  const base = filename.replace(/\.[^.]+$/, '').replace(/^\d+[-_\s]*/, '').replace(/[-_]/g, ' ').trim();
  return base ? `${title} — ${base}` : title;
}

type RawImageEntry = string | { src?: unknown; alt?: unknown };

function normalizeImages(raw: RawImageEntry[] | undefined, files: string[], slug: string, title: string): ProjectImage[] {
  if (!raw || raw.length === 0) {
    return files.map((f) => ({ src: publicImagePath(slug, f), alt: filenameToAlt(f, title) }));
  }
  return raw.map((entry) => {
    if (typeof entry === 'string') {
      return { src: publicImagePath(slug, entry), alt: filenameToAlt(entry, title) };
    }
    const src = typeof entry.src === 'string' ? entry.src : '';
    const alt = typeof entry.alt === 'string' ? entry.alt : filenameToAlt(src, title);
    return { src: publicImagePath(slug, src), alt };
  });
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = fs.readdirSync(CONTENT_DIR).filter((name) => {
    const full = path.join(CONTENT_DIR, name);
    return fs.statSync(full).isDirectory();
  });

  return slugs
    .map((slug) => getProject(slug))
    .sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title)));
}

export function getProject(slug: string): Project {
  const dir = path.join(CONTENT_DIR, slug);
  const mdPath = path.join(dir, 'project.md');
  const raw = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : '';
  const parsed = raw ? matter(raw) : { data: {} as Record<string, unknown>, content: '' };
  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content;

  const files = fs.readdirSync(dir).filter(isImage).sort();
  const title = (data.title as string) || slug.replace(/-/g, ' ');

  const rawImages = Array.isArray(data.images) ? (data.images as RawImageEntry[]) : undefined;
  const images = normalizeImages(rawImages, files, slug, title);

  const explicitCover = typeof data.cover === 'string' ? data.cover : undefined;
  const cover = explicitCover
    ? publicImagePath(slug, explicitCover)
    : images[0]?.src || '';

  const role = data.role as string | undefined;

  return {
    slug,
    title,
    year: data.year as string | number | undefined,
    role,
    tags: parseTags(role),
    location: data.location as string | undefined,
    description: data.description as string | undefined,
    cover,
    images,
    order: typeof data.order === 'number' ? data.order : 999,
    body: content.trim(),
  };
}

/** Unique, alphabetically-sorted set of every role tag across all projects. */
export function getAllRoleTags(): string[] {
  const set = new Set<string>();
  for (const p of getAllProjects()) p.tags.forEach((t) => set.add(t));
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => fs.statSync(path.join(CONTENT_DIR, name)).isDirectory());
}
