"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
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

const weekdayLabels = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function BookingCard({
  booking,
  pending,
  onStatusChange,
  onDelete,
}: {
  booking: BookingRow;
  pending: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onDelete: (id: string) => void;
}) {
  const property = booking.property_slug ? getPropertyBySlug(booking.property_slug) : undefined;
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-[220px] flex-1">
          <p className="font-medium text-maroon-dark">
            {booking.name} · {modeLabel[booking.mode]}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            {booking.phone} · {booking.email}
          </p>
          {property && <p className="text-xs text-ink/50">ทรัพย์ที่สนใจ: {property.name}</p>}
          {booking.appt_date && (
            <p className="text-xs text-ink/50">
              วันนัด: {booking.appt_date} เวลา {booking.appt_time?.slice(0, 5)} น.
            </p>
          )}
          {booking.note && <p className="mt-1 text-xs text-ink/60">หมายเหตุ: {booking.note}</p>}
          <p className="mt-1 text-[11px] text-ink/40">
            ส่งเมื่อ {new Date(booking.created_at).toLocaleString("th-TH")}
          </p>
        </div>

        <select
          value={booking.status}
          onChange={(e) => onStatusChange(booking.id, e.target.value as BookingStatus)}
          disabled={pending}
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none disabled:opacity-50 ${statusStyle[booking.status]}`}
        >
          {(Object.keys(statusLabel) as BookingStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onDelete(booking.id)}
          disabled={pending}
          aria-label="ลบรายการ"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

function BookingsCalendar({
  bookingsByDate,
  selectedDate,
  onSelectDate,
}: {
  bookingsByDate: Map<string, BookingRow[]>;
  selectedDate: string | null;
  onSelectDate: (dateKey: string | null) => void;
}) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const todayKey = toDateKey(new Date());

  const cells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = (firstDay.getDay() + 6) % 7; // Monday-first grid

    const out: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < leadingBlanks; i++) out.push({ date: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      out.push({ date, key: toDateKey(date) });
    }
    return out;
  }, [monthCursor]);

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-dark text-ink/60 hover:border-gold-dark hover:text-maroon-dark"
          aria-label="เดือนก่อนหน้า"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <p className="font-heading text-base font-semibold text-maroon-dark">
          {monthCursor.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cream-dark text-ink/60 hover:border-gold-dark hover:text-maroon-dark"
          aria-label="เดือนถัดไป"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-ink/40">
        {weekdayLabels.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => {
          if (!cell.date || !cell.key) return <div key={`blank-${i}`} />;
          const dayBookings = bookingsByDate.get(cell.key) ?? [];
          const isToday = cell.key === todayKey;
          const isSelected = cell.key === selectedDate;
          return (
            <button
              key={cell.key}
              onClick={() => onSelectDate(isSelected ? null : cell.key)}
              className={`flex min-h-[64px] flex-col items-start gap-1 rounded-lg border p-1.5 text-left text-xs transition-colors ${
                isSelected
                  ? "border-gold-dark bg-cream-dark/60"
                  : "border-cream-dark hover:border-gold-light"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  isToday ? "bg-maroon text-gold-light" : "text-ink/60"
                }`}
              >
                {cell.date.getDate()}
              </span>
              {dayBookings.length > 0 && (
                <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold-dark">
                  {dayBookings.length} นัด
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingsAdmin({ initialBookings }: { initialBookings: BookingRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingRow[]>();
    for (const b of initialBookings) {
      if (!b.appt_date) continue;
      const list = map.get(b.appt_date) ?? [];
      list.push(b);
      map.set(b.appt_date, list);
    }
    return map;
  }, [initialBookings]);

  async function handleStatusChange(id: string, status: BookingStatus) {
    if (!isSupabaseConfigured) return;
    setPendingId(id);
    const supabase = createClient();
    await updateBookingStatus(supabase, id, status);
    router.refresh();
    setPendingId(null);
  }

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured) return;
    setPendingId(id);
    const supabase = createClient();
    await deleteBooking(supabase, id);
    router.refresh();
    setPendingId(null);
  }

  const visibleBookings =
    view === "calendar" && selectedDate
      ? initialBookings.filter((b) => b.appt_date === selectedDate)
      : initialBookings;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
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

        <div className="flex shrink-0 rounded-full border border-cream-dark p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              view === "list" ? "bg-maroon text-gold-light" : "text-ink/50"
            }`}
          >
            <List className="h-3.5 w-3.5" strokeWidth={1.75} /> รายการ
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              view === "calendar" ? "bg-maroon text-gold-light" : "text-ink/50"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} /> ปฏิทิน
          </button>
        </div>
      </div>

      {view === "calendar" && (
        <div className="mb-6">
          <BookingsCalendar
            bookingsByDate={bookingsByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate && (
            <p className="mt-3 text-xs text-ink/50">
              แสดงเฉพาะวันที่ {selectedDate} — <button onClick={() => setSelectedDate(null)} className="underline hover:text-maroon">ดูทั้งหมด</button>
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {visibleBookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            pending={pendingId === b.id}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
        {visibleBookings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            {view === "calendar" && selectedDate ? "ไม่มีนัดในวันนี้" : "ยังไม่มีคำขอเข้ามา"}
          </p>
        )}
      </div>
    </div>
  );
}
