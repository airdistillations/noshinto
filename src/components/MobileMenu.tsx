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
      style={{ color: 'var(--color-text)' }}
    >
      <div className="pointer-events-auto">
        {/* Theme-driven colour: white in dark mode, charcoal in light
            mode. blend-difference removed so the literal colour shows
            instead of an inverted derivative. */}
        <div className="flex items-center gap-14">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Hide menu' : 'Open menu'}
            data-active={!!(filter && filter.active.length > 0)}
            className="filter-toggle w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
          >
            {/* Menu glyph — dot constellation, inherits theme colour. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240.9 240.9"
              fill="currentColor"
              width="40"
              height="40"
              aria-hidden
            >
              <circle cx="119.9" cy="120.5" r="16" />
              <circle cx="162.1" cy="120.5" r="13.4" />
              <circle cx="199.1" cy="120.5" r="10.9" />
              <circle cx="193.3" cy="90.6" r="10.9" />
              <circle cx="150.1" cy="47.2" r="10.9" />
              <circle cx="89.1" cy="47.5" r="10.9" />
              <circle cx="46.7" cy="90.3" r="10.9" />
              <circle cx="47.3" cy="152.1" r="10.9" />
              <circle cx="89.6" cy="193.6" r="10.9" />
              <circle cx="150.8" cy="193.4" r="10.9" />
              <circle cx="192.9" cy="151.4" r="10.9" />
              <circle cx="230.1" cy="120.5" r="7.4" />
              <circle cx="149.8" cy="90.7" r="13.4" />
              <circle cx="175.9" cy="64.5" r="10.9" />
              <circle cx="197.9" cy="42.6" r="7.4" />
              <circle cx="162.3" cy="18.7" r="7.4" />
              <circle cx="76.3" cy="19.3" r="7.4" />
              <circle cx="18.4" cy="77.6" r="7.4" />
              <circle cx="18" cy="162.3" r="7.4" />
              <circle cx="76.9" cy="221.9" r="7.4" />
              <circle cx="161" cy="222.7" r="7.4" />
              <circle cx="220.9" cy="164.6" r="7.4" />
              <circle cx="222" cy="79" r="7.4" />
              <circle cx="119.9" cy="78.3" r="13.4" />
              <circle cx="119.9" cy="41.3" r="10.9" />
              <circle cx="119.9" cy="10.3" r="7.4" />
              <circle cx="90.1" cy="90.7" r="13.4" />
              <circle cx="63.9" cy="64.5" r="10.9" />
              <circle cx="42" cy="42.6" r="7.4" />
              <circle cx="77.8" cy="120.5" r="13.4" />
              <circle cx="40.7" cy="120.5" r="10.9" />
              <circle cx="9.7" cy="120.5" r="7.4" />
              <circle cx="90.1" cy="150.3" r="13.4" />
              <circle cx="63.9" cy="176.5" r="10.9" />
              <circle cx="42" cy="198.4" r="7.4" />
              <circle cx="119.9" cy="162.6" r="13.4" />
              <circle cx="119.9" cy="199.7" r="10.9" />
              <circle cx="119.9" cy="230.7" r="7.4" />
              <circle cx="149.8" cy="150.3" r="13.4" />
              <circle cx="175.9" cy="176.5" r="10.9" />
              <circle cx="197.9" cy="198.4" r="7.4" />
            </svg>
          </button>

          {mounted && (
            <nav
              aria-label="Primary"
              className="text-[1.3rem] flex flex-wrap items-baseline gap-x-12 gap-y-1"
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
