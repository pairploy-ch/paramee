import Link from "next/link";
import {
  Building2,
  MapPin,
  LayoutGrid,
  Clock,
  Home as HomeIcon,
  KeyRound,
  TrendingUp,
  Calendar,
  ShieldCheck,
  BarChart,
  Play,
  Newspaper,
  Quote,
  User,
  Tag,
  ArrowRight,
} from "lucide-react";
import { properties } from "@/lib/properties";
import PropertyImage from "@/components/PropertyImage";
import SearchWidget from "@/components/SearchWidget";
import HeroBackground from "@/components/HeroBackground";
import HeroSlider from "@/components/HeroSlider";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Carousel from "@/components/Carousel";

const stats = [
  { icon: Building2, value: "300–500+", label: "ทรัพย์ในระบบ" },
  { icon: MapPin, value: "20+", label: "ทำเลทั่วกรุงเทพฯ" },
  { icon: LayoutGrid, value: "4", label: "ประเภททรัพย์" },
  { icon: Clock, value: "< 24 ชม.", label: "เวลาเฉลี่ยยืนยันนัด" },
];

const focusCards = [
  {
    icon: HomeIcon,
    title: "ซื้อบ้าน",
    description: "ค้นหาบ้าน คอนโด และที่ดินกว่า 300–500 รายการ พร้อมข้อมูลเปรียบเทียบราคาตลาด",
    href: "/properties?purpose=ซื้อ",
  },
  {
    icon: KeyRound,
    title: "เช่าทรัพย์",
    description: "เลือกทรัพย์ให้เช่าทำเลดี พร้อมคำนวณค่าเช่าเฉลี่ยในพื้นที่ก่อนตัดสินใจ",
    href: "/properties?purpose=เช่า",
  },
  {
    icon: TrendingUp,
    title: "ฝากขาย / ลงทุน",
    description: "ให้ทีม Paramee ช่วยวิเคราะห์ราคาแนะนำ Rental Yield และดูแลทรัพย์ของคุณผ่าน Owner Portal",
    href: "/owner-portal",
  },
];

const aboutChecklist = [
  { icon: MapPin, label: "ทำเลคัดสรร" },
  { icon: BarChart, label: "ข้อมูลโปร่งใส" },
  { icon: Calendar, label: "นัดชมออนไลน์" },
  { icon: ShieldCheck, label: "ปลอดภัยทุกขั้นตอน" },
];

const testimonials = [
  {
    name: "คุณนภัส",
    role: "ลูกค้าซื้อคอนโด ทองหล่อ",
    quote:
      "ระบบค้นหาใช้งานง่าย ข้อมูล ROI และระยะ BTS ครบ ช่วยให้ตัดสินใจได้เร็วขึ้นมาก นัดชมก็สะดวก ยืนยันไว",
  },
  {
    name: "คุณธีรภัทร",
    role: "นักลงทุนอสังหาฯ",
    quote:
      "ชอบตรงมีข้อมูล Rental Yield และ Cashflow ให้ดูตั้งแต่หน้ารายละเอียดทรัพย์ ไม่ต้องคำนวณเอง ประหยัดเวลามาก",
  },
  {
    name: "คุณอัญชิสา",
    role: "เจ้าของทรัพย์ปล่อยเช่า",
    quote:
      "Owner Portal ทำให้ติดตามรายได้ค่าเช่าและสถานะห้องได้ตลอด ไม่ต้องโทรถามทีมงานบ่อยๆ เหมือนเมื่อก่อน",
  },
  {
    name: "คุณกวิน",
    role: "ลูกค้าซื้อทาวน์โฮม บางนา",
    quote:
      "ทีมงานตอบไวมาก นัดชมได้ภายในวันเดียว ข้อมูลค่าใช้จ่ายและค่าโอนครบ ไม่ต้องถามซ้ำหลายรอบ",
  },
];

const articles = [
  {
    tag: "ซื้อบ้าน",
    title: "5 เช็กลิสต์ก่อนตัดสินใจซื้อคอนโดใกล้ BTS",
    date: "10 ก.ค. 2569",
  },
  {
    tag: "การลงทุน",
    title: "Rental Yield คืออะไร ทำไมนักลงทุนอสังหาฯ ต้องรู้",
    date: "2 ก.ค. 2569",
  },
  {
    tag: "สินเชื่อ",
    title: "เทคนิคเลือกอัตราดอกเบี้ยบ้านให้เหมาะกับแผนการเงิน",
    date: "25 มิ.ย. 2569",
  },
];

