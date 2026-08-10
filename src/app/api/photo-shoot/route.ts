import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { sendMail } from "@/lib/mailer";

interface PhotoShootPayload {
  condoName: string;
  unitCode?: string;
  roomNumber?: string;
  building?: string;
  floor?: string;
  ownerNickname?: string;
  phone: string;
  note?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<PhotoShootPayload>;

  const condoName = (body.condoName ?? "").trim();
  const unitCode = (body.unitCode ?? "").trim();
  const roomNumber = (body.roomNumber ?? "").trim();
  const building = (body.building ?? "").trim();
  const floor = (body.floor ?? "").trim();
  const ownerNickname = (body.ownerNickname ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const note = (body.note ?? "").trim();

  if (!condoName) {
    return NextResponse.json({ error: "กรุณากรอกชื่อคอนโด" }, { status: 400 });
  }
  if (!/^\d{9,10}$/.test(phone)) {
    return NextResponse.json({ error: "กรุณากรอกเบอร์ติดต่อ 9-10 หลัก" }, { status: 400 });
  }

  if (isSupabaseConfigured) {
    const supabase = createPublicClient();
    await supabase.from("photo_shoot_requests").insert({
      condo_name: condoName,
      unit_code: unitCode || null,
      room_number: roomNumber || null,
      building: building || null,
      floor: floor || null,
      owner_nickname: ownerNickname || null,
      phone,
      note: note || null,
    });
  }

  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL || "paramee.asset@gmail.com";
  const summaryLines = [
    `ชื่อคอนโด: ${condoName}`,
    unitCode ? `รหัส: ${unitCode}` : null,
    roomNumber ? `เลขที่ห้อง: ${roomNumber}` : null,
    building ? `ตึก: ${building}` : null,
    floor ? `ชั้น: ${floor}` : null,
    ownerNickname ? `ชื่อเล่นเจ้าของ: ${ownerNickname}` : null,
    `เบอร์ติดต่อ: ${phone}`,
    note ? `หมายเหตุเพิ่มเติม: ${note}` : null,
  ].filter(Boolean);

  await sendMail({
    to: notifyEmail,
    subject: `[Paramee] ขอนัดถ่ายภาพ — ${condoName}`,
    text: summaryLines.join("\n"),
  });

  return NextResponse.json({ ok: true });
}
