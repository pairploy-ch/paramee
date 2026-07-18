import type { Metadata } from "next";
import WishlistView from "./WishlistView";
import { fetchAllProperties } from "@/lib/data/properties";
import { fetchAllNewLaunchProjects } from "@/lib/data/newLaunchProjects";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "รายการที่ถูกใจ | Paramee",
};

export default async function WishlistPage() {
  const supabase = isSupabaseConfigured ? createPublicClient() : undefined;
  const properties = await fetchAllProperties(supabase);
  const newLaunchProjects = await fetchAllNewLaunchProjects(supabase);

  return <WishlistView properties={properties} newLaunchProjects={newLaunchProjects} />;
}
