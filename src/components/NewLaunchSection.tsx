"use client";

import Link from "next/link";
import NewLaunchCarousel from "./NewLaunchCarousel";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { NewLaunchProject } from "@/lib/types";

export default function NewLaunchSection({ projects }: { projects: NewLaunchProject[] }) {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
            {t.home.newLaunchBadge}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
            {t.home.newLaunchHeading}
          </h2>
          <p className="mt-2 text-sm text-ink/60">{t.home.newLaunchSubtitle}</p>
        </div>

        <NewLaunchCarousel projects={projects} />

        <div className="mt-10 text-center">
          <Link
            href="/new-launch"
            className="border border-gold-dark px-6 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
          >
            {t.home.newLaunchViewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
