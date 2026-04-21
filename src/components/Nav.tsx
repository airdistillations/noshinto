'use client';

import Link from 'next/link';
import { useState } from 'react';
import { asset } from '@/lib/asset';

const links = [
  { href: '/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="inline-block h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden border border-line bg-white">
            {/* Replace /public/logo.svg with your circular logo */}
            <img src={asset('/logo.svg')} alt="Logo" className="h-full w-full object-cover" />
          </span>
          <span className="font-serif italic text-lg md:text-xl tracking-tight">noshinto</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="tracking-wide-xl uppercase text-xs hover:opacity-60 transition-opacity">
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 -mr-2"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block w-5 h-3">
            <span className={`absolute left-0 right-0 top-0 h-px bg-ink transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute left-0 right-0 bottom-0 h-px bg-ink transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line">
          <nav className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="tracking-wide-xl uppercase text-sm"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
