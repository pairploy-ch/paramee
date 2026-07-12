"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./icons";

const socials = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "LINE", icon: MessageCircle },
];

export default function Footer() {
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
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร คัดสรรคอนโด บ้าน ทาวน์โฮม
            และที่ดินคุณภาพทั่วกรุงเทพฯ และปริมณฑล
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-cream/70">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              กรุงเทพมหานคร ประเทศไทย
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              095-789-5692
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />
              info@paramee.co.th
            </li>
          </ul>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <span
                key={s.label}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold-light hover:text-gold-light"
              >
                <s.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            เมนู
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/properties" className="hover:text-gold-light">ทรัพย์ทั้งหมด</Link></li>
            <li><Link href="/mortgage-calculator" className="hover:text-gold-light">คำนวณสินเชื่อ</Link></li>
            <li><Link href="/booking" className="hover:text-gold-light">นัดชมทรัพย์</Link></li>
            <li><Link href="/owner-portal" className="hover:text-gold-light">Owner Portal</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            สำหรับทีมงาน
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/admin/leads" className="hover:text-gold-light">Admin: Track Lead</Link></li>
          </ul>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gold-light">
            บริษัท
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li>Paramee Co., Ltd.</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-light">
            รับข่าวสารทรัพย์ใหม่
          </p>
          <p className="mt-4 text-sm text-cream/60">
            สมัครรับข้อมูลทรัพย์และโปรโมชันใหม่ๆ ทางอีเมล
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex overflow-hidden border border-cream/20 bg-cream/5"
          >
            <input
              type="email"
              required
              placeholder="อีเมลของคุณ"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 outline-none"
            />
            <button
              type="submit"
              aria-label="สมัครรับข่าวสาร"
              className="flex items-center justify-center bg-gold px-4 text-maroon-dark transition-colors hover:bg-gold-light"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Paramee Co., Ltd. สงวนลิขสิทธิ์</span>
          <div className="flex gap-5">
            <span>เงื่อนไขการใช้บริการ</span>
            <span>นโยบายความเป็นส่วนตัว</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
