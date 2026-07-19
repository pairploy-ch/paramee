import type { Metadata } from "next";
import CoAgentsAdmin from "./CoAgentsAdmin";
import { fetchAllCoAgentApplications } from "@/lib/data/coAgentApplications";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: ใบสมัคร Co-Agent | Paramee",
};

export default async function AdminCoAgentsPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const applications = await fetchAllCoAgentApplications(supabase);

  return <CoAgentsAdmin initialApplications={applications} />;
}
