import type { SupabaseClient } from "@supabase/supabase-js";

export type BookingStatus = "new" | "contacted" | "done";

export interface BookingRow {
  id: string;
  created_at: string;
  mode: "view" | "financing";
  name: string;
  phone: string;
  email: string;
  property_slug: string | null;
  appt_date: string | null;
  appt_time: string | null;
  note: string | null;
  pdpa_consent: boolean;
  status: BookingStatus;
}

/** Bookings only exist once Supabase is configured — /api/booking only writes there. */
export async function fetchAllBookings(supabase?: SupabaseClient): Promise<BookingRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as BookingRow[];
}

export async function updateBookingStatus(
  supabase: SupabaseClient,
  id: string,
  status: BookingStatus
) {
  return supabase.from("bookings").update({ status }).eq("id", id);
}

export async function deleteBooking(supabase: SupabaseClient, id: string) {
  return supabase.from("bookings").delete().eq("id", id);
}
