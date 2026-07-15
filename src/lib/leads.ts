export interface Lead {
  date: string;
  channel: "Walk-in" | "โทร" | "LINE" | "Website" | "IG" | "Referral";
  interestedType: "คอนโด" | "บ้าน" | "ทาวน์โฮม" | "ที่ดิน";
  area: string;
  budget: string;
  sizeNeeded: string;
  purpose: "ซื้อเอง" | "ลงทุน" | "เช่า";
  followUp: "Hot" | "Warm" | "Cold";
  note: string;
}

export const leads: Lead[] = [
  { date: "2026-07-06", channel: "Website", interestedType: "คอนโด", area: "ทองหล่อ", budget: "8-10 ล้าน", sizeNeeded: "35-45 ตร.ม.", purpose: "ลงทุน", followUp: "Hot", note: "สนใจปล่อยเช่าระยะยาว" },
  { date: "2026-07-06", channel: "LINE", interestedType: "บ้าน", area: "รามอินทรา", budget: "5-7 ล้าน", sizeNeeded: "150-200 ตร.ม.", purpose: "ซื้อเอง", followUp: "Warm", note: "ต้องการ 4 ห้องนอน" },
  { date: "2026-07-07", channel: "โทร", interestedType: "คอนโด", area: "อารีย์", budget: "10-13 ล้าน", sizeNeeded: "50-60 ตร.ม.", purpose: "ซื้อเอง", followUp: "Hot", note: "โอนได้ทันที" },
  { date: "2026-07-07", channel: "IG", interestedType: "ทาวน์โฮม", area: "บางนา", budget: "4-5 ล้าน", sizeNeeded: "100-130 ตร.ม.", purpose: "ซื้อเอง", followUp: "Warm", note: "" },
  { date: "2026-07-08", channel: "Walk-in", interestedType: "ที่ดิน", area: "ห้วยขวาง", budget: "40-50 ล้าน", sizeNeeded: "300-500 ตร.ม.", purpose: "ลงทุน", followUp: "Cold", note: "ยังศึกษาข้อมูลอยู่" },
  { date: "2026-07-09", channel: "Website", interestedType: "คอนโด", area: "อโศก", budget: "14-17 ล้าน", sizeNeeded: "40-50 ตร.ม.", purpose: "ลงทุน", followUp: "Hot", note: "" },
  { date: "2026-07-09", channel: "Referral", interestedType: "บ้าน", area: "รังสิต", budget: "3-4 ล้าน", sizeNeeded: "130-150 ตร.ม.", purpose: "ซื้อเอง", followUp: "Warm", note: "แนะนำโดยลูกค้าเดิม" },
  { date: "2026-07-10", channel: "LINE", interestedType: "คอนโด", area: "พระโขนง", budget: "4-5 ล้าน", sizeNeeded: "25-30 ตร.ม.", purpose: "เช่า", followUp: "Hot", note: "" },
  { date: "2026-07-11", channel: "Website", interestedType: "ทาวน์โฮม", area: "สายไหม", budget: "3.5-4 ล้าน", sizeNeeded: "100-120 ตร.ม.", purpose: "ซื้อเอง", followUp: "Warm", note: "" },
  { date: "2026-07-11", channel: "โทร", interestedType: "คอนโด", area: "ทองหล่อ", budget: "8-9 ล้าน", sizeNeeded: "38-42 ตร.ม.", purpose: "ซื้อเอง", followUp: "Hot", note: "ผู้ซื้อรายที่สองสนใจตึกเดียวกัน" },
  { date: "2026-07-12", channel: "IG", interestedType: "คอนโด", area: "คลองตัน", budget: "3-3.5 ล้าน", sizeNeeded: "35-38 ตร.ม.", purpose: "เช่า", followUp: "Warm", note: "" },
  { date: "2026-07-12", channel: "Website", interestedType: "บ้าน", area: "รามอินทรา", budget: "6-6.5 ล้าน", sizeNeeded: "170-190 ตร.ม.", purpose: "ซื้อเอง", followUp: "Hot", note: "นัดชมสัปดาห์หน้า" },
];

export function leadsPerDay(rows: Lead[] = leads) {
  const map = new Map<string, number>();
  for (const l of rows) map.set(l.date, (map.get(l.date) ?? 0) + 1);
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function topByField<K extends keyof Lead>(rows: Lead[], field: K, limit = 3) {
  const map = new Map<string, number>();
  for (const l of rows) {
    const key = String(l[field]);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}
