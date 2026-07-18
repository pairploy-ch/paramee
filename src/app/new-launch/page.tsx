import type { Metadata } from "next";
import NewLaunchBrowser from "./NewLaunchBrowser";
import { fetchAllNewLaunchProjects } from "@/lib/data/newLaunchProjects";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "โครงการมือ 1 | Paramee",
};

export default async function NewLaunchListPage() {
  const projects = await fetchAllNewLaunchProjects(
    isSupabaseConfigured ? createPublicClient() : undefined
  );

  return <NewLaunchBrowser initialProjects={projects} />;
}
