// A small helper for keeping data in the browser's own storage
// (localStorage) and letting components know when it changes.
//
// Progress and preferences both use it, so the tricky parts live in
// one place. Only use it from components that start with "use client",
// since it needs the browser.

import { useSyncExternalStore } from "react";

export function createLocalStore<T>(
  key: string, // the name the data is stored under
  empty: T, // what to use when nothing is saved yet
  // Checks saved data and returns it in the right shape, or null if
  // it's unusable (old or damaged), in which case we start fresh.
  normalize: (data: unknown) => T | null,
) {
  // The data currently in memory. Loaded the first time it's needed,
  // then kept here so every component sees the same data.
  let current: T | null = null;
  const listeners = new Set<() => void>();

  function load(): T {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return normalize(JSON.parse(raw)) ?? empty;
    } catch {
      // Storage can be blocked (some private browsing modes). Start fresh.
    }
    return empty;
  }

  function get(): T {
    if (current === null) current = load();
    return current;
  }

  function set(next: T) {
    current = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // If saving fails, the data still works until the page is closed.
    }
    listeners.forEach((listener) => listener());
  }

  // Called by React to get updates. Also listens for changes made in
  // another tab, so two open tabs stay in sync.
  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        current = load();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  // Use in a component to read the data. The component updates
  // automatically when it changes. While the page is being prepared
  // on the server there's no browser storage, so it starts empty.
  function useValue(): T {
    return useSyncExternalStore(subscribe, get, () => empty);
  }

  return { get, set, useValue };
}
