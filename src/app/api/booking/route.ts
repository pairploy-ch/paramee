import { NextResponse } from "next/server";
import { fetchPropertyBySlug } from "@/lib/data/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { sendMail } from "@/lib/mailer";

const modeCopy: Record<string, string> = {
  view: "นัดเข้าชมโครงการ / ห้อง",
  financing: "ขอสินเชื่อ / นัดพบเจ้าหน้าที่การเงิน",
};

interface BookingPayload {
  mode: "view" | "financing";
  name: string;
  phone: string;
  email: string;
  property?: string;
  date?: string;
  time?: string;
  note?: string;
  pdpaConsent: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<BookingPayload>;

  const mode = body.mode === "financing" ? body.mode : "view";
  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const note = (body.note ?? "").trim();
  const propertySlug = body.property ?? "";
  const date = body.date ?? "";
  const time = body.time ?? "";

  if (!name) {
    return NextResponse.json({ error: "กรุณากรอกชื่อ" }, { status: 400 });
  }
  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "กรุณากรอกเบอร์โทร 10 หลัก" }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "กรุณากรอกอีเมล" }, { status: 400 });
  }
  if (!body.pdpaConsent) {
    return NextResponse.json({ error: "กรุณายินยอมให้เก็บและติดต่อข้อมูลตาม PDPA" }, { status: 400 });
  }
  if (mode === "view") {
    if (!date || !time) {
      return NextResponse.json({ error: "กรุณาเลือกวันและเวลานัด" }, { status: 400 });
    }
    if (time < "09:00" || time > "17:00") {
      return NextResponse.json({ error: "เวลานัดต้องอยู่ระหว่าง 09:00-17:00 น." }, { status: 400 });
    }
  }

  const property = propertySlug
    ? await fetchPropertyBySlug(propertySlug, isSupabaseConfigured ? createPublicClient() : undefined)
    : undefined;

  if (isSupabaseConfigured) {
    const supabase = createPublicClient();
    await supabase.from("bookings").insert({
      mode,
      name,
      phone,
      email,
      property_slug: propertySlug || null,
      appt_date: date || null,
      appt_time: time || null,
      note,
      pdpa_consent: true,
    });
  }

  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL || "paramee.asset@gmail.com";
  const summaryLines = [
    `ประเภท: ${modeCopy[mode]}`,
    `ชื่อ: ${name}`,
    `เบอร์โทร: ${phone}`,
    `อีเมล: ${email}`,
    property ? `ทรัพย์ที่สนใจ: ${property.name}` : null,
    mode === "view" ? `วันเวลานัด: ${date} ${time} น.` : null,
    note ? `หมายเหตุ: ${note}` : null,
  ].filter(Boolean);

  await sendMail({
    to: notifyEmail,
    subject: `[Paramee] ${modeCopy[mode]} — ${name}`,
    text: summaryLines.join("\n"),
  });

  await sendMail({
    to: email,
    subject: "ยืนยันการรับคำขอจาก Paramee Asset",
    text: [
      `เรียนคุณ ${name}`,
      "",
      "ทีมงาน Paramee Asset ได้รับคำขอของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด",
      "",
      ...summaryLines,
    ].join("\n"),
  });

  return NextResponse.json({ ok: true });
}
