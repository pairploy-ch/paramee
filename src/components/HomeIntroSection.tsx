"use client";

import Link from "next/link";
import { Building2, MapPin, LayoutGrid, Clock, Calendar, ShieldCheck, BarChart, Play } from "lucide-react";
import PropertyImage from "@/components/PropertyImage";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Property } from "@/lib/types";

export default function HomeIntroSection({
  spotlight,
  spotlightThumb,
}: {
  spotlight?: Property;
  spotlightThumb?: Property;
}) {
  const { t } = useTranslation();

  const stats = [
    { icon: Building2, value: t.home.statsPropertiesValue, label: t.home.statsPropertiesLabel },
    { icon: MapPin, value: t.home.statsLocationsValue, label: t.home.statsLocationsLabel },
    { icon: LayoutGrid, value: t.home.statsTypesValue, label: t.home.statsTypesLabel },
    { icon: Clock, value: t.home.statsTimeValue, label: t.home.statsTimeLabel },
  ];

  const aboutChecklist = [
    { icon: MapPin, label: t.home.aboutChecklist1 },
    { icon: BarChart, label: t.home.aboutChecklist2 },
    { icon: Calendar, label: t.home.aboutChecklist3 },
    { icon: ShieldCheck, label: t.home.aboutChecklist4 },
  ];

  return (
    <>
      {/* Stats */}
      <section className="bg-cream-dark/60 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3 text-center">
              <s.icon className="h-9 w-9 text-maroon" strokeWidth={1.5} aria-hidden />
              <p className="font-heading text-xl font-semibold text-maroon-dark">{s.value}</p>
              <p className="text-xs text-ink/55">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative pb-16 pl-6 pt-6 sm:pb-24 sm:pl-10">
            {/* dotted decoration */}
            <div className="absolute left-0 top-0 grid grid-cols-8 gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-gold" />
              ))}
            </div>

            {spotlight && (
              <div className="rounded-2xl border border-gold-light/40 bg-white p-3 shadow-lg">
                <PropertyImage
                  images={spotlight.images}
                  name={spotlight.name}
                  className="h-80 w-full rounded-xl sm:h-96"
                />
              </div>
            )}

            {spotlightThumb && (
              <div className="absolute bottom-0 left-0 w-2/5 min-w-[160px] rounded-2xl border-4 border-cream bg-white p-1.5 shadow-xl">
                <div className="relative">
                  <PropertyImage
                    images={spotlightThumb.images}
                    name={spotlightThumb.name}
                    index={1}
                    className="h-28 w-full rounded-lg sm:h-36"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gold-dark shadow-md sm:h-12 sm:w-12">
                      <Play className="h-4 w-4 translate-x-0.5 fill-current" strokeWidth={0} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              {t.home.aboutBadge}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-maroon-dark">
              {t.home.aboutHeadingLine1}
              <br />
              {t.home.aboutHeadingLine2}
              <span className="text-gold">.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-ink/65">{t.home.aboutParagraph}</p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
              {aboutChecklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm text-ink/70">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-light/40">
                    <item.icon className="h-4.5 w-4.5 text-maroon" strokeWidth={1.75} />
                  </span>
                  {item.label}
                </div>
              ))}
            </div>

            <blockquote className="mt-6 rounded-xl border-0 bg-cream-dark/60 px-5 py-4 text-sm italic text-ink/65">
              {t.home.aboutQuote}
            </blockquote>

            <Link
              href="/properties"
              className="mt-6 inline-block bg-maroon px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
            >
              {t.home.aboutCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
