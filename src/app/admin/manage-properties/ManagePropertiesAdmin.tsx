"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, X, Download } from "lucide-react";
import { useProperties } from "@/lib/propertyStore";
import { owners, getOwnerById } from "@/lib/owners";
import { propertyTypes } from "@/lib/properties";
import { formatBaht, statusLabel } from "@/lib/format";
import type { Property, PropertyStatus } from "@/lib/types";
import AdminNav from "@/components/AdminNav";

const DEMO_EMAIL = "admin@paramee.co.th";
const DEMO_PASSWORD = "Admin@2026";

const statuses: PropertyStatus[] = ["Available", "Reserved", "Sold", "For Rent"];

function toCsv(rows: Property[]) {
  const header = ["ชื่อ", "ประเภท", "ทำเล", "สถานะ", "ราคาขาย", "ราคาเช่า", "เจ้าของ"];
  const lines = rows.map((p) =>
    [
      p.name,
      p.type,
      p.district,
      statusLabel(p.status),
      p.salePrice ?? "",
      p.rentPrice ?? "",
      getOwnerById(p.ownerId)?.name ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export default function ManagePropertiesAdmin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"properties" | "owners">("properties");
  const [typeFilter, setTypeFilter] = useState<"ทั้งหมด" | Property["type"]>("ทั้งหมด");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const { properties, overrides, updateProperty } = useProperties();

  const filtered = properties.filter((p) => typeFilter === "ทั้งหมด" || p.type === typeFilter);

  function handleExport() {
    const csv = toCsv(properties);
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paramee-properties-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
        <div className="w-full rounded-2xl border border-gold-light/40 bg-white p-8">
          <h1 className="font-heading text-2xl font-semibold text-maroon-dark">
            Admin: จัดการทรัพย์
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
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <AdminNav />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
            จัดการทรัพย์ / เจ้าของทรัพย์
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            แก้ไขข้อมูลทรัพย์ทั้งหมดในระบบ และดูรายชื่อเจ้าของทรัพย์
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
                isEditing={editingSlug === p.slug}
                updatedAt={overrides[p.slug]?.updatedAt}
                onToggleEdit={() => setEditingSlug(editingSlug === p.slug ? null : p.slug)}
                onSave={(patch) => {
                  updateProperty(p.slug, patch);
                  setEditingSlug(null);
                }}
              />
            ))}
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
        </div>
      )}
    </div>
  );
}

function PropertyRow({
  property,
  isEditing,
  updatedAt,
  onToggleEdit,
  onSave,
}: {
  property: Property;
  isEditing: boolean;
  updatedAt?: string;
  onToggleEdit: () => void;
  onSave: (patch: Partial<Property>) => void;
}) {
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [salePrice, setSalePrice] = useState(String(property.salePrice ?? ""));
  const [rentPrice, setRentPrice] = useState(String(property.rentPrice ?? ""));
  const [description, setDescription] = useState(property.description);
  const [ownerId, setOwnerId] = useState(property.ownerId);

  const owner = getOwnerById(property.ownerId);

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
          <Image src={property.images[0]} alt={property.name} fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-[180px] flex-1">
          <p className="font-medium text-maroon-dark">{property.name}</p>
          <p className="text-xs text-ink/50">
            {property.type} · {property.district} · เจ้าของ: {owner?.name ?? "ไม่ระบุ"}
          </p>
          {updatedAt && (
            <p className="mt-0.5 text-[11px] text-gold-dark">
              แก้ไขล่าสุด {new Date(updatedAt).toLocaleString("th-TH")}
            </p>
          )}
        </div>
        <span className="rounded-full bg-cream-dark px-3 py-1 text-xs font-semibold text-maroon-dark">
          {statusLabel(property.status)}
        </span>
        <div className="text-sm text-ink/70">
          {property.salePrice && <p>{formatBaht(property.salePrice)}</p>}
          {property.rentPrice && <p className="text-xs text-ink/50">เช่า {formatBaht(property.rentPrice)}/ด.</p>}
        </div>
        <button
          onClick={onToggleEdit}
          aria-label="แก้ไข"
          className="flex h-9 w-9 items-center justify-center border border-gold-dark text-gold-dark hover:bg-cream-dark"
        >
          {isEditing ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Pencil className="h-4 w-4" strokeWidth={1.75} />}
        </button>
      </div>

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              status,
              salePrice: salePrice ? Number(salePrice) : null,
              rentPrice: rentPrice ? Number(rentPrice) : null,
              description,
              ownerId,
            });
          }}
          className="mt-4 grid gap-4 border-t border-cream-dark pt-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">สถานะ</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">ราคาขาย (บาท)</label>
            <input
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">ราคาเช่า (บาท/เดือน)</label>
            <input
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">เจ้าของทรัพย์</label>
            <select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">รายละเอียด</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
