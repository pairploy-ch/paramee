const digitWords = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const positionWords = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"];

function convertGroup(group: string): string {
  const digits = group.replace(/^0+(?=\d)/, "");
  if (digits === "0" || digits === "") return "";

  let text = "";
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    const digit = Number(digits[i]);
    const pos = len - i - 1;
    if (digit === 0) continue;

    if (pos === 0) {
      text += digit === 1 && len > 1 ? "เอ็ด" : digitWords[digit];
    } else if (pos === 1) {
      text += digit === 1 ? "สิบ" : digit === 2 ? "ยี่สิบ" : digitWords[digit] + "สิบ";
    } else {
      text += digitWords[digit] + positionWords[pos];
    }
  }
  return text;
}

function convertInteger(value: number): string {
  if (value === 0) return "ศูนย์";
  let numStr = String(Math.trunc(value));
  const groups: string[] = [];
  while (numStr.length > 0) {
    groups.unshift(numStr.slice(-6));
    numStr = numStr.slice(0, -6);
  }

  let text = "";
  for (let i = 0; i < groups.length; i++) {
    const groupText = convertGroup(groups[i]);
    if (groupText) {
      text += groupText + (i < groups.length - 1 ? "ล้าน" : "");
    } else if (i < groups.length - 1) {
      text += "";
    }
  }
  return text;
}

/** Converts a number of baht into Thai text, e.g. 15000 -> "หนึ่งหมื่นห้าพันบาทถ้วน". */
export function thaiBahtText(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const negative = amount < 0;
  const rounded = Math.round(Math.abs(amount) * 100) / 100;
  const baht = Math.floor(rounded);
  const satang = Math.round((rounded - baht) * 100);

  let text = convertInteger(baht) + "บาท";
  text += satang > 0 ? convertInteger(satang) + "สตางค์" : "ถ้วน";

  return (negative ? "ลบ" : "") + text;
}
