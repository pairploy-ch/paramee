"use client";

import { Scale } from "lucide-react";
import { useCompare } from "./CompareProvider";

export default function CompareToggleButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { isSelected, toggle, ready, slugs, maxCompare } = useCompare();
  const active = ready && isSelected(slug);
  const disabled = ready && !active && slugs.length >= maxCompare;

  return (
    <button
      type="button"
      aria-label={active ? "เอาออกจากรายการเปรียบเทียบ" : "เพิ่มในรายการเปรียบเทียบ"}
      aria-pressed={active}
      disabled={disabled}
      title={disabled ? `เปรียบเทียบได้สูงสุด ${maxCompare} โครงการ` : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors ${
        active
          ? "bg-maroon text-gold-light"
          : disabled
          ? "bg-white/60 text-ink/25 cursor-not-allowed"
          : "bg-white/80 text-ink/50 hover:text-maroon"
      } ${className}`}
    >
      <Scale className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
