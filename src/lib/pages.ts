// Server-only readers for the editable static pages (About + Contact).
// Stored as JSON under /content so the admin can PUT them via the
// GitHub Contents API and the build picks them up on the next deploy.

import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export type AboutSection = {
  heading: string;
  body: string;
};

export type AboutEntry = {
  title: string;
  meta?: string;
  /** Free-form paragraphs separated by blank lines. */
  body?: string;
  sections?: AboutSection[];
};

export type AboutData = {
  intro: string;
  experienceTitle: string;
  experience: AboutEntry[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type ContactData = {
  /** Multi-paragraph bio (paragraphs separated by blank lines). */
  bio: string;
  email: string;
  location: string;
  /** Label shown next to the local clock (e.g. "Antwerp"). */
  city: string;
  /** IANA timezone for the local clock (e.g. "Europe/Brussels"). */
  timezone: string;
  socials: SocialLink[];
};

const ABOUT_DEFAULT: AboutData = {
  intro: '',
  experienceTitle: 'Experience',
  experience: [],
};

const CONTACT_DEFAULT: ContactData = {
  bio: '',
  email: '',
  location: '',
  city: '',
  timezone: 'UTC',
  socials: [],
};

function readJson<T>(filename: string, fallback: T): T {
  try {
    const file = path.join(CONTENT_DIR, filename);
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getAbout(): AboutData {
  const data = readJson<Partial<AboutData>>('about.json', ABOUT_DEFAULT);
  return {
    intro: data.intro ?? '',
    experienceTitle: data.experienceTitle ?? 'Experience',
    experience: Array.isArray(data.experience) ? data.experience : [],
  };
}

export function getContact(): ContactData {
  const data = readJson<Partial<ContactData>>('contact.json', CONTACT_DEFAULT);
  return {
    bio: data.bio ?? '',
    email: data.email ?? '',
    location: data.location ?? '',
    city: data.city ?? '',
    timezone: data.timezone ?? 'UTC',
    socials: Array.isArray(data.socials) ? data.socials : [],
  };
}
