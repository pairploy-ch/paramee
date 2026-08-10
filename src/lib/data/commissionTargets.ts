import type { SupabaseClient } from "@supabase/supabase-js";

function currentMonthDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

/** The web-editable override for this month's commission target (rest of the dashboard stays sheet-driven). */
export async function fetchCurrentMonthCommissionTarget(supabase?: SupabaseClient): Promise<number | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("commission_monthly_targets")
    .select("commission_target")
    .eq("month", currentMonthDate())
    .maybeSingle();

  if (error || !data) return null;
  return data.commission_target;
}

export async function upsertCommissionTarget(supabase: SupabaseClient, commissionTarget: number) {
  return supabase
    .from("commission_monthly_targets")
    .upsert({ month: currentMonthDate(), commission_target: commissionTarget }, { onConflict: "month" });
}
