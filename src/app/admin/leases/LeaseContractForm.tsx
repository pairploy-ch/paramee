"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { insertLeaseContract, updateLeaseContractById } from "@/lib/data/leaseContracts";
import { emptyLeaseFormValues, formValuesToInput, type LeaseFormValues } from "./formValues";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
      <h2 className="font-heading text-lg font-semibold text-maroon-dark">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function LeaseContractForm({
  contractId,
  initialValues,
}: {
  contractId?: string;
  initialValues?: LeaseFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<LeaseFormValues>(initialValues ?? emptyLeaseFormValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof LeaseFormValues>(key: K, value: LeaseFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateChecklistItem(index: number, patch: Partial<LeaseFormValues["checklistItems"][number]>) {
    setValues((v) => ({
      ...v,
      checklistItems: v.checklistItems.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function addChecklistRow() {
    setValues((v) => ({
      ...v,
      checklistItems: [...v.checklistItems, { name: "", ready: false, value: "", detail: "" }],
    }));
  }

  function removeChecklistRow(index: number) {
    setValues((v) => ({ ...v, checklistItems: v.checklistItems.filter((_, i) => i !== index) }));
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
    const input = formValuesToInput(values);

    const { error: saveError } = contractId
      ? await updateLeaseContractById(supabase, contractId, input)
      : await insertLeaseContract(supabase, input);

    setSubmitting(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push("/admin/leases");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/leases"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-maroon-dark"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> กลับไปหน้ารายการสัญญาเช่า
        </Link>
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">
          {contractId ? "แก้ไขสัญญาเช่า" : "เพิ่มสัญญาเช่า"}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          กรอกข้อมูลตามช่องที่ไฮไลท์สีเหลืองในต้นฉบับสัญญาเช่า Paramee Asset
          {!isSupabaseConfigured && " (ต้องเชื่อมต่อ Supabase ก่อนใช้งานฟีเจอร์นี้)"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="โครงการ / ห้องพัก">
          <Field label="ชื่อโครงการ">
            <input value={values.projectName} onChange={(e) => update("projectName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ที่อยู่โครงการ">
            <input value={values.projectAddress} onChange={(e) => update("projectAddress", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เลขห้อง">
            <input value={values.roomNumber} onChange={(e) => update("roomNumber", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ตึก">
            <input value={values.building} onChange={(e) => update("building", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ชั้น">
            <input value={values.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass} />
          </Field>
        </Section>

        <Section title="ผู้ให้เช่า (The Lessor)">
          <Field label="ชื่อผู้ให้เช่า">
            <input value={values.lessorName} onChange={(e) => update("lessorName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เลขบัตรประชาชนผู้ให้เช่า">
            <input value={values.lessorIdCard} onChange={(e) => update("lessorIdCard", e.target.value)} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ที่อยู่ผู้ให้เช่า">
              <input value={values.lessorAddress} onChange={(e) => update("lessorAddress", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="ผู้เช่า (The Lessee)">
          <Field label="ชื่อผู้เช่า">
            <input value={values.lesseeName} onChange={(e) => update("lesseeName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เลขบัตรประชาชนผู้เช่า">
            <input value={values.lesseeIdCard} onChange={(e) => update("lesseeIdCard", e.target.value)} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ที่อยู่ผู้เช่า">
              <input value={values.lesseeAddress} onChange={(e) => update("lesseeAddress", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="รายละเอียดสัญญา">
          <Field label="วันที่ทำสัญญา">
            <input type="date" value={values.contractDate} onChange={(e) => update("contractDate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="จำนวนปี">
            <input type="number" min={0} step="0.5" value={values.contractYears} onChange={(e) => update("contractYears", e.target.value)} className={inputClass} />
          </Field>
          <Field label="วันที่เริ่มสัญญา">
            <input type="date" value={values.startDate} onChange={(e) => update("startDate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="วันที่สิ้นสุดสัญญา">
            <input type="date" value={values.endDate} onChange={(e) => update("endDate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ค่าเช่าต่อเดือน (บาท)">
            <input type="number" min={0} value={values.rentPerMonth} onChange={(e) => update("rentPerMonth", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ชำระล่าช้าเกินวันที่ (ของทุกเดือน)">
            <input value={values.paymentDueDay} onChange={(e) => update("paymentDueDay", e.target.value)} placeholder="เช่น 5" className={inputClass} />
          </Field>
        </Section>

        <Section title="การชำระค่าเช่า (โอนเข้าบัญชี)">
          <Field label="ธนาคาร">
            <input value={values.bankName} onChange={(e) => update("bankName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เลขที่บัญชี">
            <input value={values.bankAccountNumber} onChange={(e) => update("bankAccountNumber", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ชื่อบัญชี">
            <input value={values.bankAccountName} onChange={(e) => update("bankAccountName", e.target.value)} className={inputClass} />
          </Field>
        </Section>

        <Section title="เงินประกัน / ค่าใช้จ่ายอื่นๆ">
          <Field label="จำนวนเงินประกัน (บาท)">
            <input type="number" min={0} value={values.depositAmount} onChange={(e) => update("depositAmount", e.target.value)} className={inputClass} />
          </Field>
          <Field label="ค่าทำความสะอาด (บาท)">
            <input type="number" min={0} value={values.cleaningFee} onChange={(e) => update("cleaningFee", e.target.value)} className={inputClass} />
          </Field>
        </Section>

        <Section title="ใบเสร็จรับเงินมัดจำจอง / เงินประกัน">
          <Field label="วันที่ทำใบเสร็จ">
            <input type="date" value={values.receiptDate} onChange={(e) => update("receiptDate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เงินมัดจำจอง (ค่าเช่าล่วงหน้า 1 เดือน)">
            <input type="number" min={0} value={values.reservationDepositAmount} onChange={(e) => update("reservationDepositAmount", e.target.value)} className={inputClass} />
          </Field>
          <Field label="เงินประกันความเสียหาย (ค่าเช่า 2 เดือน)">
            <input type="number" min={0} value={values.damageDepositAmount} onChange={(e) => update("damageDepositAmount", e.target.value)} className={inputClass} />
          </Field>
        </Section>

        <div className="rounded-2xl border border-gold-light/40 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-maroon-dark">
              เอกสารแนบท้ายสัญญา — Checklist อุปกรณ์ / เฟอร์นิเจอร์
            </h2>
            <button
              type="button"
              onClick={addChecklistRow}
              className="border border-gold-dark px-3 py-1.5 text-xs font-medium text-gold-dark hover:bg-cream-dark"
            >
              + เพิ่มรายการ
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="py-2 pr-3">รายการ</th>
                  <th className="py-2 pr-3">พร้อมใช้งาน</th>
                  <th className="py-2 pr-3">มูลค่าต่อหน่วย</th>
                  <th className="py-2 pr-3">รายละเอียด</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {values.checklistItems.map((item, i) => (
                  <tr key={i} className="border-t border-cream-dark">
                    <td className="py-2 pr-3">
                      <input
                        value={item.name}
                        onChange={(e) => updateChecklistItem(i, { name: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="checkbox"
                        checked={item.ready}
                        onChange={(e) => updateChecklistItem(i, { ready: e.target.checked })}
                        className="h-4 w-4 accent-maroon"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        value={item.value}
                        onChange={(e) => updateChecklistItem(i, { value: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        value={item.detail}
                        onChange={(e) => updateChecklistItem(i, { detail: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        aria-label="ลบรายการ"
                        onClick={() => removeChecklistRow(i)}
                        className="text-ink/40 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-maroon px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : contractId ? "บันทึกการแก้ไข" : "บันทึกสัญญาเช่า"}
        </button>
      </form>
    </div>
  );
}
