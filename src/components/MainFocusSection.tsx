"use client";

import Link from "next/link";
import { Home as HomeIcon, KeyRound, TrendingUp } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function MainFocusSection() {
  const { t } = useTranslation();

  const focusCards = [
    {
      icon: HomeIcon,
      title: t.home.buyTitle,
      description: t.home.buyDescription,
      href: "/properties?purpose=ซื้อ",
    },
    {
      icon: KeyRound,
      title: t.home.rentTitle,
      description: t.home.rentDescription,
      href: "/properties?purpose=เช่า",
    },
    {
      icon: TrendingUp,
      title: t.home.sellTitle,
      description: t.home.sellDescription,
      href: "/owner-portal",
    },
  ];

  return (
    <section className="bg-cream-dark/60 py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
            {t.home.focusHeadingBadge}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
            {t.home.focusHeading}
          </h2>
          <p className="mt-2 text-sm text-ink/60">{t.home.focusDescription}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {focusCards.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group relative overflow-hidden bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <span className="absolute inset-0 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gold-light/40" />
                <f.icon className="relative h-9 w-9 text-maroon" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-maroon-dark">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{f.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:text-maroon">
                ดูเพิ่มเติม →
              </span>
              <span className="absolute inset-x-0 bottom-0 h-1 bg-gold-light/60 transition-colors group-hover:bg-maroon" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
