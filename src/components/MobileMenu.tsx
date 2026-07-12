'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFilterState } from '@/lib/filterStore';
import DotConstellation from './DotConstellation';

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

  // Project + about pages don't show the floating menu: there the
  // "home" action is a glass dot button instead (in the ImageZoom
  // cluster on project pages, standalone on about). /resto is a
  // standalone page with no site chrome at all.
  if (
    pathname.startsWith('/work/') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/resto')
  )
    return null;

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
            {/* Menu glyph — dot constellation, inherits theme colour. */}
            <DotConstellation size={40} className="spin-slow" />
          </button>

          {mounted && navLink(RIGHT_LINK, 'right', open ? 60 : 40)}
        </div>
      </div>
    </div>
  );
}
