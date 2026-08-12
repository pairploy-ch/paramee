import { NextResponse } from "next/server";
import { getSessionProfile, createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MAX_SIZE = 10 * 1024 * 1024;
const SIGNED_URL_TTL_SECONDS = 60 * 60;
const BUCKET = "lease-documents";

async function requireAdmin() {
  const { profile } = await getSessionProfile();
  return profile?.role === "admin";
}

/** Uploads a lessee ID card / bank book image to the private lease-documents
 * bucket and returns the stored object path plus a short-lived signed URL for
 * immediate preview. The object path (not the URL) is what gets saved on the
 * lease contract row, since signed URLs expire. */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase Storage ยังไม่ได้ตั้งค่า — เชื่อมต่อ Supabase ก่อนอัปโหลดไฟล์" },
      { status: 503 }
    );
  }
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "รองรับเฉพาะไฟล์รูปภาพ" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "ไฟล์ต้องมีขนาดไม่เกิน 10MB" }, { status: 400 });
  }

  const supabase = await createClient();
  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);

  if (signError || !data) {
    return NextResponse.json({ error: signError?.message ?? "สร้างลิงก์ดูไฟล์ไม่สำเร็จ" }, { status: 500 });
  }

  return NextResponse.json({ path: objectPath, url: data.signedUrl });
}

/** Re-signs an already-uploaded object path (e.g. when opening an existing
 * lease contract later — the signed URL issued at upload time has likely
 * expired by then). */
export async function GET(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase Storage ยังไม่ได้ตั้งค่า" }, { status: 503 });
  }
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = new URL(request.url).searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "ไม่พบ path ของไฟล์" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "สร้างลิงก์ดูไฟล์ไม่สำเร็จ" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
