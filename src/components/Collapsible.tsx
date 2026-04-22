'use client';

import { useId, useState } from 'react';

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/**
 * Collapsible row with a smooth open/close animation. Uses the
 * grid-template-rows: 0fr → 1fr trick (the only way to transition
 * from 0 to auto height without measuring), wrapped in a real React
 * component so the content is always rendered — native <details>
 * slots non-summary children into a shadow slot that gets display:
 * none when closed, which kills the height transition.
 */
export default function Collapsible({ title, children, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`border-t border-current/15 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-baseline justify-between py-8 text-left text-16 opacity-60 link-hover"
      >
        <span>{title}</span>
        <span
          aria-hidden
          className="inline-block"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 280ms cubic-bezier(.22, 1, .36, 1)',
          }}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        inert={!open}
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 380ms cubic-bezier(.22, 1, .36, 1)',
        }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            style={{
              opacity: open ? 1 : 0,
              transition: open
                ? 'opacity 260ms 80ms cubic-bezier(.22, 1, .36, 1)'
                : 'opacity 180ms cubic-bezier(.22, 1, .36, 1)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
