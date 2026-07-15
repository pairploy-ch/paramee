import { Suspense } from "react";
import type { Metadata } from "next";
import PropertiesBrowser from "./PropertiesBrowser";
import { fetchAllProperties } from "@/lib/data/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "ทรัพย์ทั้งหมด | Paramee",
};

export default async function PropertiesPage() {
  const properties = await fetchAllProperties(
    isSupabaseConfigured ? createPublicClient() : undefined
  );

  return (
    <Suspense fallback={null}>
      <PropertiesBrowser initialProperties={properties} />
    </Suspense>
  );
}
