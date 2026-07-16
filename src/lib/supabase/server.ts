import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./client";

export { isSupabaseConfigured };

export async function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase ยังไม่ได้ตั้งค่า — ใส่ NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน .env.local"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component render — safe to ignore because
            // proxy.ts refreshes the session cookie on every request.
          }
        },
      },
    }
  );
}

export interface Profile {
  id: string;
  role: "admin" | "owner";
  name: string | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  lineId: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}

export async function getSessionProfile(): Promise<{
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
}> {
  if (!isSupabaseConfigured) return { user: null, profile: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, role, name, phone, email, avatarUrl:avatar_url, lineId:line_id, facebookUrl:facebook_url, instagramUrl:instagram_url, tiktokUrl:tiktok_url"
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: (profile as Profile) ?? null,
  };
}
