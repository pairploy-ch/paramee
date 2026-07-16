"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Heart, ChevronDown } from "lucide-react";
import { useState } from "react";
import { TikTokIcon, LineIcon } from "./icons";
import { CONTACT_EMAIL, socialLinks } from "@/lib/social";
import { useTranslation } from "@/i18n/LanguageProvider";
import LogoutButton from "./LogoutButton";

const adminLinks = [
  { href: "/admin/leads", label: "Track Lead" },
  { href: "/admin/properties", label: "เพิ่มทรัพย์" },
  { href: "/admin/manage-properties", label: "จัดการทรัพย์ / เจ้าของ" },
  { href: "/admin/bookings", label: "นัดชม / จอง" },
  { href: "/admin/blog", label: "จัดการบทความ" },
  { href: "/admin/testimonials", label: "รีวิวลูกค้า" },
  { href: "/mortgage-calculator", label: "คำนวณสินเชื่อ" },
];

export default function Navbar({ role = null }: { role?: "admin" | "owner" | null }) {
  const [open, setOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useTranslation();
  const isAdmin = role === "admin";
  const isOwner = role === "owner";

  const baseLinks = [
    { href: "/", label: t.nav.home },
    { href: "/properties", label: t.nav.properties },
    { href: "/blog", label: t.nav.blog },
    { href: "/owner-portal", label: t.nav.ownerPortal, ownerOnly: true },
  ];
  const links = baseLinks.filter((l) => !l.ownerOnly || isOwner);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top utility bar */}
      <div className="hidden bg-maroon-dark text-cream/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} /> {CONTACT_EMAIL}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} /> 095-789-5692
            </span>
            <a
              href={socialLinks.tiktok.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-cream/70 transition-colors hover:text-gold-light"
            >
              <TikTokIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={socialLinks.line.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE"
              className="text-cream/70 transition-colors hover:text-gold-light"
            >
              <LineIcon className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setLang("th")}
                className={lang === "th" ? "text-gold-light" : "text-cream/50 hover:text-cream"}
              >
                TH
              </button>
              <span className="text-cream/30">|</span>
              <button
                onClick={() => setLang("en")}
                className={lang === "en" ? "text-gold-light" : "text-cream/50 hover:text-cream"}
              >
                EN
              </button>
            </div>
            <Link
              href={isAdmin ? "/admin/leads" : "/login"}
              className="bg-gold px-4 py-1.5 text-xs font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              {t.nav.forStaff}
            </Link>
            {isAdmin && (
              <LogoutButton className="border border-cream/30 px-4 py-1.5 text-xs font-medium text-cream/80 transition-colors hover:border-gold-light hover:text-gold-light" />
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-paramee-maroon.png"
              alt="Paramee"
              width={160}
              height={154}
              priority
              className="h-11 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-maroon ${
                  isActive(link.href) ? "text-maroon font-semibold" : "text-ink/70"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen((v) => !v)}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-maroon ${
                    pathname.startsWith("/admin") ? "text-maroon font-semibold" : "text-ink/70"
                  }`}
                >
                  เมนูแอดมิน
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                {adminMenuOpen && (
                  <>
                    <button
                      aria-label="ปิดเมนู"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setAdminMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-gold-light/40 bg-white py-1.5 shadow-lg">
                      {adminLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors hover:bg-cream-dark ${
                            isActive(link.href) ? "font-semibold text-maroon" : "text-ink/70"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/wishlist"
              aria-label={t.nav.wishlist}
              title={t.nav.wishlist}
              className={`transition-colors hover:text-maroon ${
                isActive("/wishlist") ? "text-maroon" : "text-ink/50"
              }`}
            >
              <Heart className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link
              href="/booking"
              className="bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
            >
              {t.nav.booking}
            </Link>
          </div>

          <button
            aria-label="เปิดเมนู"
            className="flex flex-col gap-1.5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="h-0.5 w-6 bg-maroon" />
            <span className="h-0.5 w-6 bg-maroon" />
            <span className="h-0.5 w-6 bg-maroon" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold-light/30 bg-cream px-5 py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cream-dark ${
                isActive(link.href) ? "text-maroon font-semibold" : "text-ink/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cream-dark ${
              isActive("/wishlist") ? "text-maroon font-semibold" : "text-ink/80"
            }`}
          >
            {t.nav.wishlist}
          </Link>
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-maroon px-3 py-2.5 text-center text-sm font-medium text-cream hover:bg-maroon-light"
          >
            {t.nav.booking}
          </Link>

          {isAdmin && (
            <>
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
                เมนูแอดมิน
              </p>
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-cream-dark ${
                    isActive(link.href) ? "text-maroon font-semibold" : "text-ink/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>
      )}
    </header>
  );
}