export default function Home() {
  const spotlight = properties[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon text-cream">
        <HeroBackground />
        <div className="relative">
          <HeroSlider />
        </div>

        {/* Search widget overlapping hero */}
        <div className="relative px-5 pb-16 lg:px-8">
          <SearchWidget />
        </div>
      </section>

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
          <div className="relative pb-16 pl-6 pt-6 sm:pb-24 sm:pl-10">
            {/* dotted decoration */}
            <div className="absolute left-0 top-0 grid grid-cols-8 gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-gold" />
              ))}
            </div>

            <div className="rounded-2xl border border-gold-light/40 bg-white p-3 shadow-lg">
              <PropertyImage
                images={spotlight.images}
                name={spotlight.name}
                className="h-80 w-full rounded-xl sm:h-96"
              />
            </div>

            <div className="absolute bottom-0 left-0 w-2/5 min-w-[160px] rounded-2xl border-4 border-cream bg-white p-1.5 shadow-xl">
              <div className="relative">
                <PropertyImage
                  images={properties[2].images}
                  name={properties[2].name}
                  index={1}
                  className="h-28 w-full rounded-lg sm:h-36"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gold-dark shadow-md sm:h-12 sm:w-12">
                    <Play className="h-4 w-4 translate-x-0.5 fill-current" strokeWidth={0} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              เกี่ยวกับเรา
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-maroon-dark">
              แพลตฟอร์มอสังหาริมทรัพย์ครบวงจร
              <br />
              ที่ดูแลคุณจนถึงวันโอนกรรมสิทธิ์<span className="text-gold">.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-ink/65">
              Paramee รวบรวมทรัพย์คุณภาพหลากหลายทำเลทั่วกรุงเทพฯ และปริมณฑล
              พร้อมระบบนัดชม จองมัดจำ คำนวณสินเชื่อ และข้อมูลนักลงทุนครบถ้วน
              เพื่อให้ทุกการตัดสินใจง่ายและมั่นใจขึ้น
            </p>

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
              “เราเชื่อว่าการหาบ้านที่ใช่ ควรเป็นเรื่องง่ายและโปร่งใส
              ทุกตัวเลขต้องตรวจสอบได้ ทุกนัดหมายต้องได้รับการดูแล”
            </blockquote>

            <Link
              href="/properties"
              className="mt-6 inline-block bg-maroon px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
            >
              บริการของเรา
            </Link>
          </div>
        </div>
      </section>

      {/* Main focus */}
      <section className="bg-cream-dark/60 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              บริการของเรา
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
              โฟกัสหลักของ Paramee
            </h2>
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

      {/* Featured properties */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <span className="rounded-full bg-gold-light/40 px-4 py-1 text-xs font-semibold text-maroon-dark">
              ทรัพย์
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
              ทรัพย์แนะนำ
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              คัดสรรทำเลดี ราคาคุ้มค่า พร้อมข้อมูลนักลงทุนครบถ้วน
            </p>
          </div>

          <FeaturedCarousel properties={properties} />

          <div className="mt-10 text-center">
            <Link
              href="/properties"
              className="border border-gold-dark px-6 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
            >
              ดูทรัพย์ทั้งหมด →
            </Link>
          </div>
        </div>
      </section>

      {/* Banner strip */}
      <section className="bg-maroon py-14 text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <p className="font-heading text-xl italic leading-relaxed text-gold-light sm:text-2xl">
            “บ้านที่ดีไม่ใช่แค่ที่พักอาศัย แต่คือจุดเริ่มต้นของทุกความทรงจำ”
          </p>
          <p className="mt-3 text-sm text-cream/60">— ทีมงาน Paramee</p>
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
              เสียงจากลูกค้า
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
              ลูกค้าพูดถึงเราอย่างไร
            </h2>
          </div>

          <div className="mt-10">
            <Carousel itemClassName="w-[90%] shrink-0 snap-start sm:w-[70%] lg:w-[calc(33.333%-16px)]">
              {testimonials.map((t) => (
                <div key={t.name} className="h-full bg-white p-7 shadow-sm">
                  <Quote className="h-7 w-7 text-gold-light" strokeWidth={1.5} fill="currentColor" />
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-cream-dark pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon font-heading text-sm font-semibold text-gold-light">
                      {t.name.replace("คุณ", "").charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-maroon-dark">{t.name}</p>
                      <p className="text-xs uppercase tracking-wide text-ink/45">{t.role}</p>
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
            บทความน่ารู้
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold text-maroon-dark">
            เกร็ดความรู้เรื่องอสังหาริมทรัพย์
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {articles.map((a) => (
            <div key={a.title} className="overflow-hidden bg-white shadow-sm">
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-maroon via-maroon-light to-maroon-dark">
                <Newspaper className="h-10 w-10 text-gold-light" strokeWidth={1.5} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-ink/50">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" strokeWidth={1.75} /> ทีมงาน Paramee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" strokeWidth={1.75} /> {a.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-maroon-dark">
                  {a.title}
                </h3>
                <div className="mt-4 flex items-center justify-between border-t border-cream-dark pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-ink/45">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} /> {a.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    อ่านต่อ <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner — overlaps into footer */}
      <section className="relative z-10 mx-auto -mb-16 max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 bg-gold px-8 py-10 text-center shadow-xl sm:flex-row sm:text-left">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-maroon-dark">
              กำลังมองหาบ้านในฝันอยู่ใช่ไหม?
            </h2>
            <p className="mt-1 text-sm text-maroon-dark/70">
              ให้ทีม Paramee ช่วยคุณค้นหาทรัพย์ที่ใช่ วันนี้
            </p>
          </div>
          <Link
            href="/properties"
            className="shrink-0 bg-maroon px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
          >
            ค้นหาทรัพย์ →
          </Link>
        </div>
      </section>
    </>
  );
}
