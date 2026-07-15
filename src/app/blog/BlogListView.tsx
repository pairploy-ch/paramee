"use client";

import Link from "next/link";
import { Calendar, Tag, User, Newspaper, ArrowRight } from "lucide-react";
import { formatThaiDate } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { BlogPost } from "@/lib/types";

export default function BlogListView({ posts }: { posts: BlogPost[] }) {
  const { t, lang } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{t.blog.listTitle}</h1>
        <p className="mt-2 text-sm text-ink/60">{t.blog.listSubtitle}</p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          {t.blog.empty}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-maroon via-maroon-light to-maroon-dark">
                <Newspaper className="h-10 w-10 text-gold-light" strokeWidth={1.5} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-ink/50">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" strokeWidth={1.75} /> {p.authorName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" strokeWidth={1.75} /> {p.tag}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-base font-semibold leading-snug text-maroon-dark group-hover:text-maroon">
                  {p.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-cream-dark pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-ink/45">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} /> {formatThaiDate(p.publishedAt, lang)}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {t.blog.readMore} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
