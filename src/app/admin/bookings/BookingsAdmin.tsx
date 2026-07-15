"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import { getPropertyBySlug } from "@/lib/properties";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { updateBookingStatus, deleteBooking, type BookingRow, type BookingStatus } from "@/lib/data/bookings";

const modeLabel: Record<BookingRow["mode"], string> = {
  view: "นัดชมทรัพย์",
  financing: "ขอสินเชื่อ",
};

const statusLabel: Record<BookingStatus, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  done: "เสร็จสิ้น",
};

const statusStyle: Record<BookingStatus, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function BookingsAdmin({ initialBookings }: { initialBookings: BookingRow[] }) {
  const router = useRouter();

  async function handleStatusChange(id: string, status: BookingStatus) {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await updateBookingStatus(supabase, id, status);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await deleteBooking(supabase, id);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
          รายการนัดชม / จอง / ขอสินเชื่อ
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          คำขอทั้งหมดที่ลูกค้าส่งเข้ามาจากหน้า &quot;นัดชมทรัพย์&quot;
        </p>
        {!isSupabaseConfigured && (
          <p className="mt-2 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
            ยังไม่ได้ตั้งค่า Supabase — คำขอจากลูกค้าจะยังไม่ถูกบันทึกจนกว่าจะเชื่อมต่อฐานข้อมูล
          </p>
        )}
      </div>

      <div className="space-y-3">
        {initialBookings.map((b) => {
          const property = b.property_slug ? getPropertyBySlug(b.property_slug) : undefined;
          return (
            <div key={b.id} className="rounded-2xl border border-gold-light/40 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-[220px] flex-1">
                  <p className="font-medium text-maroon-dark">
                    {b.name} · {modeLabel[b.mode]}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">
                    {b.phone} · {b.email}
                  </p>
                  {property && <p className="text-xs text-ink/50">ทรัพย์ที่สนใจ: {property.name}</p>}
                  {b.appt_date && (
                    <p className="text-xs text-ink/50">
                      วันนัด: {b.appt_date} เวลา {b.appt_time?.slice(0, 5)} น.
                    </p>
                  )}
                  {b.note && <p className="mt-1 text-xs text-ink/60">หมายเหตุ: {b.note}</p>}
                  <p className="mt-1 text-[11px] text-ink/40">
                    ส่งเมื่อ {new Date(b.created_at).toLocaleString("th-TH")}
                  </p>
                </div>

                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${statusStyle[b.status]}`}
                >
                  {(Object.keys(statusLabel) as BookingStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(b.id)}
                  aria-label="ลบรายการ"
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
        {initialBookings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            ยังไม่มีคำขอเข้ามา
          </p>
        )}
      </div>
    </div>
  );
}
