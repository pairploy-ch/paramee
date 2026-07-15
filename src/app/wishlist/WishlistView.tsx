"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useBookmarks } from "@/lib/useBookmarks";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Property } from "@/lib/types";

export default function WishlistView({ properties }: { properties: Property[] }) {
  const { t } = useTranslation();
  const { bookmarks, ready } = useBookmarks();
  const saved = properties.filter((p) => bookmarks.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{t.wishlist.heading}</h1>
        <p className="mt-2 text-sm text-ink/60">{t.wishlist.description}</p>
      </div>

      {!ready ? null : saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-ink/20" strokeWidth={1.5} />
          <p className="mt-4 text-ink/50">{t.wishlist.empty}</p>
          <Link
            href="/properties"
            className="mt-5 inline-block bg-gold px-6 py-3 text-sm font-medium text-maroon-dark hover:bg-gold-light"
          >
            {t.wishlist.browseCta}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
