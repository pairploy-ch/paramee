"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { upsertCommissionTarget } from "@/lib/data/commissionTargets";
import PriceInput from "@/components/PriceInput";

function parseMoneyToNumber(raw: string): number {
  const n = Number(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function pct(n: number): number {
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark">
      <div
        className={`h-full rounded-full ${percent >= 100 ? "bg-emerald-500" : "bg-gold"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/** Commission MetricCard, except the target can be set from the web (writes to
 * commission_monthly_targets) instead of only coming from the Google Sheet. */
export default function CommissionTargetCard({
  label,
  achieved,
  sheetTarget,
  dbTarget,
  canEdit,
}: {
  label: string;
  achieved: string;
  sheetTarget: string;
  dbTarget: number | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(dbTarget ?? parseMoneyToNumber(sheetTarget)));
  const [saving, setSaving] = useState(false);

  const achievedNum = parseMoneyToNumber(achieved);
  const effectiveTarget = dbTarget ?? parseMoneyToNumber(sheetTarget);
  const percent = effectiveTarget > 0 ? Math.round((achievedNum / effectiveTarget) * 100) : 0;

  async function handleSave() {
    const target = parseMoneyToNumber(value);
    setSaving(true);
    const supabase = createClient();
    await upsertCommissionTarget(supabase, target);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-gold-light/40 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-ink/60">{label}</p>
        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="แก้ไขเป้าหมาย"
            className="text-ink/40 hover:text-gold-dark"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="mt-2 flex items-center gap-2">
          <PriceInput
            value={value}
            onChange={setValue}
            className="w-full border border-cream-dark bg-cream px-2 py-1.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 bg-maroon px-3 py-1.5 text-xs font-medium text-cream hover:bg-maroon-light disabled:opacity-50"
          >
            {saving ? "..." : "บันทึก"}
          </button>
        </div>
      ) : (
        <p className="mt-2 font-heading text-lg font-semibold text-maroon-dark">
          {achieved} / {effectiveTarget.toLocaleString("th-TH")}
        </p>
      )}

      <div className="mt-3">
        <ProgressBar percent={pct(percent)} />
        <p className="mt-1 text-right text-xs text-ink/50">{percent}%</p>
      </div>
    </div>
  );
}
