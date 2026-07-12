"use client";

import { useEffect, useState } from "react";
import { useProperties } from "@/lib/propertyStore";
import { getOwnerByEmail } from "@/lib/owners";
import { formatBaht } from "@/lib/format";
import PropertyImage from "@/components/PropertyImage";

const viewsByWeek = [
  { label: "สัปดาห์ที่ 1", views: 42 },
  { label: "สัปดาห์ที่ 2", views: 58 },
  { label: "สัปดาห์ที่ 3", views: 35 },
  { label: "สัปดาห์ที่ 4", views: 71 },
];

const appointments = [
  { date: "2026-07-08", time: "14:00", name: "คุณสมชาย", status: "เข้าชมแล้ว" },
  { date: "2026-07-10", time: "10:30", name: "คุณพิมพ์ใจ", status: "เข้าชมแล้ว" },
  { date: "2026-07-14", time: "16:00", name: "คุณอนันต์", status: "รอยืนยัน" },
];

const paymentHistory = [
  { period: "มิ.ย. 2569", amount: 38000, status: "ชำระแล้ว" },
  { period: "พ.ค. 2569", amount: 38000, status: "ชำระแล้ว" },
  { period: "เม.ย. 2569", amount: 38000, status: "ชำระแล้ว" },
];

const incomeSummary = {
  monthly: 38000,
  quarterly: 114000,
  yearly: 456000,
};

const DEMO_EMAIL = "owner@paramee.co.th";
const DEMO_PASSWORD = "Owner@2026";

export default function OwnerPortal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { properties, updateProperty } = useProperties();
  const owner = getOwnerByEmail(DEMO_EMAIL);
  const ownedProperties = properties.filter((p) => p.ownerId === owner?.id);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedProperty = ownedProperties.find((p) => p.slug === selectedSlug) ?? ownedProperties[0];

  const [editPrice, setEditPrice] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (selectedProperty) {
      setEditPrice(String(selectedProperty.salePrice ?? ""));
      setSaved(false);
    }
  }, [selectedProperty?.slug]);

  if (!loggedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
        <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
          <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
            Owner Portal
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            เข้าสู่ระบบเพื่อดูข้อมูลทรัพย์ของคุณ
          </p>
          <div className="mt-3 rounded-lg bg-cream-dark/60 px-4 py-3 text-xs text-ink/60">
            บัญชีสาธิต — อีเมล: <span className="font-semibold text-maroon-dark">{DEMO_EMAIL}</span>
            <br />
            รหัสผ่าน: <span className="font-semibold text-maroon-dark">{DEMO_PASSWORD}</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
                setError("");
                setLoggedIn(true);
              } else {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
              }
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">
                เบอร์โทร / อีเมล
              </label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="owner@paramee.co.th"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">
                OTP / รหัสผ่าน
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="••••••"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center text-ink/60">
        ไม่พบทรัพย์ที่อยู่ภายใต้บัญชีนี้
      </div>
    );
  }

  const maxViews = Math.max(...viewsByWeek.map((v) => v.views));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            สวัสดี, {owner?.name}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            คุณมีทรัพย์ในระบบทั้งหมด {ownedProperties.length} รายการ
          </p>
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          className="border border-cream-dark px-4 py-2 text-xs font-medium text-ink/60 hover:border-gold"
        >
          ออกจากระบบ
        </button>
      </div>

      {/* Property switcher */}
      {ownedProperties.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {ownedProperties.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                p.slug === selectedProperty.slug
                  ? "bg-maroon text-cream"
                  : "border border-cream-dark text-ink/60 hover:border-gold-dark hover:text-gold-dark"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <PropertyImage
          images={selectedProperty.images}
          name={selectedProperty.name}
          className="h-56 w-full rounded-2xl lg:h-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="สถานะห้องปัจจุบัน" value="ให้เช่าอยู่" accent />
          <StatCard label="รายได้ค่าเช่า / เดือน" value={formatBaht(incomeSummary.monthly)} />
          <StatCard label="รายได้ค่าเช่า / ไตรมาส" value={formatBaht(incomeSummary.quarterly)} />
          <StatCard label="รายได้ค่าเช่า / ปี" value={formatBaht(incomeSummary.yearly)} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Views chart */}
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            จำนวนคนที่สนใจ (เปิดดูประกาศ)
          </h2>
          <div className="mt-6 flex h-36 items-end gap-4">
            {viewsByWeek.map((v) => (
              <div key={v.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-maroon to-gold"
                  style={{ height: `${Math.round((v.views / maxViews) * 96)}px` }}
                />
                <span className="text-[10px] text-ink/50">{v.label}</span>
                <span className="text-xs font-semibold text-maroon-dark">{v.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            การนัดดูห้อง
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {appointments.map((a, i) => (
              <li key={i} className="flex items-center justify-between border-b border-cream-dark pb-3 last:border-none">
                <div>
                  <p className="font-medium text-maroon-dark">{a.name}</p>
                  <p className="text-xs text-ink/50">{a.date} · {a.time}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "เข้าชมแล้ว" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment history + report */}
      <div className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            ประวัติการจ่ายค่าเช่า
          </h2>
          <button
            onClick={() => window.print()}
            className="border border-gold-dark px-4 py-2 text-xs font-medium text-gold-dark hover:bg-cream-dark"
          >
            ดาวน์โหลดรายงานสรุปรายได้ (PDF)
          </button>
        </div>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="py-2">งวด</th>
              <th className="py-2">จำนวนเงิน</th>
              <th className="py-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((p, i) => (
              <tr key={i} className="border-t border-cream-dark">
                <td className="py-2.5">{p.period}</td>
                <td className="py-2.5">{formatBaht(p.amount)}</td>
                <td className="py-2.5 text-emerald-700">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit property */}
      <div className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
        <h2 className="font-heading text-lg font-semibold text-maroon-dark">
          แก้ไขข้อมูลทรัพย์
        </h2>
        <p className="mt-1 text-xs text-ink/50">เจ้าของสามารถอัปเดตราคาและรูปภาพได้ด้วยตนเอง</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">ราคาขาย (บาท)</label>
            <input
              value={editPrice}
              onChange={(e) => {
                setEditPrice(e.target.value);
                setSaved(false);
              }}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">รูปภาพ</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-xs text-ink/60 outline-none file:mr-3 file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-maroon-dark"
            />
          </div>
        </div>
        <button
          onClick={() => {
            updateProperty(selectedProperty.slug, { salePrice: editPrice ? Number(editPrice) : null });
            setSaved(true);
          }}
          className="mt-4 bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
        >
          บันทึกการเปลี่ยนแปลง
        </button>
        {saved && (
          <p className="mt-2 text-xs text-emerald-700">
            บันทึกข้อมูลเรียบร้อย (เก็บไว้ในเบราว์เซอร์นี้ — ยังไม่เชื่อมต่อฐานข้อมูลกลาง)
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-gold bg-maroon text-cream" : "border-gold-light/40 bg-white"
      }`}
    >
      <p className={`text-xs ${accent ? "text-cream/60" : "text-ink/50"}`}>{label}</p>
      <p className={`mt-1 font-heading text-lg font-semibold ${accent ? "text-gold-light" : "text-maroon-dark"}`}>
        {value}
      </p>
    </div>
  );
}
