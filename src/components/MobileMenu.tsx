'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFilterState } from '@/lib/filterStore';

const NAV_LINKS = [
  { href: '/', label: 'work' },
  { href: '/about/', label: 'about' },
  { href: '/contact/', label: 'contact' },
];

// Longest close-side animation + the largest staggered delay we use.
// Keeps the children rendered until the closing animation has finished.
const CLOSE_LIFETIME_MS = 800;

/**
 * Global mobile / iPad menu button. Tap reveals nav links (slide out of
 * the button) + filter pills (slide in from off-screen left). Tap again
 * to close: the same items slide back the way they came before unmounting.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  // Mounted lags behind `open` on close, so the exit animation can play.
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '/';
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);
  const filter = useFilterState();

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), CLOSE_LIFETIME_MS);
    return () => window.clearTimeout(t);
    // mounted intentionally excluded — we only want to schedule the
    // unmount when `open` flips to false.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const linkAnimClass = open ? 'menu-link-in' : 'menu-link-out';
  const pillAnimClass = open ? 'menu-pill-in' : 'menu-pill-out';

  return (
    <div
      className="lg:hidden fixed z-30 top-6 left-5 pointer-events-none"
      style={{ color: 'var(--color-white)' }}
    >
      <div className="pointer-events-auto">
        {/* Button + nav links keep blend-difference for auto-invert.
            The pill stack below sits OUTSIDE this wrapper so pills
            render in plain white on any background. */}
        <div className="flex items-center gap-4 blend-difference">
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

          {mounted && (
            <nav
              aria-label="Primary"
              className="text-[1.3rem] flex flex-wrap items-baseline gap-x-4 gap-y-1"
            >
              {NAV_LINKS.map((l, i) => {
                const linkActive = isActive(l.href);
                // Stagger forward on open, reverse on close — first to
                // appear is the last to leave, so the motion feels mirrored.
                const delay = open
                  ? i * 60
                  : (NAV_LINKS.length - 1 - i) * 50;
                return (
                  <span
                    key={l.href}
                    className={`${linkAnimClass} relative inline-flex items-baseline`}
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {linkActive && (
                      <span
                        aria-hidden
                        className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-current"
                      />
                    )}
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="link-hover"
                      aria-current={linkActive ? 'page' : undefined}
                    >
                      {l.label}
                    </Link>
                  </span>
                );
              })}
            </nav>
          )}
        </div>

        {mounted && filter && filter.tags.length > 0 && (
          <div className="mt-3 flex flex-col items-start gap-2">
            {(() => {
              const n = filter.tags.length;
              // "All" leads on open (0ms) and trails on close (after every tag).
              const allDelay = open ? 0 : n * 55;
              return (
                <>
                  <button
                    type="button"
                    onClick={filter.clear}
                    data-active={filter.active.length === 0}
                    className={`tag-pill tag-pill--btn ${pillAnimClass} shrink-0`}
                    style={{ animationDelay: `${allDelay}ms` }}
                  >
                    All
                  </button>
                  {filter.tags.map((tag, i) => {
                    const delay = open
                      ? (i + 1) * 55
                      : (n - 1 - i) * 55;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => filter.toggle(tag)}
                        data-active={filter.active.includes(tag)}
                        className={`tag-pill tag-pill--btn ${pillAnimClass} shrink-0`}
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
