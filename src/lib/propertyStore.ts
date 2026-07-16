"use client";

import { useEffect, useState } from "react";
import { properties as baseProperties } from "./properties";
import type { Property } from "./types";

const STORAGE_KEY = "paramee-property-overrides";
const NEW_PROPERTIES_KEY = "paramee-new-properties";
const DELETED_KEY = "paramee-deleted-properties";

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

function readNewProperties(): Property[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(NEW_PROPERTIES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeNewProperties(list: Property[]) {
  window.localStorage.setItem(NEW_PROPERTIES_KEY, JSON.stringify(list));
}

function readDeleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(DELETED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeDeleted(list: string[]) {
  window.localStorage.setItem(DELETED_KEY, JSON.stringify(list));
}

function slugify(name: string) {
  return `${name}-${Date.now()}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Browser-local fallback data store, used when Supabase isn't configured.
 * `updateProperty` patches seed properties; `addProperty` appends brand-new
 * ones created via the admin/owner "add property" forms.
 */
export function useProperties() {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [newProperties, setNewProperties] = useState<Property[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(readOverrides());
    setNewProperties(readNewProperties());
    setDeleted(readDeleted());
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

  function addProperty(input: Omit<Property, "slug">) {
    const property: Property = { ...input, slug: slugify(input.name) };
    setNewProperties((prev) => {
      const next = [property, ...prev];
      writeNewProperties(next);
      return next;
    });
    return property;
  }

  function deleteProperty(slug: string) {
    setNewProperties((prev) => {
      const next = prev.filter((p) => p.slug !== slug);
      writeNewProperties(next);
      return next;
    });
    setDeleted((prev) => {
      const next = prev.includes(slug) ? prev : [...prev, slug];
      writeDeleted(next);
      return next;
    });
  }

  const properties: Property[] = [
    ...newProperties,
    ...baseProperties.map((p) => ({ ...p, ...overrides[p.slug] })),
  ].filter((p) => !deleted.includes(p.slug));

  return { properties, overrides, updateProperty, addProperty, deleteProperty, ready };
}
