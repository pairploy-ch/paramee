"use client";

import Link from "next/link";
import { useState } from "react";

const slides = [
  {
    heading: "ค้นหาบ้านในฝัน",
    highlight: "ที่ใช่สำหรับคุณ",
    description:
      "รวมทรัพย์คัดสรรกว่า 300–500 รายการทั่วกรุงเทพฯ พร้อมระบบนัดชม จองมัดจำออนไลน์ และคำนวณสินเชื่อ ครบในที่เดียว",
    cta: { label: "ค้นหาทรัพย์ทันที", href: "/properties" },
  },
  {
    heading: "ลงทุนอสังหาฯ อย่างมั่นใจ",
    highlight: "ด้วยข้อมูลที่ครบ",
    description:
      "ดู ROI, Rental Yield และ Cashflow ของทุกทรัพย์ตั้งแต่หน้ารายละเอียด ไม่ต้องคำนวณเอง",
    cta: { label: "ดูทรัพย์เพื่อการลงทุน", href: "/properties?purpose=เช่า" },
  },
  {
    heading: "ฝากขายหรือปล่อยเช่า",
    highlight: "ให้เราดูแลคุณ",
    description:
      "ติดตามยอดเข้าชม รายได้ค่าเช่า และสถานะทรัพย์แบบเรียลไทม์ผ่าน Owner Portal",
    cta: { label: "เข้าสู่ Owner Portal", href: "/owner-portal" },
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-5 py-24 text-center lg:px-8">
      <button
        aria-label="ก่อนหน้า"
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 text-cream/80 transition-colors hover:border-gold-light hover:text-gold-light sm:flex lg:left-8"
      >
        ←
      </button>
      <button
        aria-label="ถัดไป"
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 text-cream/80 transition-colors hover:border-gold-light hover:text-gold-light sm:flex lg:right-8"
      >
        →
      </button>

      <div className="flex max-w-2xl flex-col items-center gap-6">
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          {slide.heading}
          <span className="text-gold-light"> {slide.highlight}</span>
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-cream/75">{slide.description}</p>
        <Link
          href={slide.cta.href}
          className="bg-gold px-7 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
        >
          {slide.cta.label}
        </Link>

        <div className="mt-4 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.heading}
              aria-label={`สไลด์ที่ ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-gold-light" : "w-1.5 bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
