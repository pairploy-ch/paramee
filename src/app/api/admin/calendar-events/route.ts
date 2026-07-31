import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/supabase/server";
import { fetchCalendarEvents } from "@/lib/googleCalendarApi";

export async function GET(request: Request) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return NextResponse.json({ error: "กรุณาระบุ year/month" }, { status: 400 });
  }

  const timeMin = new Date(year, month, 1);
  const timeMax = new Date(year, month + 1, 1);

  const events = await fetchCalendarEvents({ timeMin, timeMax });
  return NextResponse.json({ events });
}
