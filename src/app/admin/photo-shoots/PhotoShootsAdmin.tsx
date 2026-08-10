"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  updatePhotoShootStatus,
  deletePhotoShootRequest,
  type PhotoShootRequestRow,
  type PhotoShootStatus,
} from "@/lib/data/photoShootRequests";

const statusLabel: Record<PhotoShootStatus, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  done: "เสร็จสิ้น",
};

const statusStyle: Record<PhotoShootStatus, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700",
};

function RequestCard({
  request,
  pending,
  onStatusChange,
  onDelete,
}: {
  request: PhotoShootRequestRow;
  pending: boolean;
  onStatusChange: (id: string, status: PhotoShootStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-[220px] flex-1">
          <p className="font-medium text-maroon-dark">{request.condo_name}</p>
          <p className="mt-1 text-xs text-ink/50">
            {[request.unit_code && `รหัส ${request.unit_code}`, request.room_number && `ห้อง ${request.room_number}`, request.building && `ตึก ${request.building}`, request.floor && `ชั้น ${request.floor}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            {request.owner_nickname ? `${request.owner_nickname} · ` : ""}
            {request.phone}
          </p>
          {request.note && <p className="mt-1 text-xs text-ink/60">หมายเหตุ: {request.note}</p>}
          <p className="mt-1 text-[11px] text-ink/40">
            ส่งเมื่อ {new Date(request.created_at).toLocaleString("th-TH")}
          </p>
        </div>

        <select
          value={request.status}
          onChange={(e) => onStatusChange(request.id, e.target.value as PhotoShootStatus)}
          disabled={pending}
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none disabled:opacity-50 ${statusStyle[request.status]}`}
        >
          {(Object.keys(statusLabel) as PhotoShootStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onDelete(request.id)}
          disabled={pending}
          aria-label="ลบรายการ"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-cream-dark text-ink/40 hover:border-red-400 hover:text-red-500 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> : <Trash2 className="h-4 w-4" strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}

export default function PhotoShootsAdmin({ initialRequests }: { initialRequests: PhotoShootRequestRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: PhotoShootStatus) {
    if (!isSupabaseConfigured) return;
    setPendingId(id);
    const supabase = createClient();
    await updatePhotoShootStatus(supabase, id, status);
    router.refresh();
    setPendingId(null);
  }

  async function handleDelete(id: string) {
    if (!isSupabaseConfigured) return;
    setPendingId(id);
    const supabase = createClient();
    await deletePhotoShootRequest(supabase, id);
    router.refresh();
    setPendingId(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">คำขอนัดถ่ายภาพ</h1>
        <p className="mt-2 text-sm text-ink/60">คำขอทั้งหมดที่ส่งเข้ามาจากหน้า &quot;นัดถ่ายภาพ&quot;</p>
        {!isSupabaseConfigured && (
          <p className="mt-2 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
            ยังไม่ได้ตั้งค่า Supabase — คำขอจะยังไม่ถูกบันทึกจนกว่าจะเชื่อมต่อฐานข้อมูล
          </p>
        )}
      </div>

      <div className="space-y-3">
        {initialRequests.map((r) => (
          <RequestCard
            key={r.id}
            request={r}
            pending={pendingId === r.id}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
        {initialRequests.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            ยังไม่มีคำขอเข้ามา
          </p>
        )}
      </div>
    </div>
  );
}
