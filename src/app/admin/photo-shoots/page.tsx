import type { Metadata } from "next";
import PhotoShootsAdmin from "./PhotoShootsAdmin";
import { fetchAllPhotoShootRequests } from "@/lib/data/photoShootRequests";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: คำขอนัดถ่ายภาพ | Paramee",
};

export default async function AdminPhotoShootsPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const requests = await fetchAllPhotoShootRequests(supabase);

  return <PhotoShootsAdmin initialRequests={requests} />;
}
