"use client";

import Link from "next/link";
import { Quote, Newspaper, User, Tag, Calendar, ArrowRight } from "lucide-react";
import Carousel from "@/components/Carousel";
import { formatThaiDate } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Testimonial, BlogPost } from "@/lib/types";

export default function HomeClosingSection({
  testimonials,
  articles,
}: {
  testimonials: Testimonial[];
  articles: BlogPost[];
}) {
  const { t, lang } = useTranslation();

  return (
    <>
      {/* Banner strip */}
      <section className="bg-maroon py-14 text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="font-heading text-xl italic leading-relaxed text-gold-light sm:text-2xl">
            {t.home.bannerQuote}
          </p>
          <p className="mt-3 text-sm text-cream/60">{t.home.bannerAttribution}</p>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="relative bg-cream-dark/40 bg-cover bg-center py-20"
        style={{ backgroundImage: "url(/bg-paramee.jpg)" }}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              {t.home.testimonialsBadge}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
              {t.home.testimonialsHeading}
            </h2>
          </div>

          <div className="mt-10">
            <Carousel itemClassName="w-[90%] shrink-0 snap-start sm:w-[70%] lg:w-[calc(33.333%-16px)]">
              {testimonials.map((item) => (
                <div key={item.id} className="h-full bg-white p-7 shadow-sm">
                  <Quote className="h-7 w-7 text-gold-light" strokeWidth={1.5} fill="currentColor" />
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-cream-dark pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon font-heading text-sm font-semibold text-gold-light">
                      {item.name.replace("คุณ", "").charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-maroon-dark">{item.name}</p>
                      <p className="text-xs uppercase tracking-wide text-ink/45">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
            {t.home.articlesBadge}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
            {t.home.articlesHeading}
          </h2>
        </div>

        {articles.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            {t.home.articlesEmpty}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group overflow-hidden bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-maroon via-maroon-light to-maroon-dark">
                  <Newspaper className="h-10 w-10 text-gold-light" strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-ink/50">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" strokeWidth={1.75} /> {a.authorName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" strokeWidth={1.75} /> {a.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-maroon-dark group-hover:text-maroon">
                    {a.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between border-t border-cream-dark pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-ink/45">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} /> {formatThaiDate(a.publishedAt, lang)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                      {t.home.readMore} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA banner — overlaps into footer */}
      <section className="relative z-10 mx-auto -mb-16 max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 bg-gold px-8 py-10 text-center shadow-xl sm:flex-row sm:text-left">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-maroon-dark">
              {t.home.ctaHeading}
            </h2>
            <p className="mt-1 text-sm text-maroon-dark/70">{t.home.ctaSubtitle}</p>
          </div>
          <Link
            href="/properties"
            className="shrink-0 bg-maroon px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
          >
            {t.home.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
