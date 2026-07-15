"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatBaht } from "@/lib/format";
import PropertyImage from "@/components/PropertyImage";
import PropertyForm from "@/components/PropertyForm";
import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/client";
import { insertProperty } from "@/lib/data/properties";
import type { Property } from "@/lib/types";

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

export default function OwnerPortal({
  ownerName,
  ownerId,
  initialProperties,
}: {
  ownerName: string;
  ownerId: string;
  initialProperties: Property[];
}) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedProperty =
    initialProperties.find((p) => p.slug === selectedSlug) ?? initialProperties[0];

  const maxViews = Math.max(...viewsByWeek.map((v) => v.views));

  async function handleAddProperty(property: Omit<Property, "slug">) {
    const supabase = createClient();
    const { error } = await insertProperty(supabase, { ...property, ownerId });
    if (error) return { error: error.message };
    router.refresh();
    setShowAddForm(false);
    return {};
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            สวัสดี, {ownerName}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            คุณมีทรัพย์ในระบบทั้งหมด {initialProperties.length} รายการ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-gold px-4 py-2 text-sm font-medium text-maroon-dark hover:bg-gold-light"
          >
            {showAddForm ? "ปิดฟอร์ม" : "+ เพิ่มทรัพย์ใหม่"}
          </button>
          <LogoutButton />
        </div>
      </div>

      {showAddForm && (
        <div className="mb-10 rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">เพิ่มทรัพย์ของฉัน</h2>
          <p className="mt-1 text-xs text-ink/50">
            กรอกข้อมูลทรัพย์แบบเต็ม ระบบจะผูกทรัพย์นี้เข้ากับบัญชีของคุณโดยอัตโนมัติ
          </p>
          <div className="mt-4">
            <PropertyForm
              ownerLocked={{ id: ownerId, name: ownerName }}
              onSubmit={handleAddProperty}
              submitLabel="เพิ่มทรัพย์"
            />
          </div>
        </div>
      )}

      {!selectedProperty ? (
        <div className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
          คุณยังไม่มีทรัพย์ในระบบ กด “เพิ่มทรัพย์ใหม่” เพื่อเริ่มต้น
        </div>
      ) : (
        <>
          {/* Property switcher */}
          {initialProperties.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {initialProperties.map((p) => (
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
              <StatCard label="สถานะห้องปัจจุบัน" value={selectedProperty.status} accent />
              <StatCard
                label="ราคาขาย / เช่า"
                value={
                  selectedProperty.salePrice
                    ? formatBaht(selectedProperty.salePrice)
                    : selectedProperty.rentPrice
                    ? `${formatBaht(selectedProperty.rentPrice)}/ด.`
                    : "-"
                }
              />
              <StatCard label="ทำเล" value={selectedProperty.district} />
              <StatCard label="เทียร์ทรัพย์" value={`Tier ${selectedProperty.tier}`} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
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

            <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-maroon-dark">การนัดดูห้อง</h2>
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

          <div className="mt-6 rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ประวัติการจ่ายค่าเช่า</h2>
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
        </>
      )}
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
