"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "paramee-compare-projects-v2";
const MAX_COMPARE = 3;

function readCompareList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface CompareContextValue {
  slugs: string[];
  ready: boolean;
  maxCompare: number;
  isSelected: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

/**
 * Single shared source of truth for the compare-list selection, provided
 * once at the app root. Each <CompareToggleButton> used to call its own
 * useState-backed hook independently — every card's button looked correct
 * in isolation, but since they never shared state, toggling one button while
 * only one project existed in `slugs` could leave others reading a stale
 * snapshot until next remount, and any pattern that forced a shared remount
 * (e.g. Fast Refresh) made every button re-derive from the same array at
 * once. A single context avoids the whole class of bug.
 */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlugs(readCompareList());
    setReady(true);
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      let next: string[];
      if (prev.includes(slug)) {
        next = prev.filter((s) => s !== slug);
      } else if (prev.length >= MAX_COMPARE) {
        return prev;
      } else {
        next = [...prev, slug];
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.filter((s) => s !== slug);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setSlugs([]);
  }, []);

  const isSelected = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return (
    <CompareContext.Provider
      value={{ slugs, ready, maxCompare: MAX_COMPARE, isSelected, toggle, remove, clear }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
