// Tells a component whether it's running in the browser yet.
//
// Next.js prepares each page ahead of time on the server, where there's
// no saved progress and no "today". Parts that depend on those wait
// until this returns true.

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // in the browser
    () => false, // on the server
  );
}
