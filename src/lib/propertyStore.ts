"use client";

import { useEffect, useState } from "react";
import { properties as baseProperties } from "./properties";
import type { Property } from "./types";

const STORAGE_KEY = "paramee-property-overrides";

export type PropertyOverride = Partial<Property> & { updatedAt?: string };
type Overrides = Record<string, PropertyOverride>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Overrides) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function useProperties() {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(readOverrides());
    setReady(true);
  }, []);

  function updateProperty(slug: string, patch: Partial<Property>) {
    setOverrides((prev) => {
      const next: Overrides = {
        ...prev,
        [slug]: { ...prev[slug], ...patch, updatedAt: new Date().toISOString() },
      };
      writeOverrides(next);
      return next;
    });
  }

  const properties: Property[] = baseProperties.map((p) => ({ ...p, ...overrides[p.slug] }));

  return { properties, overrides, updateProperty, ready };
}
