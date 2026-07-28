import type { PropertyType } from "./types";
import type { Lang } from "@/i18n/dictionaries";

export const amenitiesByType: Record<PropertyType, string[]> = {
  คอนโด: [
    "สระว่ายน้ำส่วนกลาง",
    "ฟิตเนสเซ็นเตอร์",
    "รักษาความปลอดภัย 24 ชม.",
    "ที่จอดรถส่วนกลาง",
    "กล้องวงจรปิดทุกชั้น",
    "อินเทอร์เน็ต Wi-Fi พื้นที่ส่วนกลาง",
  ],
  บ้าน: [
    "ที่จอดรถในบ้าน",
    "สวนส่วนตัว",
    "ระบบรักษาความปลอดภัยหมู่บ้าน",
    "ห้องครัวแยกส่วน",
    "ระเบียง / พื้นที่นั่งเล่นนอกบ้าน",
    "เครื่องปรับอากาศทุกห้อง",
  ],
  เรือยอชน์: [
    "ท่าจอดเรือส่วนตัว",
    "กัปตันและลูกเรือ",
    "ห้องโดยสารปรับอากาศ",
    "อุปกรณ์ความปลอดภัยครบชุด",
    "ระบบนำทาง GPS",
    "พื้นที่สังสรรค์บนดาดฟ้า",
  ],
  ที่ดิน: [
    "ถมดินพร้อมปลูกสร้าง",
    "ทางเข้าติดถนนใหญ่",
    "โฉนดที่ดินพร้อมโอน",
    "ผังเมืองรองรับการพัฒนาเชิงพาณิชย์",
  ],
};

const amenitiesByTypeEn: Record<PropertyType, string[]> = {
  คอนโด: [
    "Common swimming pool",
    "Fitness center",
    "24-hour security",
    "Common parking",
    "CCTV on every floor",
    "Wi-Fi in common areas",
  ],
  บ้าน: [
    "In-house parking",
    "Private garden",
    "Village security system",
    "Separate kitchen",
    "Balcony / outdoor sitting area",
    "Air conditioning in every room",
  ],
  เรือยอชน์: [
    "Private mooring berth",
    "Captain and crew",
    "Air-conditioned cabin",
    "Full safety equipment",
    "GPS navigation system",
    "Deck entertaining area",
  ],
  ที่ดิน: [
    "Filled land, ready to build",
    "Access to a main road",
    "Land title ready for transfer",
    "Zoning supports commercial development",
  ],
};

export function getAmenities(type: PropertyType, lang: Lang = "th"): string[] {
  return lang === "en" ? amenitiesByTypeEn[type] : amenitiesByType[type];
}
