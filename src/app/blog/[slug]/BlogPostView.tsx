"use client";

import Link from "next/link";
import { Calendar, Tag, User, Newspaper } from "lucide-react";
import { formatThaiDate } from "@/lib/format";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { BlogPost } from "@/lib/types";

export default function BlogPostView({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const { t, lang } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/blog" className="hover:text-gold-dark">
          {t.blog.breadcrumb}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{post.title}</span>
      </nav>

      <div className="flex h-56 items-center justify-center bg-gradient-to-br from-maroon via-maroon-light to-maroon-dark">
        <Newspaper className="h-14 w-14 text-gold-light" strokeWidth={1.5} />
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs text-ink/50">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" strokeWidth={1.75} /> {post.authorName}
        </span>
        <span className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" strokeWidth={1.75} /> {post.tag}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} /> {formatThaiDate(post.publishedAt, lang)}
        </span>
      </div>

      <h1 className="mt-3 font-heading text-3xl font-semibold text-maroon-dark">{post.title}</h1>
      <p className="mt-3 text-base leading-relaxed text-ink/70">{post.excerpt}</p>

      <div className="mt-6 space-y-4 border-t border-cream-dark pt-6 text-sm leading-relaxed text-ink/80">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-xl font-semibold text-maroon-dark">{t.blog.relatedHeading}</h2>
          <ul className="mt-4 space-y-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-sm font-medium text-gold-dark hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
