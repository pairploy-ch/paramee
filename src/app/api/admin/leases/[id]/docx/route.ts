import { NextResponse } from "next/server";
import { getSessionProfile, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fetchLeaseContractById } from "@/lib/data/leaseContracts";
import { buildLeaseContractDocx } from "@/lib/leaseContractDocx";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { profile } = await getSessionProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase ยังไม่ได้ตั้งค่า" }, { status: 503 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const contract = await fetchLeaseContractById(id, supabase);
  if (!contract) {
    return NextResponse.json({ error: "ไม่พบสัญญาเช่านี้" }, { status: 404 });
  }

  const buffer = await buildLeaseContractDocx(contract);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="สัญญาเช่า-${contract.roomNumber || contract.id}.docx"`,
    },
  });
}
