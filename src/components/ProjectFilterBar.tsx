'use client';

/**
 * Homepage filter strip. Renders one clickable pill per role tag plus an
 * "All" reset. OR semantics: a project matches if it has any active tag.
 * Sits fixed under the nav; blend-difference keeps it legible over both
 * the solid desktop background and the mobile hero images.
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
  if (tags.length === 0) return null;

  return (
    <div className="fixed z-30 top-[68px] lg:top-[92px] left-0 right-0 px-5 lg:px-8 pointer-events-none">
      <div
        className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto no-scrollbar pointer-events-auto blend-difference"
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
    </div>
  );
}
