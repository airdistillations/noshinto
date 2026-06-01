'use client';

import { useState } from 'react';

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

      {/* Mobile / iPad: circular toggle + expandable pill stack. */}
      <div className="lg:hidden pointer-events-auto">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Hide filters' : 'Filter projects'}
          data-active={active.length > 0}
          className="filter-toggle w-[40px] h-[40px] rounded-full border border-current flex items-center justify-center"
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
          <div className="mt-3 flex flex-col items-start gap-2 max-h-[60vh] overflow-y-auto no-scrollbar">
            {pills}
          </div>
        )}
      </div>
    </div>
  );
}
