'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/', label: 'work' },
  { href: '/about/', label: 'about' },
  { href: '/contact/', label: 'contact' },
];

// Desktop side-stack on non-project pages: Noshinto IS the work link,
// so we don't repeat it; about + contact sit beneath.
const sideLinks = [
  { href: '/about/', label: 'about' },
  { href: '/contact/', label: 'contact' },
];

function scrollEverythingToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll<HTMLElement>('[data-scroll-root], .snap-y').forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } catch {
    window.scrollTo(0, 0);
  }
}

export default function Nav() {
  const pathname = usePathname() || '/';
  const [, setOpen] = useState(false);

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  function onNavClick(e: React.MouseEvent, href: string) {
    setOpen(false);
    // If already on this route, prevent the navigation and scroll to top.
    if (isActive(href)) {
      e.preventDefault();
      scrollEverythingToTop();
    }
  }

  return (
    <>
      {/* Frosted glass scrim behind nav */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-48 lg:h-56 z-10 bg-gradient-scrim" />
      {/* Mirrored scrim behind the bottom zoom cluster */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 h-48 lg:h-56 z-10 bg-gradient-scrim-bottom" />

      <header
        className="fixed inset-x-0 top-0 z-20 px-5 py-6 lg:px-8 lg:py-8 blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        {/* Header keeps only the rotating logo at the right on every
            viewport. Mobile nav lives in the global <MobileMenu />.
            Project pages on desktop still get a header nav (work / about
            / contact) because the watermark slot is taken by the project
            info aside, so the side-stack isn't rendered. */}
        <div className="flex items-center justify-end gap-4 lg:gap-5">
          {pathname.startsWith('/work/') && (
            <nav
              aria-label="Primary"
              className="hidden lg:flex text-[1.3rem] flex-wrap items-baseline justify-end gap-x-3 gap-y-1"
            >
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <span key={l.href} className="inline-flex items-baseline gap-x-3 relative">
                    {active && <ActiveDot />}
                    <Link
                      href={l.href}
                      onClick={(e) => onNavClick(e, l.href)}
                      className="link-hover"
                      aria-current={active ? 'page' : undefined}
                    >
                      {l.label}
                    </Link>
                    {i < links.length - 1 && (
                      <span aria-hidden className="opacity-60 select-none">&mdash;</span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Desktop side stack — "Noshinto" (work/home) with about + contact
          beneath. Hidden on project pages where the project info aside
          takes this slot; those pages keep the header nav above. The
          dot before the active link replaces the underline state. */}
      {!pathname.startsWith('/work/') && (
        <nav
          aria-label="Primary"
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-10 pl-8 flex-col gap-2 text-[1.3rem] blend-difference"
          style={{ color: 'var(--color-white)' }}
        >
          <span className="relative inline-flex items-baseline">
            {isActive('/') && <ActiveDot />}
            <Link
              href="/"
              onClick={(e) => onNavClick(e, '/')}
              className="link-hover tracking-tight"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Noshinto
            </Link>
          </span>
          {sideLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <span key={l.href} className="relative inline-flex items-baseline">
                {active && <ActiveDot />}
                <Link
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  className="link-hover"
                  aria-current={active ? 'page' : undefined}
                >
                  {l.label}
                </Link>
              </span>
            );
          })}
        </nav>
      )}

    </>
  );
}

/** Small dot rendered to the left of the active nav link. */
function ActiveDot() {
  return (
    <span
      aria-hidden
      className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-current"
    />
  );
}
