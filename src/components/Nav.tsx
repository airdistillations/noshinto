'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

// Desktop side-stack on non-project pages: Noshinto IS the work link,
// so we don't repeat it. Contact is merged into the About page, so a
// single "about" entry covers both.
const sideLinks = [
  { href: '/about/', label: 'about' },
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
        {/* Header is just the rotating logo on every viewport now.
            Desktop nav for non-project pages lives in the side-stack
            under the Noshinto watermark; project pages get their own
            nav stack rendered inside the project layout itself.
            Mobile nav lives in the global <MobileMenu />. */}
        <div className="flex items-center justify-end gap-4 lg:gap-5">
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Desktop side stack — WORK (home) with ABOUT beneath. Hidden on
          project pages where the project info aside takes this slot.
          The dot before the active link replaces the underline state. */}
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
              className="link-hover uppercase tracking-[0.18em]"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              work
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
                  className="link-hover uppercase tracking-[0.18em]"
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
