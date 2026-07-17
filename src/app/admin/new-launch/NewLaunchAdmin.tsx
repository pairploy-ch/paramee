"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  insertNewLaunchProject,
  updateNewLaunchProjectBySlug,
  deleteNewLaunchProjectBySlug,
} from "@/lib/data/newLaunchProjects";
import type { NewLaunchProject } from "@/lib/types";

interface FormValues {
  name: string;
  unitTypesCount: string;
  priceMin: string;
  priceMax: string;
  locationHighlight: string;
  rentYieldPrice: string;
  developer: string;
  unitCount: string;
  buildingCount: string;
  completionYear: string;
  latestPromotion: string;
  mapUrl: string;
  commonAreaFacilities: string;
  reservationDeposit: string;
}

const emptyForm: FormValues = {
  name: "",
  unitTypesCount: "",
  priceMin: "",
  priceMax: "",
  locationHighlight: "",
  rentYieldPrice: "",
  developer: "",
  unitCount: "",
  buildingCount: "",
  completionYear: "",
  latestPromotion: "",
  mapUrl: "",
  commonAreaFacilities: "",
  reservationDeposit: "",
};

function projectToForm(p: NewLaunchProject): FormValues {
  return {
    name: p.name,
    unitTypesCount: p.unitTypesCount,
    priceMin: p.priceMin != null ? String(p.priceMin) : "",
    priceMax: p.priceMax != null ? String(p.priceMax) : "",
    locationHighlight: p.locationHighlight,
    rentYieldPrice: p.rentYieldPrice,
    developer: p.developer,
    unitCount: p.unitCount,
    buildingCount: p.buildingCount,
    completionYear: p.completionYear,
    latestPromotion: p.latestPromotion,
    mapUrl: p.mapUrl ?? "",
    commonAreaFacilities: p.commonAreaFacilities,
    reservationDeposit: p.reservationDeposit,
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

export default function NewLaunchAdmin({ initialProjects }: { initialProjects: NewLaunchProject[] }) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ slug: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function startEdit(p: NewLaunchProject) {
    setEditingSlug(p.slug);
    setValues(projectToForm(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setValues(emptyForm);
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
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">โครงการมือ 1</h1>
        <p className="mt-2 text-sm text-ink/60">
          บันทึกข้อมูลหลักของโครงการพรีเซล / มือ 1 สำหรับใช้อ้างอิงภายในทีมงาน
          {!isSupabaseConfigured && " (ต้องเชื่อมต่อ Supabase ก่อนใช้งานฟีเจอร์นี้)"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-gold-light/40 bg-white p-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-maroon-dark">
            {editingSlug ? "แก้ไขโครงการ" : "เพิ่มโครงการใหม่"}
          </h2>
          {editingSlug && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-medium text-ink/50 hover:text-gold-dark"
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </div>

        <Field label="ชื่อโครงการ">
          <input required value={values.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
        </Field>
        <Field label="โครงการนั้นมีกี่แบบ">
          <input value={values.unitTypesCount} onChange={(e) => update("unitTypesCount", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ผู้พัฒนาโครงการ (Developer)">
          <input value={values.developer} onChange={(e) => update("developer", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ราคาเริ่มต้น (บาท)">
          <input type="number" value={values.priceMin} onChange={(e) => update("priceMin", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ราคาสูงสุด (บาท)">
          <input type="number" value={values.priceMax} onChange={(e) => update("priceMax", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ปล่อยเช่าได้ในราคา (Yield)">
          <input value={values.rentYieldPrice} onChange={(e) => update("rentYieldPrice", e.target.value)} placeholder="เช่น 18,000 บาท/เดือน" className={inputClass} />
        </Field>
        <Field label="จำนวนยูนิต">
          <input value={values.unitCount} onChange={(e) => update("unitCount", e.target.value)} className={inputClass} />
        </Field>
        <Field label="จำนวนอาคาร">
          <input value={values.buildingCount} onChange={(e) => update("buildingCount", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ปีที่สร้างเสร็จ">
          <input value={values.completionYear} onChange={(e) => update("completionYear", e.target.value)} className={inputClass} />
        </Field>
        <Field label="เงินจอง / เงินดาวน์">
          <input value={values.reservationDeposit} onChange={(e) => update("reservationDeposit", e.target.value)} className={inputClass} />
        </Field>
        <Field label="ลิงก์ Google Maps">
          <input type="url" value={values.mapUrl} onChange={(e) => update("mapUrl", e.target.value)} placeholder="https://maps.app.goo.gl/..." className={inputClass} />
        </Field>
        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="จุดเด่นของทำเล">
            <textarea rows={2} value={values.locationHighlight} onChange={(e) => update("locationHighlight", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="ส่วนกลาง">
            <textarea rows={2} value={values.commonAreaFacilities} onChange={(e) => update("commonAreaFacilities", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <Field label="โปรโมชั่นล่าสุด">
            <textarea rows={2} value={values.latestPromotion} onChange={(e) => update("latestPromotion", e.target.value)} className={inputClass} />
          </Field>
        </div>

        {error && <p className="sm:col-span-2 lg:col-span-3 text-sm text-red-600">{error}</p>}

        <div className="sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={submitting || !values.name}
            className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "กำลังบันทึก..." : editingSlug ? "บันทึกการแก้ไข" : "เพิ่มโครงการ"}
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">ชื่อโครงการ</th>
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
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  ยังไม่มีโครงการมือ 1 ในระบบ
                </td>
              </tr>
            ) : (
              initialProjects.map((p) => (
                <tr key={p.slug} className="border-t border-cream-dark">
                  <td className="px-4 py-3 font-medium text-maroon-dark">{p.name}</td>
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
