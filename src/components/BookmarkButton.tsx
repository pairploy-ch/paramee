"use client";

import { Heart } from "lucide-react";
import { useBookmarks } from "@/lib/useBookmarks";

export default function BookmarkButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { isBookmarked, toggle, ready } = useBookmarks();
  const active = ready && isBookmarked(slug);

  return (
    <button
      type="button"
      aria-label={active ? "เอาออกจากรายการบันทึก" : "บันทึกทรัพย์นี้"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors ${
        active
          ? "bg-maroon text-gold-light"
          : "bg-white/80 text-ink/50 hover:text-maroon"
      } ${className}`}
    >
      <Heart className="h-4 w-4" strokeWidth={1.75} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
