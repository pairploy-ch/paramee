import type { SupabaseClient } from "@supabase/supabase-js";

export type PhotoShootStatus = "new" | "contacted" | "done";

export interface PhotoShootRequestRow {
  id: string;
  created_at: string;
  condo_name: string;
  unit_code: string | null;
  room_number: string | null;
  building: string | null;
  floor: string | null;
  owner_nickname: string | null;
  phone: string;
  note: string | null;
  status: PhotoShootStatus;
}

/** Photo shoot requests only exist once Supabase is configured — /api/photo-shoot only writes there. */
export async function fetchAllPhotoShootRequests(
  supabase?: SupabaseClient
): Promise<PhotoShootRequestRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("photo_shoot_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as PhotoShootRequestRow[];
}

export async function updatePhotoShootStatus(
  supabase: SupabaseClient,
  id: string,
  status: PhotoShootStatus
) {
  return supabase.from("photo_shoot_requests").update({ status }).eq("id", id);
}

export async function deletePhotoShootRequest(supabase: SupabaseClient, id: string) {
  return supabase.from("photo_shoot_requests").delete().eq("id", id);
}
