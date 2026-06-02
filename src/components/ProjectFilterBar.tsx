'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'work' },
  { href: '/about/', label: 'about' },
  { href: '/contact/', label: 'contact' },
];

/**
 * Homepage filter strip. OR semantics: a project matches if it has any
 * active tag.
 *
 * Desktop: an inline wrapping row of pills, parked top-left (where the nav
 * used to be).
 * Mobile / iPad: the pills are packed behind a circular button the same
 * size as the rotating logo; tapping it reveals all the pills.
 */
export default function ProjectFilterBar({
  tags,
  active,
  onToggle,
  onClear,
}: {
  tags: string[];
  active: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);
  if (tags.length === 0) return null;

  const pills = (
    <>
      <button
        type="button"
        onClick={onClear}
        data-active={active.length === 0}
        className="tag-pill tag-pill--btn shrink-0"
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onToggle(tag)}
          data-active={active.includes(tag)}
          className="tag-pill tag-pill--btn shrink-0"
        >
          {tag}
        </button>
      ))}
    </>
  );

  return (
    <div
      className="fixed z-30 top-6 left-5 lg:top-8 lg:left-8 pointer-events-none blend-difference"
      style={{ color: 'var(--color-white)' }}
    >
      {/* Desktop / large: inline wrapping pill row. */}
      <div className="hidden lg:flex flex-wrap gap-2 max-w-[42ch] pointer-events-auto">
        {pills}
      </div>

      {/* Mobile / iPad: circular toggle + expandable pill stack. When
          open, the three nav links (work / about / contact) also appear
          horizontally to the right of the button. */}
      <div className="lg:hidden pointer-events-auto">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Hide menu' : 'Open menu'}
            data-active={active.length > 0}
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
            <nav aria-label="Primary" className="text-16 flex flex-wrap items-baseline gap-x-3 gap-y-1">
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

        {open && (
          <div className="mt-3 flex flex-col items-start gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            {pills}
          </div>
        )}
      </div>
    </div>
  );
}
