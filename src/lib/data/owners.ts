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

export interface OwnerContactInfo {
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  lineId: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}

/**
 * Public-safe contact info for the property owner shown on the property
 * detail page. Reads the `owner_contacts` view (no email/role exposed)
 * since anonymous visitors have no read access to `profiles` directly.
 */
export async function fetchOwnerContact(
  ownerId: string,
  supabase?: SupabaseClient
): Promise<OwnerContactInfo | null> {
  if (!isSupabaseConfigured || !supabase || !ownerId) return null;

  const { data, error } = await supabase
    .from("owner_contacts")
    .select(
      "name, phone, avatarUrl:avatar_url, lineId:line_id, facebookUrl:facebook_url, instagramUrl:instagram_url, tiktokUrl:tiktok_url"
    )
    .eq("id", ownerId)
    .maybeSingle();

  if (error || !data) return null;
  return data as OwnerContactInfo;
}

/**
 * Bulk-fetches every owner's public contact info in one query, keyed by
 * owner id, so property cards/lists can show the real owner without one
 * query per card.
 */
export async function fetchAllOwnerContacts(
  supabase?: SupabaseClient
): Promise<Record<string, OwnerContactInfo>> {
  if (!isSupabaseConfigured || !supabase) return {};

  const { data, error } = await supabase
    .from("owner_contacts")
    .select(
      "id, name, phone, avatarUrl:avatar_url, lineId:line_id, facebookUrl:facebook_url, instagramUrl:instagram_url, tiktokUrl:tiktok_url"
    );

  if (error || !data) return {};
  return Object.fromEntries(
    (data as (OwnerContactInfo & { id: string })[]).map(({ id, ...rest }) => [id, rest])
  );
}
