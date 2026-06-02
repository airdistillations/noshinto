'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useFilterState } from '@/lib/filterStore';

const NAV_LINKS = [
  { href: '/', label: 'work' },
  { href: '/about/', label: 'about' },
  { href: '/contact/', label: 'contact' },
];

/**
 * Global mobile / iPad menu button.
 *
 * - Always visible on mobile (fixed top-left), regardless of page.
 * - Tap to open: reveals nav links horizontally to the right of the
 *   button.
 * - If a filter has been registered with the store (only on the home
 *   gallery), the role pills also appear stacked vertically below the
 *   button.
 *
 * Replaces the old mobile branch of ProjectFilterBar plus the mobile
 * header nav in Nav.tsx.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);
  const filter = useFilterState();

  return (
    <div
      className="lg:hidden fixed z-30 top-6 left-5 pointer-events-none"
      style={{ color: 'var(--color-white)' }}
    >
      <div className="pointer-events-auto">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Hide menu' : 'Open menu'}
            data-active={!!(filter && filter.active.length > 0)}
            className="filter-toggle w-[40px] h-[40px] rounded-full border border-current flex items-center justify-center shrink-0"
          >
            {/* Funnel glyph */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 5h18l-7 8v6l-4 2v-8L3 5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {open && (
            <nav
              aria-label="Primary"
              className="menu-chip text-16 flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              {NAV_LINKS.map((l, i) => {
                const linkActive = isActive(l.href);
                return (
                  <span key={l.href} className="inline-flex items-baseline gap-x-3">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`link-hover ${linkActive ? 'underline underline-offset-4' : ''}`}
                      aria-current={linkActive ? 'page' : undefined}
                    >
                      {l.label}
                    </Link>
                    {i < NAV_LINKS.length - 1 && (
                      <span aria-hidden className="opacity-60 select-none">&mdash;</span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}
        </div>

        {open && filter && filter.tags.length > 0 && (
          <div className="mt-3 flex flex-col items-start gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={filter.clear}
              data-active={filter.active.length === 0}
              className="tag-pill tag-pill--btn shrink-0"
            >
              All
            </button>
            {filter.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => filter.toggle(tag)}
                data-active={filter.active.includes(tag)}
                className="tag-pill tag-pill--btn shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
