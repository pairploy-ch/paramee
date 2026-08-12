import type { SupabaseClient } from "@supabase/supabase-js";
import { owners as seedOwners, type Owner } from "@/lib/owners";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** All registered property owners. Admin-only (RLS restricts this to role='admin'). */
export async function fetchAllOwners(supabase?: SupabaseClient): Promise<Owner[]> {
  if (!isSupabaseConfigured || !supabase) return seedOwners;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, nickname, email, phone")
    .eq("role", "owner")
    .order("created_at", { ascending: false });

  if (error || !data) return seedOwners;
  return data.map((row) => ({
    id: row.id,
    name: row.name ?? row.email ?? "ไม่ระบุชื่อ",
    nickname: row.nickname ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
  }));
}

export interface NewOwnerInput {
  name: string;
  nickname: string;
  phone: string;
  lineId: string;
  facebookUrl: string;
  whatsapp: string;
}

/**
 * Creates a login-free "contact-only" owner (used when an admin needs to
 * attribute a property to an owner that isn't in the list yet). Requires the
 * caller to already be signed in as admin — enforced by the
 * "profiles: admins insert" RLS policy, not by this function.
 */
export async function createOwner(supabase: SupabaseClient, input: NewOwnerInput): Promise<Owner> {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      role: "owner",
      name: input.name.trim(),
      nickname: input.nickname.trim() || null,
      phone: input.phone.trim(),
      line_id: input.lineId.trim() || null,
      facebook_url: input.facebookUrl.trim() || null,
      whatsapp: input.whatsapp.trim() || null,
      is_registered: false,
    })
    .select("id, name, nickname, email, phone")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "สร้างเจ้าของทรัพย์ไม่สำเร็จ");
  }

  return {
    id: data.id,
    name: data.name ?? input.name,
    nickname: data.nickname ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
  };
}

export interface OwnerContactInfo {
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  lineId: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  whatsapp: string | null;
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
      "name, phone, avatarUrl:avatar_url, lineId:line_id, facebookUrl:facebook_url, instagramUrl:instagram_url, tiktokUrl:tiktok_url, whatsapp"
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
      "id, name, phone, avatarUrl:avatar_url, lineId:line_id, facebookUrl:facebook_url, instagramUrl:instagram_url, tiktokUrl:tiktok_url, whatsapp"
    );

  if (error || !data) return {};
  return Object.fromEntries(
    (data as (OwnerContactInfo & { id: string })[]).map(({ id, ...rest }) => [id, rest])
  );
}
