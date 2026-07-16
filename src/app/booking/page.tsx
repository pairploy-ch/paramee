import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "./BookingForm";
import { fetchAllProperties } from "@/lib/data/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";

export const metadata: Metadata = {
  title: "นัดชมทรัพย์ | Paramee",
};

export default async function BookingPage() {
  const properties = await fetchAllProperties(isSupabaseConfigured ? createPublicClient() : undefined);

  return (
    <Suspense fallback={null}>
      <BookingForm properties={properties} />
    </Suspense>
  );
}
