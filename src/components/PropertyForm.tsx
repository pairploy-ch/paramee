"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { propertyTypes } from "@/lib/properties";
import { thaiProvinces } from "@/lib/thaiProvinces";
import { landDeedTypes, landDeedColorClass } from "@/lib/landDeedTypes";
import type {
  Property,
  PropertyStatus,
  PropertyTier,
  PropertyType,
  TransitLine,
  LandTransferFeeParty,
} from "@/lib/types";
import { landTransferFeeParties } from "@/lib/types";
import type { Owner } from "@/lib/owners";

interface TransitFormRow {
  station: string;
  line: TransitLine;
  distanceMeters: string;
}

interface LeaseTermFormRow {
  duration: string;
  price: string;
}

const statuses: PropertyStatus[] = ["Available", "Reserved", "Sold", "For Rent"];
const transitLines: TransitLine[] = ["BTS", "MRT", "ARL"];
const yesNoOptions = ["มี", "ไม่มี"];

export interface PropertyFormValues {
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  tier: PropertyTier;
  address: string;
  district: string;
  mapUrl: string;
  description: string;
  remarks: string;
  salePrice: string;
  rentPrice: string;
  leaseTerms: LeaseTermFormRow[];
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  facing: string;
  landDeedType: string;
  landTransferFeeParty: LandTransferFeeParty | "";
  images: string[];
  commonFeePerSqm: string;
  avgRentInArea: string;
  transferFeeEstimate: string;
  transit: TransitFormRow[];
  roiPercent: string;
  rentalYieldPercent: string;
  occupancyPercent: string;
  cashflowPerMonth: string;
  ownerId: string;
}

export const emptyPropertyFormValues: PropertyFormValues = {
  name: "",
  type: "คอนโด",
  status: "Available",
  tier: 2,
  address: "",
  district: "",
  mapUrl: "",
  description: "",
  remarks: "",
  salePrice: "",
  rentPrice: "",
  leaseTerms: [],
  areaSqm: "",
  bedrooms: "1",
  bathrooms: "1",
  floor: "",
  facing: "",
  landDeedType: "",
  landTransferFeeParty: "",
  images: [""],
  commonFeePerSqm: "",
  avgRentInArea: "",
  transferFeeEstimate: "",
  transit: [{ station: "", line: "BTS", distanceMeters: "" }],
  roiPercent: "",
  rentalYieldPercent: "",
  occupancyPercent: "",
  cashflowPerMonth: "",
  ownerId: "",
};

export function valuesToProperty(v: PropertyFormValues): Omit<Property, "slug"> {
  const num = (s: string) => (s.trim() === "" ? 0 : Number(s));
  const isLand = v.type === "ที่ดิน";
  return {
    ownerId: v.ownerId,
    tier: v.tier,
    name: v.name,
    type: v.type,
    address: v.address,
    district: v.district,
    mapUrl: v.mapUrl.trim() || null,
    status: v.status,
    salePrice: v.salePrice.trim() === "" ? null : Number(v.salePrice),
    rentPrice: v.rentPrice.trim() === "" ? null : Number(v.rentPrice),
    areaSqm: num(v.areaSqm),
    bedrooms: num(v.bedrooms),
    bathrooms: num(v.bathrooms),
    floor: v.floor,
    facing: v.facing,
    images: v.images.map((i) => i.trim()).filter(Boolean),
    commonFeePerSqm: num(v.commonFeePerSqm),
    avgRentInArea: num(v.avgRentInArea),
    transferFeeEstimate: num(v.transferFeeEstimate),
    transit: v.transit
      .filter((row) => row.station.trim())
      .map((row) => ({ station: row.station, line: row.line, distanceMeters: num(row.distanceMeters) })),
    investor: {
      roiPercent: num(v.roiPercent),
      rentalYieldPercent: num(v.rentalYieldPercent),
      occupancyPercent: num(v.occupancyPercent),
      cashflowPerMonth: num(v.cashflowPerMonth),
    },
    description: v.description,
    remarks: v.remarks,
    leaseTerms: v.leaseTerms
      .filter((row) => row.duration.trim())
      .map((row) => ({ duration: `${row.duration.trim()} ปี`, price: num(row.price) })),
    landDeedType: isLand ? v.landDeedType.trim() || null : null,
    landTransferFeeParty: isLand ? v.landTransferFeeParty || null : null,
  };
}

