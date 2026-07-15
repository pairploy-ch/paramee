"use client";

import Link from "next/link";
import FeaturedCarousel from "./FeaturedCarousel";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Property } from "@/lib/types";

export default function FeaturedSection({ properties }: { properties: Property[] }) {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
            {t.home.featuredBadge}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
            {t.home.featuredHeading}
          </h2>
          <p className="mt-2 text-sm text-ink/60">{t.home.featuredSubtitle}</p>
        </div>

        <FeaturedCarousel properties={properties} />

        <div className="mt-10 text-center">
          <Link
            href="/properties"
            className="border border-gold-dark px-6 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
          >
            {t.home.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
