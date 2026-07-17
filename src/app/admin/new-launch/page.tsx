import type { Metadata } from "next";
import NewLaunchAdmin from "./NewLaunchAdmin";
import { fetchAllNewLaunchProjects } from "@/lib/data/newLaunchProjects";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: โครงการมือ 1 | Paramee",
};

export default async function AdminNewLaunchPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const projects = await fetchAllNewLaunchProjects(supabase);

  return <NewLaunchAdmin initialProjects={projects} />;
}
