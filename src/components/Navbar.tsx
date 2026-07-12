"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/properties", label: "ทรัพย์ทั้งหมด" },
  { href: "/mortgage-calculator", label: "คำนวณสินเชื่อ" },
  { href: "/booking", label: "นัดชมทรัพย์" },
  { href: "/owner-portal", label: "Owner Portal" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} /> info@paramee.co.th
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" strokeWidth={1.75} /> 095-789-5692
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* <span className="text-cream/50">LINE · IG · WhatsApp เร็วๆ นี้</span> */}
            <Link
              href="/admin/leads"
              className="bg-gold px-4 py-1.5 text-xs font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              สำหรับทีมงาน
            </Link>
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
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/booking"
              className="bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
            >
              นัดชมทรัพย์
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
        </nav>
      )}
    </header>
  );
}
