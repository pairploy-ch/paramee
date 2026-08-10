"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { updatePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";
import type { Owner } from "@/lib/owners";

const inputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold";

export default function AssignOwnerForm({ property, owners }: { property: Property; owners: Owner[] }) {
  const { updateProperty } = useProperties();
  const [mode, setMode] = useState<"existing" | "new">(property.ownerId ? "existing" : "new");
  const [selectedOwnerId, setSelectedOwnerId] = useState(property.ownerId || "");
  const [newOwner, setNewOwner] = useState({
    name: "",
    nickname: "",
    phone: "",
    lineId: "",
    facebookUrl: "",
    whatsapp: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function updateNewOwner<K extends keyof typeof newOwner>(key: K, value: (typeof newOwner)[K]) {
    setNewOwner((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "existing") {
      if (!selectedOwnerId) {
        setError("กรุณาเลือกเจ้าของทรัพย์");
        return;
      }
      setSaving(true);
      if (isSupabaseConfigured) {
        const supabase = createClient();
        const { error: updateError } = await updatePropertyBySlug(supabase, property.slug, {
          ownerId: selectedOwnerId,
        });
        setSaving(false);
        if (updateError) {
          setError(updateError.message);
          return;
        }
      } else {
        updateProperty(property.slug, { ownerId: selectedOwnerId });
        setSaving(false);
      }
      setSaved(true);
      return;
    }

    // mode === "new"
    if (!newOwner.name.trim() || !newOwner.phone.trim()) {
      setError("กรุณากรอกชื่อและเบอร์โทรของเจ้าของ");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("ต้องเชื่อมต่อ Supabase ก่อนจึงจะเพิ่มเจ้าของทรัพย์ใหม่ได้ (โหมดสาธิตรองรับเฉพาะการเลือกเจ้าของที่มีอยู่)");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: inserted, error: insertError } = await supabase
      .from("profiles")
      .insert({
        role: "owner",
        name: newOwner.name.trim(),
        nickname: newOwner.nickname.trim() || null,
        phone: newOwner.phone.trim(),
        line_id: newOwner.lineId.trim() || null,
        facebook_url: newOwner.facebookUrl.trim() || null,
        whatsapp: newOwner.whatsapp.trim() || null,
        is_registered: false,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      setSaving(false);
      setError(insertError?.message ?? "เพิ่มเจ้าของทรัพย์ไม่สำเร็จ");
      return;
    }

    const { error: updateError } = await updatePropertyBySlug(supabase, property.slug, {
      ownerId: inserted.id,
    });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
          <Check className="h-8 w-8 text-maroon-dark" strokeWidth={2} />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold text-maroon-dark">บันทึกข้อมูลเจ้าของเรียบร้อยแล้ว</h1>
        <p className="mt-3 text-sm text-ink/60">{property.name}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/properties/${property.slug}`}
            target="_blank"
            className="border border-gold-dark px-5 py-2.5 text-sm font-medium text-gold-dark hover:bg-cream-dark"
          >
            ดูทรัพย์
          </Link>
          <Link
            href="/admin/properties"
            className="bg-maroon px-5 py-2.5 text-sm font-medium text-cream hover:bg-maroon-light"
          >
            เพิ่มทรัพย์ถัดไป
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-maroon-dark">ข้อมูลเจ้าของทรัพย์</h1>
        <p className="mt-2 text-sm text-ink/60">
          บันทึกทรัพย์ &quot;{property.name}&quot; เรียบร้อยแล้ว — ระบุว่าห้องนี้เป็นของใคร
        </p>
      </div>

      <div className="mb-5 flex rounded-full border border-cream-dark p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode("existing")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            mode === "existing" ? "bg-maroon text-gold-light" : "text-ink/50"
          }`}
        >
          เลือกเจ้าของที่มีอยู่
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            mode === "new" ? "bg-maroon text-gold-light" : "text-ink/50"
          }`}
        >
          เพิ่มเจ้าของใหม่
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gold-light/40 bg-white p-6">
        {mode === "existing" ? (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">เจ้าของทรัพย์</label>
            <select
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              className={inputClass}
            >
              <option value="">— เลือกเจ้าของ —</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                  {o.nickname ? ` (${o.nickname})` : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ชื่อ-นามสกุล</label>
              <input
                required
                value={newOwner.name}
                onChange={(e) => updateNewOwner("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ชื่อเล่น</label>
              <input value={newOwner.nickname} onChange={(e) => updateNewOwner("nickname", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">เบอร์โทร</label>
              <input
                required
                value={newOwner.phone}
                onChange={(e) => updateNewOwner("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">LINE ID</label>
              <input value={newOwner.lineId} onChange={(e) => updateNewOwner("lineId", e.target.value)} placeholder="@yourline" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">Facebook</label>
              <input
                value={newOwner.facebookUrl}
                onChange={(e) => updateNewOwner("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">WhatsApp</label>
              <input value={newOwner.whatsapp} onChange={(e) => updateNewOwner("whatsapp", e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลเจ้าของ"}
        </button>
      </form>
    </div>
  );
}
