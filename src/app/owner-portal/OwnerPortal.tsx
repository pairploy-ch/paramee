"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Pencil, Trash2 } from "lucide-react";
import { formatBaht } from "@/lib/format";
import PropertyImage from "@/components/PropertyImage";
import PropertyForm from "@/components/PropertyForm";
import LogoutButton from "@/components/LogoutButton";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertProperty, deletePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";
import type { Property } from "@/lib/types";

export interface OwnerContact {
  name: string;
  phone: string;
  avatarUrl: string;
  lineId: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export default function OwnerPortal({
  ownerName,
  ownerId,
  initialProperties,
  contact,
}: {
  ownerName: string;
  ownerId: string;
  initialProperties: Property[];
  contact: OwnerContact;
}) {
  const router = useRouter();
  const localStore = useProperties();
  const [tab, setTab] = useState<"properties" | "contact">("properties");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selectedProperty =
    initialProperties.find((p) => p.slug === selectedSlug) ?? initialProperties[0];

  async function handleAddProperty(property: Omit<Property, "slug">) {
    const supabase = createClient();
    const { data, error } = await insertProperty(supabase, { ...property, ownerId });
    if (error) return { error: error.message };
    router.refresh();
    return { slug: data?.slug };
  }

  async function confirmDeleteProperty() {
    if (!deleteTarget) return;
    setDeleting(true);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await deletePropertyBySlug(supabase, deleteTarget.slug);
      router.refresh();
    } else {
      localStore.deleteProperty(deleteTarget.slug);
    }
    setDeleting(false);
    setDeleteTarget(null);
    setSelectedSlug(null);
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
          {tab === "properties" && (
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="bg-gold px-4 py-2 text-sm font-medium text-maroon-dark hover:bg-gold-light"
            >
              {showAddForm ? "ปิดฟอร์ม" : "+ เพิ่มทรัพย์ใหม่"}
            </button>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("properties")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "properties" ? "bg-maroon text-cream" : "border border-cream-dark text-ink/60"
          }`}
        >
          ทรัพย์ของฉัน
        </button>
        <button
          onClick={() => setTab("contact")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "contact" ? "bg-maroon text-cream" : "border border-cream-dark text-ink/60"
          }`}
        >
          ข้อมูลติดต่อ
        </button>
      </div>

      {tab === "contact" ? (
        <OwnerContactForm ownerId={ownerId} initial={contact} />
      ) : (
        <>
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
              <a
                href={`/properties/${selectedProperty.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-1.5 border border-gold-dark px-4 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
              >
                ดูหน้ารายละเอียดทรัพย์ (เหมือนที่ลูกค้าเห็น พร้อมลายน้ำ) ↗
              </a>
              <Link
                href={`/owner-portal/properties/${selectedProperty.slug}/edit`}
                className="flex items-center justify-center gap-1.5 bg-gold px-4 py-3 text-sm font-medium text-maroon-dark transition-colors hover:bg-gold-light"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
                แก้ไขทรัพย์
              </Link>
              <button
                onClick={() => setDeleteTarget({ slug: selectedProperty.slug, name: selectedProperty.name })}
                className="flex items-center justify-center gap-1.5 border border-cream-dark px-4 py-3 text-sm font-medium text-ink/60 transition-colors hover:border-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                ลบทรัพย์
              </button>
            </div>
          </div>
        </>
      )}
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="ยืนยันลบทรัพย์"
        message={`ยืนยันลบทรัพย์ "${deleteTarget?.name}" ออกจากระบบ? การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบทรัพย์"
        loading={deleting}
        onConfirm={confirmDeleteProperty}
        onCancel={() => setDeleteTarget(null)}
      />
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

const contactInputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold";

function OwnerContactForm({ ownerId, initial }: { ownerId: string; initial: OwnerContact }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof OwnerContact>(key: K, value: OwnerContact[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("watermark", "false");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "อัปโหลดรูปไม่สำเร็จ");
        return;
      }
      update("avatarUrl", data.url);
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: values.name || null,
        phone: values.phone,
        avatar_url: values.avatarUrl || null,
        line_id: values.lineId || null,
        facebook_url: values.facebookUrl || null,
        instagram_url: values.instagramUrl || null,
        tiktok_url: values.tiktokUrl || null,
      })
      .eq("id", ownerId);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-2xl border border-gold-light/40 bg-white p-6"
    >
      <div>
        <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลติดต่อของฉัน</h2>
        <p className="mt-1 text-xs text-ink/50">
          ข้อมูลนี้ใช้สำหรับให้ทีมงานติดต่อกลับ และอาจแสดงกับลูกค้าที่สนใจทรัพย์ของคุณ
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-cream-dark">
          {values.avatarUrl ? (
            <Image src={values.avatarUrl} alt="รูปโปรไฟล์" fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/30">
              <User className="h-7 w-7" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">รูปโปรไฟล์</label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
            className="text-xs text-ink/60 file:mr-3 file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-maroon-dark disabled:opacity-50"
          />
          {uploading && <p className="mt-1 text-xs text-ink/50">กำลังอัปโหลด...</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">ชื่อที่แสดง</label>
          <input
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="ชื่อ-นามสกุล ที่จะแสดงในหน้ารายละเอียดทรัพย์"
            className={contactInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">เบอร์โทร</label>
          <input
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={contactInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">LINE ID</label>
          <input
            value={values.lineId}
            onChange={(e) => update("lineId", e.target.value)}
            placeholder="@yourline"
            className={contactInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">Facebook</label>
          <input
            value={values.facebookUrl}
            onChange={(e) => update("facebookUrl", e.target.value)}
            placeholder="https://facebook.com/..."
            className={contactInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">Instagram</label>
          <input
            value={values.instagramUrl}
            onChange={(e) => update("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/..."
            className={contactInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/60">TikTok</label>
          <input
            value={values.tiktokUrl}
            onChange={(e) => update("tiktokUrl", e.target.value)}
            placeholder="https://tiktok.com/@..."
            className={contactInputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">บันทึกข้อมูลเรียบร้อยแล้ว</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:opacity-50"
      >
        {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลติดต่อ"}
      </button>
    </form>
  );
}
