import { NextResponse } from "next/server";
import { getSessionProfile, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { applyWatermark } from "@/lib/watermark";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase Storage ยังไม่ได้ตั้งค่า — เชื่อมต่อ Supabase ก่อนอัปโหลดรูปภาพ" },
      { status: 503 }
    );
  }

  const { user } = await getSessionProfile();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนอัปโหลดรูป" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "รองรับเฉพาะไฟล์รูปภาพ" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ไฟล์ต้องมีขนาดไม่เกิน 10MB" }, { status: 400 });
  }

  const shouldWatermark = formData.get("watermark") !== "false";

  let processed: Buffer;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    processed = shouldWatermark ? await applyWatermark(bytes) : bytes;
  } catch {
    return NextResponse.json({ error: "ไม่สามารถประมวลผลรูปภาพนี้ได้" }, { status: 400 });
  }

  const supabase = await createClient();
  const objectPath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(objectPath, processed, { contentType: shouldWatermark ? "image/jpeg" : file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("property-images").getPublicUrl(objectPath);
  return NextResponse.json({ url: data.publicUrl });
}