export function propertyToFormValues(p: Property): PropertyFormValues {
  return {
    name: p.name,
    type: p.type,
    status: p.status,
    tier: p.tier,
    address: p.address,
    district: p.district,
    mapUrl: p.mapUrl ?? "",
    description: p.description,
    remarks: p.remarks ?? "",
    salePrice: p.salePrice != null ? String(p.salePrice) : "",
    rentPrice: p.rentPrice != null ? String(p.rentPrice) : "",
    leaseTerms: (p.leaseTerms ?? []).map((l) => ({
      duration: l.duration.replace(/\s*ปี\s*$/, ""),
      price: String(l.price),
    })),
    areaSqm: String(p.areaSqm),
    bedrooms: String(p.bedrooms),
    bathrooms: String(p.bathrooms),
    floor: p.floor,
    facing: p.facing,
    landDeedType: p.landDeedType ?? "",
    landTransferFeeParty: p.landTransferFeeParty ?? "",
    images: p.images.length ? p.images : [""],
    commonFeePerSqm: String(p.commonFeePerSqm),
    avgRentInArea: String(p.avgRentInArea),
    transferFeeEstimate: String(p.transferFeeEstimate),
    transit: p.transit.length
      ? p.transit.map((t) => ({ station: t.station, line: t.line, distanceMeters: String(t.distanceMeters) }))
      : [{ station: "", line: "BTS", distanceMeters: "" }],
    roiPercent: String(p.investor.roiPercent),
    rentalYieldPercent: String(p.investor.rentalYieldPercent),
    occupancyPercent: String(p.investor.occupancyPercent),
    cashflowPerMonth: String(p.investor.cashflowPerMonth),
    ownerId: p.ownerId,
  };
}

const inputClass =
  "w-full border border-cream-dark bg-cream px-3 py-2 text-sm outline-none focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink/60">{label}</label>
      {children}
    </div>
  );
}

