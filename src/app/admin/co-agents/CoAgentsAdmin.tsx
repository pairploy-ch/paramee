"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { deleteCoAgentApplicationById } from "@/lib/data/coAgentApplications";
import { formatThaiDate } from "@/lib/format";
import type { CoAgentApplication } from "@/lib/types";

export default function CoAgentsAdmin({ initialApplications }: { initialApplications: CoAgentApplication[] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openingPath, setOpeningPath] = useState<string | null>(null);

  async function viewDocument(path: string) {
    if (!isSupabaseConfigured) return;
    setOpeningPath(path);
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("co-agent-documents").createSignedUrl(path, 300);
    setOpeningPath(null);
    if (error || !data) {
      window.alert("เปิดเอกสารไม่สำเร็จ: " + (error?.message ?? "ไม่ทราบสาเหตุ"));
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function confirmDelete() {
    if (!deleteTarget || !isSupabaseConfigured) return;
    setDeleting(true);
    const supabase = createClient();
    await deleteCoAgentApplicationById(supabase, deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-maroon-dark">ใบสมัคร Co-Agent</h1>
        <p className="mt-2 text-sm text-ink/60">
          รายการใบสมัคร Co-Agent ทั้งหมดที่ส่งเข้ามาผ่านฟอร์มสาธารณะ หน้านี้ไม่ปรากฏในเมนูใดๆ
          {!isSupabaseConfigured && " (ต้องเชื่อมต่อ Supabase ก่อนใช้งานฟีเจอร์นี้)"}
        </p>
      </div>

      <div className="space-y-4">
        {initialApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold-light/50 bg-white py-16 text-center text-ink/50">
            ยังไม่มีใบสมัคร Co-Agent เข้ามา
          </div>
        ) : (
          initialApplications.map((app) => (
            <div key={app.id} className="rounded-2xl border border-gold-light/40 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-maroon-dark">
                    {app.fullName || "-"}{" "}
                    {app.nickname && <span className="text-sm font-normal text-ink/50">({app.nickname})</span>}
                  </h2>
                  <p className="mt-1 text-xs text-ink/50">สมัครเมื่อ {formatThaiDate(app.createdAt)}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: app.id, name: app.fullName || app.nickname })}
                  aria-label="ลบใบสมัคร"
                  className="border border-cream-dark p-1.5 text-ink/50 hover:border-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-ink/40">เบอร์โทร / LINE</p>
                  <p className="mt-0.5">{app.phone || "-"} / {app.lineId || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink/40">Email</p>
                  <p className="mt-0.5">{app.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink/40">ประเภท</p>
                  <p className="mt-0.5">{app.workType || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink/40">พื้นที่ที่เชี่ยวชาญ</p>
                  <p className="mt-0.5">{app.expertiseAreas.join(", ") || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink/40">ช่องทางทำการตลาด</p>
                  <p className="mt-0.5">{app.marketingChannels.join(", ") || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink/40">ชื่อ Facebook / เพจ</p>
                  <p className="mt-0.5">{app.marketingName || "-"}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-cream-dark pt-4">
                <p className="mb-2 text-xs font-semibold text-ink/40">เอกสารแนบ</p>
                <div className="flex flex-wrap gap-2">
                  {app.idCardFiles.map((path, i) => (
                    <button
                      key={path}
                      onClick={() => viewDocument(path)}
                      disabled={openingPath === path}
                      className="flex items-center gap-1.5 border border-cream-dark bg-cream px-3 py-1.5 text-xs text-ink/70 hover:border-gold-dark hover:text-gold-dark disabled:opacity-50"
                    >
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} /> บัตรประชาชน {i + 1}
                    </button>
                  ))}
                  {app.bankBookFile && (
                    <button
                      onClick={() => viewDocument(app.bankBookFile)}
                      disabled={openingPath === app.bankBookFile}
                      className="flex items-center gap-1.5 border border-cream-dark bg-cream px-3 py-1.5 text-xs text-ink/70 hover:border-gold-dark hover:text-gold-dark disabled:opacity-50"
                    >
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} /> สมุดบัญชี
                    </button>
                  )}
                  {app.companyCertFile && (
                    <button
                      onClick={() => viewDocument(app.companyCertFile as string)}
                      disabled={openingPath === app.companyCertFile}
                      className="flex items-center gap-1.5 border border-cream-dark bg-cream px-3 py-1.5 text-xs text-ink/70 hover:border-gold-dark hover:text-gold-dark disabled:opacity-50"
                    >
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} /> หนังสือรับรองบริษัท
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="ยืนยันลบใบสมัคร"
        message={`ยืนยันลบใบสมัครของ "${deleteTarget?.name}" ออกจากระบบ? การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบใบสมัคร"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
