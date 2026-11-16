'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// Returns true on the client after hydration, false during SSR — so persisted
// (localStorage) state never mismatches server-rendered markup.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
