export type LandDeedColor = "green" | "yellow" | "orange" | "red" | "gray";

export interface LandDeedType {
  value: string;
  color: LandDeedColor;
}

export const landDeedTypes: LandDeedType[] = [
  { value: "โฉนดที่ดิน (น.ส.4 จ.)", color: "green" },
  { value: "น.ส.3 ก.", color: "green" },
  { value: "น.ส.3", color: "green" },
  { value: "น.ส.3 ข.", color: "yellow" },
  { value: "ส.ค.1", color: "yellow" },
  { value: "ส.ป.ก. 4-01", color: "orange" },
  { value: "ภ.บ.ท.5", color: "red" },
  { value: "น.ค.3", color: "red" },
  { value: "อื่น ๆ", color: "gray" },
];

export const landDeedColorClass: Record<LandDeedColor, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-400",
  orange: "bg-orange-500",
  red: "bg-red-500",
  gray: "bg-gray-300",
};
