"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Download, Loader2 } from "lucide-react";
import { propertyAreas, propertyTypes } from "@/lib/properties";
import { formatBaht, propertyTypeLabel, statusLabel } from "@/lib/format";
import type { Property, PropertyStatus } from "@/lib/types";
import type { Owner } from "@/lib/owners";
import ConfirmModal from "@/components/ConfirmModal";
import SelectDropdown from "@/components/SelectDropdown";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { deletePropertyBySlug, updatePropertyBySlug } from "@/lib/data/properties";
import { useProperties } from "@/lib/propertyStore";
import { propertyStatuses } from "@/components/PropertyForm";

const MIN_PRICE = 0;
const MAX_PRICE = 50_000_000;

function toCsv(rows: Property[], ownerName: (id: string) => string) {
  const header = ["ชื่อ", "ประเภททรัพย์", "ประเภทประกาศ", "ทำเล", "สถานะ", "เทียร์", "ราคาขาย", "ราคาเช่า", "เจ้าของ"];
  const lines = rows.map((p) =>
    [
      p.name,
      p.type,
      p.listingType,
      p.district,
      statusLabel(p.status),
      p.tier,
      p.salePrice ?? "",
      p.rentPrice ?? "",
      ownerName(p.ownerId),
    ]
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
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ทั้งหมด" | Property["type"]>("ทั้งหมด");
  const [areaFilter, setAreaFilter] = useState("ทั้งหมด");
  const [districtFilter, setDistrictFilter] = useState("ทั้งหมด");
  const [purposeFilter, setPurposeFilter] = useState<"ทั้งหมด" | "ซื้อ" | "เช่า">("ทั้งหมด");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusSavingSlug, setStatusSavingSlug] = useState<string | null>(null);

  const ownerById = (id: string) => owners.find((o) => o.id === id);
  const ownerName = (id: string) => ownerById(id)?.name ?? "ไม่ระบุ";

  const districts = useMemo(
    () => Array.from(new Set(properties.map((p) => p.district))),
    [properties]
  );

  const filtered = properties.filter((p) => {
    if (typeFilter !== "ทั้งหมด" && p.type !== typeFilter) return false;
    if (areaFilter !== "ทั้งหมด" && p.area !== areaFilter) return false;
    if (districtFilter !== "ทั้งหมด" && p.district !== districtFilter) return false;
    const includesSale = p.listingType === "ขาย" || p.listingType === "เช่า + ขาย";
    const includesRent = p.listingType === "เช่า" || p.listingType === "เช่า + ขาย";
    if (purposeFilter === "ซื้อ" && !(includesSale && p.salePrice)) return false;
    if (purposeFilter === "เช่า" && !(includesRent && p.rentPrice)) return false;
    const effectivePrice =
      purposeFilter === "เช่า"
        ? p.rentPrice ?? 0
        : purposeFilter === "ซื้อ"
          ? p.salePrice ?? 0
          : p.salePrice ?? p.rentPrice ?? 0;
    if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

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

  async function handleStatusChange(slug: string, status: PropertyStatus) {
    setStatusSavingSlug(slug);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      await updatePropertyBySlug(supabase, slug, { status });
      router.refresh();
    } else {
      localStore.updateProperty(slug, { status });
    }
    setStatusSavingSlug(null);
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
          <div className="mb-4 grid gap-4 border border-gold-light/40 bg-white p-5 sm:grid-cols-2 lg:grid-cols-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ค้นหาชื่อโครงการ</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ชื่อโครงการ..."
                className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ประเภททรัพย์</label>
              <SelectDropdown
                value={typeFilter}
                onChange={(v) => setTypeFilter(v as typeof typeFilter)}
                options={[
                  { value: "ทั้งหมด", label: "ทั้งหมด" },
                  ...propertyTypes.map((pt) => ({ value: pt, label: propertyTypeLabel(pt) })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">พื้นที่</label>
              <SelectDropdown
                value={areaFilter}
                onChange={setAreaFilter}
                options={[
                  { value: "ทั้งหมด", label: "ทั้งหมด" },
                  ...propertyAreas.map((a) => ({ value: a, label: a })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ทำเล</label>
              <SelectDropdown
                value={districtFilter}
                onChange={setDistrictFilter}
                options={[
                  { value: "ทั้งหมด", label: "ทั้งหมด" },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">วัตถุประสงค์</label>
              <SelectDropdown
                value={purposeFilter}
                onChange={(v) => setPurposeFilter(v as typeof purposeFilter)}
                options={[
                  { value: "ทั้งหมด", label: "ทั้งหมด" },
                  { value: "ซื้อ", label: "ซื้อ" },
                  { value: "เช่า", label: "เช่า" },
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/60">ช่วงราคา (บาท)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={100_000}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="ต่ำสุด"
                  className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <span className="text-ink/40">—</span>
                <input
                  type="number"
                  min={0}
                  step={100_000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                  placeholder="สูงสุด"
                  className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-ink/50">พบ {filtered.length} รายการ จากทั้งหมด {properties.length} รายการ</p>
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
                statusSaving={statusSavingSlug === p.slug}
                onStatusChange={(status) => handleStatusChange(p.slug, status)}
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
  statusSaving,
  onStatusChange,
}: {
  property: Property;
  owners: Owner[];
  deleting: boolean;
  onDelete: () => void;
  statusSaving: boolean;
  onStatusChange: (status: PropertyStatus) => void;
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
            {property.listingType} · {property.type} · {property.district} · Tier {property.tier} · เจ้าของ:{" "}
            {owner?.name ?? "ไม่ระบุ"}
          </p>
        </div>
        <select
          value={property.status}
          onChange={(e) => onStatusChange(e.target.value as PropertyStatus)}
          disabled={statusSaving}
          className="rounded-full border-0 bg-cream-dark px-3 py-1 text-xs font-semibold text-maroon-dark outline-none disabled:opacity-50"
        >
          {propertyStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
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
