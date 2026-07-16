"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Download, Loader2 } from "lucide-react";
import { propertyTypes } from "@/lib/properties";
import { formatBaht, statusLabel } from "@/lib/format";
import type { Property } from "@/lib/types";
import type { Owner } from "@/lib/owners";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { deletePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";

function toCsv(rows: Property[], ownerName: (id: string) => string) {
  const header = ["ชื่อ", "ประเภท", "ทำเล", "สถานะ", "เทียร์", "ราคาขาย", "ราคาเช่า", "เจ้าของ"];
  const lines = rows.map((p) =>
    [p.name, p.type, p.district, statusLabel(p.status), p.tier, p.salePrice ?? "", p.rentPrice ?? "", ownerName(p.ownerId)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export default function ManagePropertiesAdmin({
  initialProperties,
  owners,
}: {
  initialProperties: Property[];
  owners: Owner[];
}) {
  const router = useRouter();
  const localStore = useProperties();
  const properties = isSupabaseConfigured ? initialProperties : localStore.properties;

  const [tab, setTab] = useState<"properties" | "owners">("properties");
  const [typeFilter, setTypeFilter] = useState<"ทั้งหมด" | Property["type"]>("ทั้งหมด");
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const ownerById = (id: string) => owners.find((o) => o.id === id);
  const ownerName = (id: string) => ownerById(id)?.name ?? "ไม่ระบุ";

  const filtered = properties.filter((p) => typeFilter === "ทั้งหมด" || p.type === typeFilter);

  function handleExport() {
    const csv = toCsv(properties, ownerName);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paramee-properties-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function confirmDelete() {
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
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            จัดการทรัพย์ / เจ้าของทรัพย์
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            แก้ไขข้อมูลทรัพย์ทั้งหมดในระบบ และดูรายชื่อเจ้าของทรัพย์ที่ลงทะเบียนไว้ทุกคน
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("properties")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "properties" ? "bg-maroon text-cream" : "border border-cream-dark text-ink/60"
          }`}
        >
          ทรัพย์ทั้งหมด ({properties.length})
        </button>
        <button
          onClick={() => setTab("owners")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "owners" ? "bg-maroon text-cream" : "border border-cream-dark text-ink/60"
          }`}
        >
          เจ้าของทรัพย์ ({owners.length})
        </button>
      </div>

      {tab === "properties" ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="ทั้งหมด">ทุกประเภท</option>
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 border border-gold-dark px-4 py-2 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark"
            >
              <Download className="h-4 w-4" strokeWidth={1.75} />
              Export CSV
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((p) => (
              <PropertyRow
                key={p.slug}
                property={p}
                owners={owners}
                deleting={deleting && deleteTarget?.slug === p.slug}
                onDelete={() => setDeleteTarget({ slug: p.slug, name: p.name })}
              />
            ))}
            {filtered.length === 0 && (
              <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
                ไม่พบทรัพย์ในหมวดนี้
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {owners.map((o) => {
            const owned = properties.filter((p) => p.ownerId === o.id);
            return (
              <div key={o.id} className="rounded-2xl border border-gold-light/40 bg-white p-6">
                <p className="font-heading text-base font-semibold text-maroon-dark">{o.name}</p>
                <p className="mt-1 text-xs text-ink/50">{o.email}</p>
                <p className="text-xs text-ink/50">{o.phone}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                  ทรัพย์ที่ถือครอง ({owned.length})
                </p>
                <ul className="mt-2 space-y-1.5">
                  {owned.map((p) => (
                    <li key={p.slug} className="text-sm text-ink/70">
                      {p.name}
                    </li>
                  ))}
                  {owned.length === 0 && (
                    <li className="text-sm text-ink/40">ยังไม่มีทรัพย์</li>
                  )}
                </ul>
              </div>
            );
          })}
          {owners.length === 0 && (
            <p className="col-span-full rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
              ยังไม่มีเจ้าของทรัพย์ลงทะเบียนในระบบ
            </p>
          )}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="ยืนยันลบทรัพย์"
        message={`ยืนยันลบทรัพย์ "${deleteTarget?.name}" ออกจากระบบ? การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบทรัพย์"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function PropertyRow({
  property,
  owners,
  deleting,
  onDelete,
}: {
  property: Property;
  owners: Owner[];
  deleting: boolean;
  onDelete: () => void;
}) {
  const owner = owners.find((o) => o.id === property.ownerId);

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
          {property.images[0] && (
            <Image src={property.images[0]} alt={property.name} fill sizes="96px" className="object-cover" />
          )}
        </div>
        <div className="min-w-[180px] flex-1">
          <p className="font-medium text-maroon-dark">{property.name}</p>
          <p className="text-xs text-ink/50">
            {property.type} · {property.district} · Tier {property.tier} · เจ้าของ: {owner?.name ?? "ไม่ระบุ"}
          </p>
        </div>
        <span className="rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-maroon-dark">
          {statusLabel(property.status)}
        </span>
        <div className="text-sm text-ink/70">
          {property.salePrice && <p>{formatBaht(property.salePrice)}</p>}
          {property.rentPrice && <p className="text-xs text-ink/50">เช่า {formatBaht(property.rentPrice)}/ด.</p>}
        </div>
        <Link
          href={`/admin/properties/${property.slug}/edit`}
          aria-label="แก้ไข"
          className="flex h-9 w-9 items-center justify-center border border-gold-dark text-gold-dark hover:bg-cream-dark"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.75} />
        </Link>
        <button
          onClick={onDelete}
          disabled={deleting}
          aria-label="ลบทรัพย์"
          className="flex h-9 w-9 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          ) : (
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}
