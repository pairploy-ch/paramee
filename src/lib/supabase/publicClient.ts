import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";

export { isSupabaseConfigured };

/**
 * Anon-key client with no cookie/session handling — for anonymous writes
 * (e.g. the public booking form) that rely on RLS "insert for anon" policies.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase ยังไม่ได้ตั้งค่า");
  }
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
