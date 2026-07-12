"use client";

import { useState } from "react";
import { leads as initialLeads, leadsPerDay, topByField, type Lead } from "@/lib/leads";
import { propertyTypes } from "@/lib/properties";
import AdminNav from "@/components/AdminNav";

const followUpStyles: Record<Lead["followUp"], string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-sky-100 text-sky-700",
};

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  channel: "Website" as Lead["channel"],
  interestedType: "คอนโด" as Lead["interestedType"],
  area: "",
  budget: "",
  sizeNeeded: "",
  purpose: "ซื้อเอง" as Lead["purpose"],
  followUp: "Warm" as Lead["followUp"],
  note: "",
};

function toCsv(rows: Lead[]) {
  const header = [
    "วันที่",
    "ช่องทาง",
    "ประเภทที่สนใจ",
    "ทำเล",
    "งบประมาณ",
    "ขนาดพื้นที่",
    "วัตถุประสงค์",
    "สถานะ",
    "หมายเหตุ",
  ];
  const lines = rows.map((l) =>
    [l.date, l.channel, l.interestedType, l.area, l.budget, l.sizeNeeded, l.purpose, l.followUp, l.note]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

const DEMO_EMAIL = "admin@paramee.co.th";
const DEMO_PASSWORD = "Admin@2026";

export default function LeadsAdmin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [form, setForm] = useState(emptyForm);

  const byDay = leadsPerDay();
  const maxDay = Math.max(...byDay.map(([, c]) => c), 1);
  const topArea = topByField("area");
  const topType = topByField("interestedType");
  const topBudget = topByField("budget");
  const topSize = topByField("sizeNeeded");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.area) return;
    setLeads((prev) => [{ ...form }, ...prev]);
    setForm(emptyForm);
  }

  function handleExport() {
    const csv = toCsv(leads);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paramee-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
        <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
          <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
            Admin: Track Lead
          </h1>
          <p className="mt-2 text-sm text-ink/60">เข้าสู่ระบบสำหรับทีมงาน Paramee</p>
          <div className="mt-3 rounded-lg bg-cream-dark/60 px-4 py-3 text-xs text-ink/60">
            บัญชีสาธิต — อีเมล: <span className="font-semibold text-maroon-dark">{DEMO_EMAIL}</span>
            <br />
            รหัสผ่าน: <span className="font-semibold text-maroon-dark">{DEMO_PASSWORD}</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
                setLoginError("");
                setLoggedIn(true);
              } else {
                setLoginError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
              }
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">อีเมล</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="admin@paramee.co.th"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">รหัสผ่าน</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
                placeholder="••••••"
              />
            </div>
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <AdminNav />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            Track Lead ประจำวัน
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            บันทึกและวิเคราะห์ความต้องการตลาดจากข้อมูล Lead ที่รับในแต่ละวัน
          </p>
        </div>
        <button
          onClick={handleExport}
          className="border border-gold-dark px-5 py-2.5 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
        >
          Export CSV
        </button>
      </div>

      {/* Dashboard */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            Lead รายวัน
          </h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {byDay.map(([date, count]) => (
              <div key={date} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-maroon to-gold"
                  style={{ height: `${Math.max(6, Math.round((count / maxDay) * 100))}px` }}
                />
                <span className="text-[10px] text-ink/50">{date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            สรุปความต้องการสูงสุด
          </h2>
          <div className="mt-4 space-y-4 text-sm">
            <SummaryRow title="ทำเลยอดนิยม" items={topArea} />
            <SummaryRow title="ประเภททรัพย์" items={topType} />
            <SummaryRow title="ช่วงงบประมาณ" items={topBudget} />
            <SummaryRow title="ขนาดพื้นที่" items={topSize} />
          </div>
        </div>
      </div>

      {/* Add lead form */}
      <form
        onSubmit={handleAdd}
        className="mt-6 grid gap-4 rounded-2xl border border-gold-light/40 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-2 lg:col-span-4">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            บันทึก Lead ใหม่
          </h2>
        </div>

        <Field label="วันที่รับ Lead">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </Field>

        <Field label="ช่องทาง">
          <select
            value={form.channel}
            onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as Lead["channel"] }))}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {["Walk-in", "โทร", "LINE", "Website", "IG", "Referral"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="ประเภทที่สนใจ">
          <select
            value={form.interestedType}
            onChange={(e) =>
              setForm((f) => ({ ...f, interestedType: e.target.value as Lead["interestedType"] }))
            }
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="วัตถุประสงค์">
          <select
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value as Lead["purpose"] }))}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {["ซื้อเอง", "ลงทุน", "เช่า"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field label="ทำเล / ย่าน">
          <input
            required
            value={form.area}
            onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </Field>

        <Field label="งบประมาณ">
          <input
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
            placeholder="เช่น 5-7 ล้าน"
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </Field>

        <Field label="ขนาดพื้นที่ที่ต้องการ">
          <input
            value={form.sizeNeeded}
            onChange={(e) => setForm((f) => ({ ...f, sizeNeeded: e.target.value }))}
            placeholder="เช่น 35-45 ตร.ม."
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </Field>

        <Field label="สถานะ Follow-up">
          <select
            value={form.followUp}
            onChange={(e) => setForm((f) => ({ ...f, followUp: e.target.value as Lead["followUp"] }))}
            className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {["Hot", "Warm", "Cold"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="หมายเหตุเพิ่มเติม">
            <input
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full rounded-lg border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </Field>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-maroon px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
          >
            บันทึก Lead
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">วันที่</th>
              <th className="px-4 py-3">ช่องทาง</th>
              <th className="px-4 py-3">ประเภท</th>
              <th className="px-4 py-3">ทำเล</th>
              <th className="px-4 py-3">งบประมาณ</th>
              <th className="px-4 py-3">ขนาด</th>
              <th className="px-4 py-3">วัตถุประสงค์</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-t border-cream-dark">
                <td className="px-4 py-3 whitespace-nowrap">{l.date}</td>
                <td className="px-4 py-3">{l.channel}</td>
                <td className="px-4 py-3">{l.interestedType}</td>
                <td className="px-4 py-3">{l.area}</td>
                <td className="px-4 py-3 whitespace-nowrap">{l.budget}</td>
                <td className="px-4 py-3 whitespace-nowrap">{l.sizeNeeded}</td>
                <td className="px-4 py-3">{l.purpose}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${followUpStyles[l.followUp]}`}>
                    {l.followUp}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">{l.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/60">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink/50">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map(([label, count]) => (
          <span
            key={label}
            className="rounded-full bg-cream-dark px-2.5 py-1 text-xs text-maroon-dark"
          >
            {label} · {count}
          </span>
        ))}
      </div>
    </div>
  );
}
