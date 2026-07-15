import type { Metadata } from "next";
import WishlistView from "./WishlistView";
import { fetchAllProperties } from "@/lib/data/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "รายการที่ถูกใจ | Paramee",
};

export default async function WishlistPage() {
  const properties = await fetchAllProperties(
    isSupabaseConfigured ? createPublicClient() : undefined
  );

  return <WishlistView properties={properties} />;
}
