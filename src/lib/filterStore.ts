'use client';

// Tiny module-level store so the global MobileMenu can pick up the
// homepage's filter state without lifting it through React context
// across the server/client boundary in the layout.

import { useSyncExternalStore } from 'react';

export type FilterAPI = {
  tags: string[];
  active: string[];
  toggle: (tag: string) => void;
  clear: () => void;
};

let state: FilterAPI | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setFilterState(next: FilterAPI | null) {
  state = next;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): FilterAPI | null {
  return state;
}

// SSR snapshot: there's no filter on the server.
function getServerSnapshot(): FilterAPI | null {
  return null;
}

export function useFilterState(): FilterAPI | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
