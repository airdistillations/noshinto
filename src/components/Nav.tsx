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

  function onSignatureClick(e: React.MouseEvent) {
    // "Noshinto" links to About, but if we're already on About, scroll to top instead.
    if (pathname.startsWith('/about')) {
      e.preventDefault();
      scrollEverythingToTop();
    }
  }

  return (
    <>
      {/* Frosted glass scrim behind nav */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-32 z-10 bg-gradient-scrim" />

      <header
        className="fixed inset-x-0 top-0 z-20 px-5 py-6 lg:px-8 lg:py-8 blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <nav aria-label="Primary" className="text-16 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <span key={l.href} className="inline-flex items-baseline gap-x-3">
                    <Link
                      href={l.href}
                      onClick={(e) => onNavClick(e, l.href)}
                      className="link-hover"
                      style={{ opacity: active ? 0.4 : 1 }}
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
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Left-column "Noshinto" watermark — now a link to About */}
      <Link
        href="/about/"
        onClick={onSignatureClick}
        className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-10 pl-8 text-16 blend-difference link-hover"
        style={{ color: 'var(--color-white)' }}
        aria-label="About"
      >
        <span className="tracking-tight">Noshinto</span>
      </Link>

    </>
  );
}
