"use client";

import { useEffect, useState } from "react";
import { testimonials as baseTestimonials } from "./testimonials";
import type { Testimonial } from "./types";

const STORAGE_KEY = "paramee-testimonial-overrides";
const NEW_KEY = "paramee-new-testimonials";

type Overrides = Record<string, Partial<Testimonial>>;

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

function readNew(): Testimonial[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(NEW_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeNew(list: Testimonial[]) {
  window.localStorage.setItem(NEW_KEY, JSON.stringify(list));
}

/** Browser-local fallback store used when Supabase isn't configured. */
export function useTestimonials() {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [newOnes, setNewOnes] = useState<Testimonial[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(readOverrides());
    setNewOnes(readNew());
    setReady(true);
  }, []);

  function addTestimonial(input: Omit<Testimonial, "id">) {
    const testimonial: Testimonial = { ...input, id: crypto.randomUUID() };
    setNewOnes((prev) => {
      const next = [testimonial, ...prev];
      writeNew(next);
      return next;
    });
  }

  function updateTestimonial(id: string, patch: Partial<Testimonial>) {
    setOverrides((prev) => {
      const next: Overrides = { ...prev, [id]: { ...prev[id], ...patch } };
      writeOverrides(next);
      return next;
    });
  }

  function deleteTestimonial(id: string) {
    setNewOnes((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeNew(next);
      return next;
    });
    updateTestimonial(id, { isPublished: false });
  }

  const testimonials: Testimonial[] = [
    ...newOnes,
    ...baseTestimonials.map((t) => ({ ...t, ...overrides[t.id] })),
  ];

  return { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, ready };
}
