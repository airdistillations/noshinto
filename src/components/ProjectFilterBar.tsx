'use client';

import { useEffect } from 'react';
import { setFilterState } from '@/lib/filterStore';

/**
 * Desktop-only homepage filter strip. The mobile equivalent is the
 * global <MobileMenu />, which reads filter state from the module
 * store that this component pushes into via useEffect.
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
  // Register this filter API with the store so <MobileMenu /> can show
  // the pills below its nav links on the home page. Unregister on
  // unmount so navigating away from home clears the pills.
  useEffect(() => {
    setFilterState({ tags, active, toggle: onToggle, clear: onClear });
    return () => setFilterState(null);
  }, [tags, active, onToggle, onClear]);

  if (tags.length === 0) return null;

  return (
    <div
      className="hidden lg:flex fixed z-30 top-8 left-8 flex-wrap gap-2 max-w-[42ch] blend-difference pointer-events-auto"
      style={{ color: 'var(--color-white)' }}
    >
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
    </div>
  );
}
