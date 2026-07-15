import type { SupabaseClient } from "@supabase/supabase-js";
import { testimonials as seedTestimonials } from "@/lib/testimonials";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

export interface TestimonialRow {
  id: string;
  name: string;
  role: string;
  quote: string;
  is_published: boolean;
}

function rowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    quote: row.quote,
    isPublished: row.is_published,
  };
}

export async function fetchPublishedTestimonials(supabase?: SupabaseClient): Promise<Testimonial[]> {
  if (!isSupabaseConfigured || !supabase) {
    return seedTestimonials.filter((t) => t.isPublished);
  }

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return seedTestimonials.filter((t) => t.isPublished);
  return (data as TestimonialRow[]).map(rowToTestimonial);
}

export async function fetchAllTestimonialsAdmin(supabase?: SupabaseClient): Promise<Testimonial[]> {
  if (!isSupabaseConfigured || !supabase) return seedTestimonials;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return seedTestimonials;
  return (data as TestimonialRow[]).map(rowToTestimonial);
}

export async function insertTestimonial(
  supabase: SupabaseClient,
  input: Omit<Testimonial, "id">
) {
  return supabase
    .from("testimonials")
    .insert({ name: input.name, role: input.role, quote: input.quote, is_published: input.isPublished })
    .select("*")
    .single();
}

export async function updateTestimonial(
  supabase: SupabaseClient,
  id: string,
  patch: Partial<Omit<Testimonial, "id">>
) {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.quote !== undefined) row.quote = patch.quote;
  if (patch.isPublished !== undefined) row.is_published = patch.isPublished;

  return supabase.from("testimonials").update(row).eq("id", id).select("*").single();
}

export async function deleteTestimonial(supabase: SupabaseClient, id: string) {
  return supabase.from("testimonials").delete().eq("id", id);
}
