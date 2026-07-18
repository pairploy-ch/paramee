"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import NewLaunchProjectCard from "@/components/NewLaunchProjectCard";
import { useBookmarks } from "@/lib/useBookmarks";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { NewLaunchProject, Property } from "@/lib/types";

export default function WishlistView({
  properties,
  newLaunchProjects,
}: {
  properties: Property[];
  newLaunchProjects: NewLaunchProject[];
}) {
  const { t } = useTranslation();
  const { bookmarks, ready } = useBookmarks();
  const savedProperties = properties.filter((p) => bookmarks.includes(p.slug));
  const savedProjects = newLaunchProjects.filter((p) => bookmarks.includes(p.slug));
  const isEmpty = savedProperties.length === 0 && savedProjects.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{t.wishlist.heading}</h1>
        <p className="mt-2 text-sm text-ink/60">{t.wishlist.description}</p>
      </div>

      {!ready ? null : isEmpty ? (
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
        <div className="space-y-12">
          {savedProperties.length > 0 && (
            <div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProperties.map((p) => (
                  <PropertyCard key={p.slug} property={p} />
                ))}
              </div>
            </div>
          )}

          {savedProjects.length > 0 && (
            <div>
              <h2 className="mb-4 font-heading text-xl font-semibold text-maroon-dark">โครงการมือ 1 ที่บันทึกไว้</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProjects.map((p) => (
                  <NewLaunchProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
