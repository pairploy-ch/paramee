"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, LineIcon, TikTokIcon } from "./icons";
import { CONTACT_EMAIL, CONTACT_PHONE, socialLinks } from "@/lib/social";
import { useTranslation } from "@/i18n/LanguageProvider";

const socials = [
  { label: "Facebook", handle: socialLinks.facebook.handle, href: socialLinks.facebook.href, icon: FacebookIcon },
  { label: "Instagram", handle: socialLinks.instagram.handle, href: socialLinks.instagram.href, icon: InstagramIcon },
  { label: "LINE", handle: socialLinks.line.handle, href: socialLinks.line.href, icon: LineIcon },
  { label: "TikTok", handle: socialLinks.tiktok.handle, href: socialLinks.tiktok.href, icon: TikTokIcon },
];

export default function Footer({ isAdmin = false }: { isAdmin?: boolean }) {
  const { t } = useTranslation();
  return (
    <footer className="bg-maroon-dark text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-28 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Image
            src="/logo-paramee-gold.png"
            alt="Paramee"
            width={140}
            height={135}
            className="h-10 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-cream/60">{t.footer.tagline}</p>
          <ul className="mt-5 space-y-2.5 text-sm text-cream/70">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              กรุงเทพมหานคร ประเทศไทย
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              {CONTACT_PHONE}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              {CONTACT_EMAIL}
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={`${s.label} ${s.handle}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold-light hover:text-gold-light"
              >
                <s.icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <ul className="mt-3 space-y-1 text-xs text-cream/50">
            {socials.map((s) => (
              <li key={s.label}>
                {s.label}: {s.handle}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t.footer.menu}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/properties" className="hover:text-gold-light">{t.nav.properties}</Link></li>
            {isAdmin && (
              <li><Link href="/mortgage-calculator" className="hover:text-gold-light">{t.nav.mortgageCalculator}</Link></li>
            )}
            <li><Link href="/blog" className="hover:text-gold-light">{t.nav.blog}</Link></li>
            <li><Link href="/booking" className="hover:text-gold-light">{t.nav.booking}</Link></li>
            <li><Link href="/wishlist" className="hover:text-gold-light">{t.nav.wishlist}</Link></li>
            <li><Link href="/owner-portal" className="hover:text-gold-light">{t.nav.ownerPortal}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t.footer.forStaffHeading}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href={isAdmin ? "/admin/leads" : "/login"} className="hover:text-gold-light">
                Admin: Track Lead
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t.footer.company}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li>Paramee Asset</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            {t.footer.newsletterHeading}
          </p>
          <p className="mt-4 text-sm text-cream/60">{t.footer.newsletterBody}</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex overflow-hidden border border-cream/20 bg-cream/5"
          >
            <input
              type="email"
              required
              placeholder={t.footer.newsletterPlaceholder}
              className="w-full bg-transparent px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 outline-none"
            />
            <button
              type="submit"
              aria-label={t.footer.newsletterHeading}
              className="flex items-center justify-center bg-gold px-4 text-maroon-dark transition-colors hover:bg-gold-light"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Paramee Asset. {t.footer.rightsReserved}</span>
          <div className="flex gap-5">
            <span>{t.footer.terms}</span>
            <span>{t.footer.privacy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
