import type { Metadata } from "next";
import AddPropertyForm from "./AddPropertyForm";
import { fetchAllOwners } from "@/lib/data/owners";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: เพิ่มทรัพย์ | Paramee",
};

export default async function AdminPropertiesPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const owners = await fetchAllOwners(supabase);

  return <AddPropertyForm owners={owners} />;
}