export default function PropertyForm({
  owners,
  ownerLocked,
  onSubmit,
  submitLabel = "บันทึกทรัพย์",
  initialProperty,
  resetOnSuccess = true,
  children,
}: {
  /** Admin mode: pass the list of owners to choose from. */
  owners?: Owner[];
  /** Owner mode: the property is always attributed to this signed-in owner. */
  ownerLocked?: { id: string; name: string };
  onSubmit: (property: Omit<Property, "slug">) => Promise<{ error?: string; slug?: string } | void>;
  submitLabel?: string;
  /** Edit mode: pre-fills the form with an existing property's values. */
  initialProperty?: Property;
  /** Set to false in edit mode so a successful save doesn't blank the form. */
  resetOnSuccess?: boolean;
  /** Optional extra panel rendered next to the form (e.g. admin's caption preview). */
  children?: (values: PropertyFormValues) => React.ReactNode;
}) {
  const [values, setValues] = useState<PropertyFormValues>(() =>
    initialProperty
      ? propertyToFormValues(initialProperty)
      : { ...emptyPropertyFormValues, ownerId: ownerLocked?.id ?? "" }
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function update<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSuccess(false);
    setSavedSlug(null);
  }

  function updateImage(index: number, value: string) {
    setValues((v) => ({ ...v, images: v.images.map((img, i) => (i === index ? value : img)) }));
  }

  function addImageRow() {
    setValues((v) => ({ ...v, images: [...v.images, ""] }));
  }

  function removeImageRow(index: number) {
    setValues((v) => ({ ...v, images: v.images.filter((_, i) => i !== index) }));
  }

  function updateTransit<K extends keyof TransitFormRow>(index: number, key: K, value: TransitFormRow[K]) {
    setValues((v) => ({
      ...v,
      transit: v.transit.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));
  }

  function addTransitRow() {
    setValues((v) => ({
      ...v,
      transit: [...v.transit, { station: "", line: "BTS", distanceMeters: "" }],
    }));
  }

  function removeTransitRow(index: number) {
    setValues((v) => ({ ...v, transit: v.transit.filter((_, i) => i !== index) }));
  }

  function updateLeaseTerm<K extends keyof LeaseTermFormRow>(
    index: number,
    key: K,
    value: LeaseTermFormRow[K]
  ) {
    setValues((v) => ({
      ...v,
      leaseTerms: v.leaseTerms.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));
  }

  function addLeaseTermRow() {
    setValues((v) => ({ ...v, leaseTerms: [...v.leaseTerms, { duration: "", price: "" }] }));
  }

  function removeLeaseTermRow(index: number) {
    setValues((v) => ({ ...v, leaseTerms: v.leaseTerms.filter((_, i) => i !== index) }));
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError("");

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error ?? "อัปโหลดรูปไม่สำเร็จ");
          continue;
        }
        setValues((v) => ({
          ...v,
          images: [...v.images.filter((img) => img.trim()), data.url],
        }));
      } catch {
        setUploadError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
      }
    }

    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const property = valuesToProperty(values);
    const result = await onSubmit(property);
    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setSavedSlug(result?.slug ?? null);
    if (resetOnSuccess) {
      setValues({ ...emptyPropertyFormValues, ownerId: ownerLocked?.id ?? "" });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลพื้นฐาน</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="ชื่อโครงการ">
              <input
                required
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="ประเภททรัพย์">
              <select
                value={values.type}
                onChange={(e) => update("type", e.target.value as PropertyType)}
                className={inputClass}
              >
                {propertyTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="สถานะ">
              <select
                value={values.status}
                onChange={(e) => update("status", e.target.value as PropertyStatus)}
                className={inputClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            {owners && (
              <Field label="เทียร์ทรัพย์">
                <select
                  value={values.tier}
                  onChange={(e) => update("tier", Number(e.target.value) as PropertyTier)}
                  className={inputClass}
                >
                  <option value={1}>Tier 1 (พรีเมียม)</option>
                  <option value={2}>Tier 2 (มาตรฐาน)</option>
                  <option value={3}>Tier 3 (ทั่วไป)</option>
                </select>
              </Field>
            )}
            <Field label="จังหวัด">
              <select
                required
                value={values.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              >
                <option value="">— เลือกจังหวัด —</option>
                {thaiProvinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ทำเล / เขต">
              <input
                required
                value={values.district}
                onChange={(e) => update("district", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="ลิงก์ Google Maps">
              <input
                type="url"
                value={values.mapUrl}
                onChange={(e) => update("mapUrl", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={inputClass}
              />
            </Field>
            {owners && (
              <Field label="เจ้าของทรัพย์">
                <select
                  required
                  value={values.ownerId}
                  onChange={(e) => update("ownerId", e.target.value)}
                  className={inputClass}
                >
                  <option value="">— เลือกเจ้าของ —</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {ownerLocked && (
              <Field label="เจ้าของทรัพย์">
                <input value={ownerLocked.name} disabled className={`${inputClass} opacity-60`} />
              </Field>
            )}
            <div className="sm:col-span-2">
              <Field label="รายละเอียดทรัพย์">
                <textarea
                  required
                  rows={3}
                  value={values.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="หมายเหตุ">
                <textarea
                  rows={2}
                  value={values.remarks}
                  onChange={(e) => update("remarks", e.target.value)}
                  placeholder="เช่น ไม่รับคนสูบบุหรี่"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">ราคา</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="ราคาขาย (บาท)">
              <input
                type="number"
                value={values.salePrice}
                onChange={(e) => update("salePrice", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="ราคาเช่า / เดือน (บาท)">
              <input
                type="number"
                value={values.rentPrice}
                onChange={(e) => update("rentPrice", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ระยะสัญญาเช่า</h2>
            <button
              type="button"
              onClick={addLeaseTermRow}
              className="flex items-center gap-1 border border-gold-dark px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-cream-dark"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} /> เพิ่มระยะสัญญา
            </button>
          </div>
          {values.leaseTerms.length === 0 ? (
            <p className="mt-3 text-xs text-ink/50">
              เช่น สัญญา 3 ปี ราคา 15,000 บาท และ 1 ปี ราคา 18,000 บาท
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {values.leaseTerms.map((row, i) => (
                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={row.duration}
                      onChange={(e) => updateLeaseTerm(i, "duration", e.target.value)}
                      placeholder="ระยะสัญญา เช่น 3"
                      className={`${inputClass} pr-9`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50">
                      ปี
                    </span>
                  </div>
                  <input
                    value={row.price}
                    onChange={(e) => updateLeaseTerm(i, "price", e.target.value)}
                    placeholder="ราคา (บาท)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    aria-label="ลบระยะสัญญา"
                    onClick={() => removeLeaseTermRow(i)}
                    className="border border-cream-dark px-3 text-ink/40 hover:border-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">รายละเอียดพื้นที่</h2>
          {values.type === "ที่ดิน" ? (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="ขนาดพื้นที่ (ไร่)">
                  <input value={values.areaSqm} onChange={(e) => update("areaSqm", e.target.value)} className={inputClass} />
                </Field>
                <Field label="งาน">
                  <input value={values.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ตร.ว.">
                  <input value={values.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} />
                </Field>
                <Field label="ไฟฟ้า">
                  <select value={values.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass}>
                    <option value="">— เลือก —</option>
                    {yesNoOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="น้ำประปา">
                  <select value={values.facing} onChange={(e) => update("facing", e.target.value)} className={inputClass}>
                    <option value="">— เลือก —</option>
                    {yesNoOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="ประเภทเอกสารสิทธิ์ (โฉนด)">
                  <select
                    value={values.landDeedType}
                    onChange={(e) => update("landDeedType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">— เลือก —</option>
                    {landDeedTypes.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.value}
                      </option>
                    ))}
                  </select>
                  {values.landDeedType && (
                    <span className="mt-1.5 flex items-center gap-1.5 text-xs text-ink/60">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          landDeedColorClass[
                            landDeedTypes.find((d) => d.value === values.landDeedType)?.color ?? "gray"
                          ]
                        }`}
                      />
                      {values.landDeedType}
                    </span>
                  )}
                </Field>
                <Field label="ค่าโอน">
                  <select
                    value={values.landTransferFeeParty}
                    onChange={(e) => update("landTransferFeeParty", e.target.value as LandTransferFeeParty | "")}
                    className={inputClass}
                  >
                    <option value="">— เลือก —</option>
                    {landTransferFeeParties.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="ตร.ม.">
                <input value={values.areaSqm} onChange={(e) => update("areaSqm", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ห้องนอน">
                <input value={values.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ห้องน้ำ">
                <input value={values.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ชั้น">
                <input value={values.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass} />
              </Field>
              <Field label="ทิศ / วิว">
                <input value={values.facing} onChange={(e) => update("facing", e.target.value)} className={inputClass} />
              </Field>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">รูปภาพ</h2>
            <button
              type="button"
              onClick={addImageRow}
              className="flex items-center gap-1 border border-gold-dark px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-cream-dark"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} /> เพิ่มลิงก์รูป
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-gold-light/60 bg-cream-dark/30 p-4">
            <label className="mb-1.5 block text-xs font-semibold text-ink/60">
              อัปโหลดรูปจากเครื่อง (ใส่ลายน้ำโลโก้ + เบอร์ติดต่อ + LINE ให้อัตโนมัติ)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => handleUploadFiles(e.target.files)}
              className="w-full text-xs text-ink/60 file:mr-3 file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-maroon-dark disabled:opacity-50"
            />
            {uploading && <p className="mt-2 text-xs text-ink/50">กำลังอัปโหลดและใส่ลายน้ำ...</p>}
            {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
          </div>

          <div className="mt-4 space-y-3">
            {values.images.map((img, i) => (
              <div key={i} className="flex gap-3">
                <input
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://..."
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  aria-label="ลบรูป"
                  onClick={() => removeImageRow(i)}
                  className="border border-cream-dark px-3 text-ink/40 hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Costs — commented out for now
        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">ค่าใช้จ่าย</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="ค่าส่วนกลาง (บาท/ตร.ม./เดือน)">
              <input value={values.commonFeePerSqm} onChange={(e) => update("commonFeePerSqm", e.target.value)} className={inputClass} />
            </Field>
            <Field label="ค่าเช่าเฉลี่ยในพื้นที่ (บาท/เดือน)">
              <input value={values.avgRentInArea} onChange={(e) => update("avgRentInArea", e.target.value)} className={inputClass} />
            </Field>
            <Field label="ค่าโอนกรรมสิทธิ์โดยประมาณ (บาท)">
              <input value={values.transferFeeEstimate} onChange={(e) => update("transferFeeEstimate", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>
        */}

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ระบบขนส่งและทำเล</h2>
            <button
              type="button"
              onClick={addTransitRow}
              className="flex items-center gap-1 border border-gold-dark px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-cream-dark"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} /> เพิ่มสถานี
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {values.transit.map((row, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-[1fr_140px_140px_auto]">
                <input
                  value={row.station}
                  onChange={(e) => updateTransit(i, "station", e.target.value)}
                  placeholder="สถานีใกล้ที่สุด"
                  className={inputClass}
                />
                <select
                  value={row.line}
                  onChange={(e) => updateTransit(i, "line", e.target.value as TransitLine)}
                  className={inputClass}
                >
                  {transitLines.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <input
                  value={row.distanceMeters}
                  onChange={(e) => updateTransit(i, "distanceMeters", e.target.value)}
                  placeholder="ระยะทาง (เมตร)"
                  className={inputClass}
                />
                <button
                  type="button"
                  aria-label="ลบสถานี"
                  onClick={() => removeTransitRow(i)}
                  className="border border-cream-dark px-3 text-ink/40 hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Investor info — commented out for now
        {owners && (
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลสำหรับนักลงทุน</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <Field label="ROI (%)">
                <input value={values.roiPercent} onChange={(e) => update("roiPercent", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Rental Yield (%)">
                <input value={values.rentalYieldPercent} onChange={(e) => update("rentalYieldPercent", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Occupancy (%)">
                <input value={values.occupancyPercent} onChange={(e) => update("occupancyPercent", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Cashflow / เดือน (บาท)">
                <input value={values.cashflowPerMonth} onChange={(e) => update("cashflowPerMonth", e.target.value)} className={inputClass} />
              </Field>
            </div>
          </div>
        )}
        */}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <p className="text-emerald-700">บันทึกทรัพย์เรียบร้อยแล้ว</p>
            {savedSlug && (
              <a
                href={`/properties/${savedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-maroon-dark underline hover:text-maroon"
              >
                ดูหน้ารายละเอียดทรัพย์ (เหมือนที่ลูกค้าเห็น พร้อมลายน้ำ) ↗
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !values.name}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : submitLabel}
        </button>
      </form>

      {children && <div className="lg:sticky lg:top-24 lg:self-start">{children(values)}</div>}
    </div>
  );
}
