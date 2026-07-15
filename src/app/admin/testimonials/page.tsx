import type { Metadata } from "next";
import TestimonialsAdmin from "./TestimonialsAdmin";
import { fetchAllTestimonialsAdmin } from "@/lib/data/testimonials";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: จัดการรีวิวลูกค้า | Paramee",
};

export default async function AdminTestimonialsPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const testimonials = await fetchAllTestimonialsAdmin(supabase);

  return <TestimonialsAdmin initialTestimonials={testimonials} />;
}
