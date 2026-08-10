"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function PhotoShootForm() {
  const [form, setForm] = useState({
    condoName: "",
    unitCode: "",
    roomNumber: "",
    building: "",
    floor: "",
    ownerNickname: "",
    phone: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.condoName.trim()) {
      setError("กรุณากรอกชื่อคอนโด");
      return;
    }
    if (!/^\d{9,10}$/.test(form.phone)) {
      setError("กรุณากรอกเบอร์ติดต่อ 9-10 หลัก");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/photo-shoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ส่งคำขอไม่สำเร็จ กรุณาลองใหม่");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
          <Check className="h-8 w-8 text-maroon-dark" strokeWidth={2} />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-maroon-dark">
          ส่งคำขอนัดถ่ายภาพเรียบร้อยแล้ว
        </h1>
        <p className="mt-3 text-sm text-ink/60">ทีมงาน Paramee Asset จะติดต่อกลับเพื่อยืนยันวันเวลาโดยเร็วที่สุด</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-maroon-dark">นัดถ่ายภาพ</h1>
      <p className="mt-2 text-sm text-ink/60">
        กรอกข้อมูลห้อง/บ้านที่ต้องการนัดถ่ายภาพ ทีมงานจะติดต่อกลับเพื่อยืนยันวันเวลา
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-gold-light/40 bg-white p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
            ชื่อคอนโด <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.condoName}
            onChange={(e) => update("condoName", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">รหัส</label>
            <input value={form.unitCode} onChange={(e) => update("unitCode", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">เลขที่ห้อง</label>
            <input value={form.roomNumber} onChange={(e) => update("roomNumber", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">ตึก</label>
            <input value={form.building} onChange={(e) => update("building", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">ชั้น</label>
            <input value={form.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">ชื่อเล่นเจ้าของ</label>
            <input
              value={form.ownerNickname}
              onChange={(e) => update("ownerNickname", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">
              เบอร์ติดต่อ <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-maroon-dark">หมายเหตุเพิ่มเติม</label>
          <textarea rows={3} value={form.note} onChange={(e) => update("note", e.target.value)} className={inputClass} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold px-5 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light disabled:opacity-50"
        >
          {submitting ? "กำลังส่ง..." : "ส่งคำขอนัดถ่ายภาพ"}
        </button>
      </form>
    </div>
  );
}
