"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, LayoutGrid, Clock, Calendar, ShieldCheck, BarChart } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function HomeIntroSection() {
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
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "9 / 16" }}>
            <Image
              src="/kprem.jpg"
              alt="เปรม ผู้ก่อตั้ง PARAMEE ASSET"
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              {t.home.aboutBadge}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-maroon-dark">
              {t.home.aboutHeadingLine1}
              {t.home.aboutHeadingLine2 && (
                <>
                  <br />
                  {t.home.aboutHeadingLine2}
                </>
              )}
            </h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/65">{t.home.aboutParagraph}</p>

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
