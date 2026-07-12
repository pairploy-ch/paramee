"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { properties } from "@/lib/properties";

const modeCopy: Record<string, { title: string; subtitle: string; cta: string }> = {
  view: {
    title: "นัดเข้าชมโครงการ / ห้อง",
    subtitle: "เลือกวัน เวลา และทรัพย์ที่สนใจ ทีมงานจะยืนยันการนัดหมายผ่านอีเมลและ SMS",
    cta: "ยืนยันการนัดชม",
  },
  reserve: {
    title: "จองและวางมัดจำ",
    subtitle: "กรอกข้อมูลผู้จอง ทีมงานจะติดต่อกลับเพื่อแจ้งเงื่อนไขและช่องทางโอนมัดจำ",
    cta: "ส่งคำขอจอง",
  },
  financing: {
    title: "ขอสินเชื่อ / นัดพบเจ้าหน้าที่การเงิน",
    subtitle: "ทีมงานจะติดต่อกลับพร้อมข้อเสนอสินเชื่อที่เหมาะกับคุณ",
    cta: "ส่งคำขอสินเชื่อ",
  },
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "reserve"
    ? "reserve"
    : searchParams.get("mode") === "financing"
    ? "financing"
    : "view";
  const propertySlug = searchParams.get("property") ?? "";

  const copy = modeCopy[mode];

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    property: propertySlug,
    date: "",
    time: "",
    note: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
          <Check className="h-8 w-8 text-maroon-dark" strokeWidth={2} />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-maroon-dark">
          ส่งคำขอเรียบร้อยแล้ว
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          ทีมงาน Paramee ได้รับข้อมูลของคุณแล้ว ระบบจะส่งอีเมลและ SMS
          ยืนยันโดยอัตโนมัติ และแจ้งเตือนทีมขายผ่าน LINE Notify ทันที
        </p>
        <p className="mt-1 text-xs text-ink/40">
          (การเชื่อมต่อ SMS / LINE Notify จริงจะเปิดใช้งานเมื่อได้รับข้อมูล Provider จากผู้ว่าจ้าง)
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">{copy.title}</h1>
      <p className="mt-2 text-sm text-ink/60">{copy.subtitle}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-gold-light/40 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              ชื่อ-นามสกุล
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              เบอร์โทร
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            อีเมล
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            ทรัพย์ที่สนใจ
          </label>
          <select
            value={form.property}
            onChange={(e) => update("property", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          >
            <option value="">— ยังไม่ระบุ —</option>
            {properties.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {mode === "view" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
                วันที่นัด
              </label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
                เวลานัด
              </label>
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            หมายเหตุเพิ่มเติม
          </label>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
        >
          {copy.cta}
        </button>
      </form>
    </div>
  );
}
