import type { Metadata } from "next";
import BookingsAdmin from "./BookingsAdmin";
import { fetchAllBookings } from "@/lib/data/bookings";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin: รายการนัดชม/จอง | Paramee",
};

export default async function AdminBookingsPage() {
  const supabase = isSupabaseConfigured ? await createClient() : undefined;
  const bookings = await fetchAllBookings(supabase);

  return <BookingsAdmin initialBookings={bookings} />;
}
