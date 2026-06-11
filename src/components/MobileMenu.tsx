'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFilterState } from '@/lib/filterStore';

// About and contact are merged into a single page, so the bottom
// nav is just the two destinations flanking the menu button.
const LEFT_LINK = { href: '/', label: 'work' };
const RIGHT_LINK = { href: '/about/', label: 'about' };

// Longest close-side animation + the largest staggered delay we use.
// Keeps the children rendered until the closing animation has finished.
const CLOSE_LIFETIME_MS = 800;

/**
 * Global mobile / iPad menu. The dot-constellation button sits fixed at
 * the bottom-centre of the viewport. Tapping it raises the filter pills
 * (home page only — picked up from the filter store) in centred rows
 * above the button, and reveals WORK / ABOUT on either side of it.
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

  const riseClass = open ? 'menu-rise-in' : 'menu-rise-out';

  // side: which side of the centred button the link hangs off. Links are
  // absolutely positioned so mounting/unmounting them never shifts the
  // button itself. Vertical centring is done with flex (inset-y-0 +
  // items-center) rather than a translate, because the rise animation
  // animates `transform` and would overwrite a -translate-y-1/2.
  const navLink = (
    link: { href: string; label: string },
    side: 'left' | 'right',
    delay: number,
  ) => (
    <span
      className={`absolute inset-y-0 flex items-center whitespace-nowrap ${
        side === 'left' ? 'right-[calc(50%+48px)]' : 'left-[calc(50%+48px)]'
      }`}
    >
      <span
        className={`${riseClass} relative inline-flex items-center`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {isActive(link.href) && (
          <span
            aria-hidden
            className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-current"
          />
        )}
        <Link
          href={link.href}
          onClick={() => setOpen(false)}
          className="link-hover uppercase tracking-[0.18em] text-[1.3rem]"
          aria-current={isActive(link.href) ? 'page' : undefined}
        >
          {link.label}
        </Link>
      </span>
    </span>
  );

  return (
    <div
      className="lg:hidden fixed z-30 bottom-[89px] inset-x-0 pointer-events-none"
      style={{ color: 'var(--color-text)' }}
    >
      <div className="pointer-events-auto flex flex-col items-center gap-6 px-5">
        {/* Filter pills (home only): centred wrapped rows above the button. */}
        {mounted && filter && filter.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 max-w-[480px]">
            {(() => {
              const n = filter.tags.length;
              // "All" leads on open (0ms) and trails on close.
              const allDelay = open ? 0 : n * 45;
              return (
                <>
                  <button
                    type="button"
                    onClick={filter.clear}
                    data-active={filter.active.length === 0}
                    className={`tag-pill tag-pill--btn ${riseClass} shrink-0`}
                    style={{ animationDelay: `${allDelay}ms` }}
                  >
                    All
                  </button>
                  {filter.tags.map((tag, i) => {
                    const delay = open ? (i + 1) * 45 : (n - 1 - i) * 45;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => filter.toggle(tag)}
                        data-active={filter.active.includes(tag)}
                        className={`tag-pill tag-pill--btn ${riseClass} shrink-0`}
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

        {/* Bottom row: WORK — button — ABOUT. The button is the only
            in-flow child (always dead-centre); the links hang off it
            absolutely so opening/closing never nudges the button. */}
        <div className="relative flex items-center justify-center">
          {mounted && navLink(LEFT_LINK, 'left', open ? 60 : 40)}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Hide menu' : 'Open menu'}
            data-active={!!(filter && filter.active.length > 0)}
            className="filter-toggle w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
          >
            {/* Menu glyph — dot constellation, inherits theme colour.
                Slow infinite spin via .spin-slow keeps it gently rotating. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 240.9 240.9"
              fill="currentColor"
              width="40"
              height="40"
              aria-hidden
              className="spin-slow"
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

          {mounted && navLink(RIGHT_LINK, 'right', open ? 60 : 40)}
        </div>
      </div>
    </div>
  );
}
