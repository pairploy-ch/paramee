"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import SelectDropdown from "@/components/SelectDropdown";
import NewLaunchCaptionGenerator from "./NewLaunchCaptionGenerator";
import { emptyNewLaunchFormValues, projectToFormValues, type NewLaunchFormValues } from "./formValues";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  insertNewLaunchProject,
  updateNewLaunchProjectBySlug,
  deleteNewLaunchProjectBySlug,
} from "@/lib/data/newLaunchProjects";
import { propertyTypes } from "@/lib/properties";
import { newLaunchRegions } from "@/lib/types";
import type { NewLaunchProject, NewLaunchRegion, PropertyType } from "@/lib/types";

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

export default function NewLaunchAdmin({ initialProjects }: { initialProjects: NewLaunchProject[] }) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [values, setValues] = useState<NewLaunchFormValues>(emptyNewLaunchFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function update<K extends keyof NewLaunchFormValues>(key: K, value: NewLaunchFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
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

  function startEdit(p: NewLaunchProject) {
    setEditingSlug(p.slug);
    setValues(projectToFormValues(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setValues(emptyNewLaunchFormValues);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("ฟีเจอร์นี้ต้องเชื่อมต่อ Supabase ก่อนใช้งาน");
      return;
    }
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const input = {
      name: values.name,
      projectCode: values.projectCode.trim(),
      projectType: values.projectType,
      region: values.region || null,
      unitTypesCount: values.unitTypesCount,
      priceMin: values.priceMin.trim() === "" ? null : Number(values.priceMin),
      priceMax: values.priceMax.trim() === "" ? null : Number(values.priceMax),
      locationHighlight: values.locationHighlight,
      rentYieldPrice: values.rentYieldPrice,
      developer: values.developer,
      unitCount: values.unitCount,
      buildingCount: values.buildingCount,
      completionYear: values.completionYear,
      latestPromotion: values.latestPromotion,
      mapUrl: values.mapUrl.trim() || null,
      commonAreaFacilities: values.commonAreaFacilities,
      reservationDeposit: values.reservationDeposit,
      images: values.images.map((i) => i.trim()).filter(Boolean),
    };

    const { error: saveError } = editingSlug
      ? await updateNewLaunchProjectBySlug(supabase, editingSlug, input)
      : await insertNewLaunchProject(supabase, input);

    setSubmitting(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    cancelEdit();
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget || !isSupabaseConfigured) return;
    setDeleting(true);
    const supabase = createClient();
    await deleteNewLaunchProjectBySlug(supabase, deleteTarget.slug);
    setDeleting(false);
    setDeleteTarget(null);
    if (editingSlug === deleteTarget.slug) cancelEdit();
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">โครงการมือ 1</h1>
          <p className="mt-2 text-sm text-ink/60">
            กรอกข้อมูลหลักของโครงการพรีเซล / มือ 1 ระบบจะบันทึกเข้าระบบทันที
            {!isSupabaseConfigured && " (ต้องเชื่อมต่อ Supabase ก่อนใช้งานฟีเจอร์นี้)"}
          </p>
        </div>
        {editingSlug && (
          <button
            type="button"
            onClick={cancelEdit}
            className="border border-cream-dark px-4 py-2 text-sm font-medium text-ink/60 hover:border-gold-dark hover:text-gold-dark"
          >
            ยกเลิกการแก้ไข
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ข้อมูลโครงการ</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="ชื่อโครงการ">
                <input
                  required
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="รหัสโครงการ (สำหรับอ้างอิง)">
                <input
                  value={values.projectCode}
                  onChange={(e) => update("projectCode", e.target.value)}
                  placeholder="เช่น NLP001"
                  className={inputClass}
                />
              </Field>
              <Field label="ประเภทโครงการ">
                <SelectDropdown
                  value={values.projectType}
                  onChange={(v) => update("projectType", v as PropertyType)}
                  options={propertyTypes.map((pt) => ({ value: pt, label: pt }))}
                />
              </Field>
              <Field label="ทำเล">
                <SelectDropdown
                  value={values.region}
                  onChange={(v) => update("region", v as NewLaunchRegion | "")}
                  options={[
                    { value: "", label: "— เลือกทำเล —" },
                    ...newLaunchRegions.map((r) => ({ value: r, label: r })),
                  ]}
                />
              </Field>
              <Field label="ผู้พัฒนาโครงการ (Developer)">
                <input
                  value={values.developer}
                  onChange={(e) => update("developer", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="โครงการนั้นมีกี่แบบ">
                <input
                  value={values.unitTypesCount}
                  onChange={(e) => update("unitTypesCount", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="จำนวนยูนิต">
                <input
                  value={values.unitCount}
                  onChange={(e) => update("unitCount", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="จำนวนอาคาร">
                <input
                  value={values.buildingCount}
                  onChange={(e) => update("buildingCount", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="ปีที่สร้างเสร็จ">
                <input
                  value={values.completionYear}
                  onChange={(e) => update("completionYear", e.target.value)}
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
              <div className="sm:col-span-2">
                <Field label="จุดเด่นของทำเล">
                  <textarea
                    rows={3}
                    value={values.locationHighlight}
                    onChange={(e) => update("locationHighlight", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">ราคา</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="ราคาเริ่มต้น (บาท)">
                <input
                  type="number"
                  value={values.priceMin}
                  onChange={(e) => update("priceMin", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="ราคาสูงสุด (บาท)">
                <input
                  type="number"
                  value={values.priceMax}
                  onChange={(e) => update("priceMax", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="สามารถปล่อยเช่าได้ในราคา (Yield)">
                <input
                  value={values.rentYieldPrice}
                  onChange={(e) => update("rentYieldPrice", e.target.value)}
                  placeholder="เช่น 18,000 บาท/เดือน"
                  className={inputClass}
                />
              </Field>
              <Field label="เงินจอง / เงินดาวน์">
                <input
                  value={values.reservationDeposit}
                  onChange={(e) => update("reservationDeposit", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
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

          <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">รายละเอียดเพิ่มเติม</h2>
            <div className="mt-4 grid gap-4">
              <Field label="ส่วนกลาง">
                <textarea
                  rows={3}
                  value={values.commonAreaFacilities}
                  onChange={(e) => update("commonAreaFacilities", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="โปรโมชั่นล่าสุด">
                <textarea
                  rows={3}
                  value={values.latestPromotion}
                  onChange={(e) => update("latestPromotion", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !values.name}
            className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "กำลังบันทึก..." : editingSlug ? "บันทึกการแก้ไข" : "เพิ่มโครงการ"}
          </button>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <NewLaunchCaptionGenerator values={values} />
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">ชื่อโครงการ</th>
              <th className="px-4 py-3">ประเภท / ทำเล</th>
              <th className="px-4 py-3">Developer</th>
              <th className="px-4 py-3">ช่วงราคา</th>
              <th className="px-4 py-3">จำนวนยูนิต</th>
              <th className="px-4 py-3">ปีที่สร้างเสร็จ</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {initialProjects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                  ยังไม่มีโครงการมือ 1 ในระบบ
                </td>
              </tr>
            ) : (
              initialProjects.map((p) => (
                <tr key={p.slug} className="border-t border-cream-dark">
                  <td className="px-4 py-3 font-medium text-maroon-dark">
                    {p.name}
                    {p.projectCode && <span className="ml-1.5 text-xs font-normal text-ink/40">({p.projectCode})</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.projectType}
                    {p.region && ` · ${p.region}`}
                  </td>
                  <td className="px-4 py-3">{p.developer || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.priceMin != null || p.priceMax != null
                      ? `${p.priceMin?.toLocaleString() ?? "-"} - ${p.priceMax?.toLocaleString() ?? "-"}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{p.unitCount || "-"}</td>
                  <td className="px-4 py-3">{p.completionYear || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        aria-label="แก้ไข"
                        className="border border-cream-dark p-1.5 text-ink/50 hover:border-gold-dark hover:text-gold-dark"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ slug: p.slug, name: p.name })}
                        aria-label="ลบ"
                        className="border border-cream-dark p-1.5 text-ink/50 hover:border-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="ยืนยันลบโครงการ"
        message={`ยืนยันลบโครงการ "${deleteTarget?.name}" ออกจากระบบ? การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบโครงการ"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
