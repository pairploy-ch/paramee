"use client";

import Link from "next/link";
import { X, Scale } from "lucide-react";
import { useCompare } from "./CompareProvider";
import type { NewLaunchProject } from "@/lib/types";

export default function CompareBar({ projects }: { projects: NewLaunchProject[] }) {
  const { slugs, remove, ready, clear } = useCompare();

  if (!ready || slugs.length === 0) return null;

  const selected = slugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is NewLaunchProject => Boolean(p));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-light/40 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-maroon-dark">
          <Scale className="h-4 w-4" strokeWidth={1.75} />
          เปรียบเทียบ ({selected.length}/3)
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          {selected.map((p) => (
            <span
              key={p.slug}
              className="flex items-center gap-1.5 rounded-full bg-cream-dark px-3 py-1.5 text-xs text-maroon-dark"
            >
              {p.name}
              <button
                type="button"
                aria-label="เอาออก"
                onClick={() => remove(p.slug)}
                className="text-ink/40 hover:text-red-500"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={clear} className="text-xs font-medium text-ink/50 hover:text-red-500">
            ล้างทั้งหมด
          </button>
          {selected.length < 2 ? (
            <span className="cursor-not-allowed bg-cream-dark px-5 py-2.5 text-sm font-medium text-ink/30">
              เปรียบเทียบ →
            </span>
          ) : (
            <Link
              href={`/new-launch/compare?slugs=${slugs.join(",")}`}
              className="bg-gold px-5 py-2.5 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              เปรียบเทียบ →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
