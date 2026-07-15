"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "paramee-bookmarks";

function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookmarks(readBookmarks());
    setReady(true);
  }, []);

  const toggle = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((slug: string) => bookmarks.includes(slug), [bookmarks]);

  return { bookmarks, isBookmarked, toggle, ready };
}
