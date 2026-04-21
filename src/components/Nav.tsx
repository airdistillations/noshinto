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

export default function Nav() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 10% scrim for legibility behind nav */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 h-32 z-10 bg-gradient-scrim" />

      <header
        className="fixed inset-x-0 top-0 z-20 px-5 py-6 lg:px-8 lg:py-8 blend-difference text-white"
        style={{ color: 'var(--color-white)' }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Comma-separated tagline-style nav */}
            <nav aria-label="Primary" className="text-16 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {links.map((l, i) => {
                const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
                return (
                  <span key={l.href} className="inline-flex items-baseline">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="link-hover"
                      style={{ opacity: active ? 0.4 : 1 }}
                      aria-current={active ? 'page' : undefined}
                    >
                      {/* Random letter highlight per link to evoke the marker look */}
                      {l.label === 'work' && (<><span>w</span><span className="mark">or</span><span>k</span></>)}
                      {l.label === 'about' && (<><span>a</span><span className="mark">bo</span><span>ut</span></>)}
                      {l.label === 'contact' && (<><span>con</span><span className="mark">ta</span><span>ct</span></>)}
                    </Link>
                    {i < links.length - 1 && <span aria-hidden>,</span>}
                  </span>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Logo / theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Left-column author signature — visible on desktop only, vertical-centered watermark feel */}
      <div
        aria-hidden
        className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-10 pl-8 text-16 blend-difference"
        style={{ color: 'var(--color-white)' }}
      >
        <span className="tracking-tight">Noshinto</span>
      </div>
    </>
  );
}
