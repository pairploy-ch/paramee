"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileDown, Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { deleteLeaseContractById } from "@/lib/data/leaseContracts";
import { formatBaht, formatThaiDate } from "@/lib/format";
import type { LeaseContract } from "@/lib/types";

export default function LeasesAdmin({ initialContracts }: { initialContracts: LeaseContract[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!deleteTarget || !isSupabaseConfigured) return;
    setDeleting(true);
    const supabase = createClient();
    await deleteLeaseContractById(supabase, deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-maroon-dark">ระบบสัญญาเช่า</h1>
          <p className="mt-2 text-sm text-ink/60">
            รายการสัญญาเช่าทั้งหมด สร้างสัญญาใหม่และ export เป็น PDF ได้จากที่นี่
            {!isSupabaseConfigured && " (ต้องเชื่อมต่อ Supabase ก่อนใช้งานฟีเจอร์นี้)"}
          </p>
        </div>
        <Link
          href="/admin/leases/new"
          className="flex shrink-0 items-center gap-1.5 bg-maroon px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-maroon-light"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} /> เพิ่มสัญญาเช่า
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gold-light/40 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-cream-dark/60 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">โครงการ / ห้อง</th>
              <th className="px-4 py-3">ผู้เช่า</th>
              <th className="px-4 py-3">ระยะเวลาเช่า</th>
              <th className="px-4 py-3">ค่าเช่า/เดือน</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {initialContracts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                  ยังไม่มีสัญญาเช่าในระบบ
                </td>
              </tr>
            ) : (
              initialContracts.map((c) => (
                <tr key={c.id} className="border-t border-cream-dark">
                  <td className="px-4 py-3 font-medium text-maroon-dark">
                    {c.projectName || "-"}
                    {c.roomNumber && <span className="ml-1.5 text-xs font-normal text-ink/40">ห้อง {c.roomNumber}</span>}
                  </td>
                  <td className="px-4 py-3">{c.lesseeName || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.startDate ? formatThaiDate(c.startDate) : "-"} — {c.endDate ? formatThaiDate(c.endDate) : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatBaht(c.rentPerMonth)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/leases/${c.id}/print`}
                        target="_blank"
                        aria-label="Export PDF"
                        title="Export PDF"
                        className="border border-cream-dark p-1.5 text-ink/50 hover:border-gold-dark hover:text-gold-dark"
                      >
                        <FileDown className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <Link
                        href={`/admin/leases/${c.id}/edit`}
                        aria-label="แก้ไข"
                        className="border border-cream-dark p-1.5 text-ink/50 hover:border-gold-dark hover:text-gold-dark"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: c.id, name: c.lesseeName || c.projectName })}
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
        title="ยืนยันลบสัญญาเช่า"
        message={`ยืนยันลบสัญญาเช่าของ "${deleteTarget?.name}" ออกจากระบบ? การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบสัญญา"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
