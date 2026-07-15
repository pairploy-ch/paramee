import type { SupabaseClient } from "@supabase/supabase-js";
import { owners as seedOwners, type Owner } from "@/lib/owners";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** All registered property owners. Admin-only (RLS restricts this to role='admin'). */
export async function fetchAllOwners(supabase?: SupabaseClient): Promise<Owner[]> {
  if (!isSupabaseConfigured || !supabase) return seedOwners;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone")
    .eq("role", "owner")
    .order("created_at", { ascending: false });

  if (error || !data) return seedOwners;
  return data.map((row) => ({
    id: row.id,
    name: row.name ?? row.email ?? "ไม่ระบุชื่อ",
    email: row.email ?? "",
    phone: row.phone ?? "",
  }));
}
