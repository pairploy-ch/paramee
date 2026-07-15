import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [
  {
    id: "seed-1",
    name: "คุณนภัส",
    role: "ลูกค้าซื้อคอนโด ทองหล่อ",
    quote:
      "ระบบค้นหาใช้งานง่าย ข้อมูล ROI และระยะ BTS ครบ ช่วยให้ตัดสินใจได้เร็วขึ้นมาก นัดชมก็สะดวก ยืนยันไว",
    isPublished: true,
  },
  {
    id: "seed-2",
    name: "คุณธีรภัทร",
    role: "นักลงทุนอสังหาฯ",
    quote:
      "ชอบตรงมีข้อมูล Rental Yield และ Cashflow ให้ดูตั้งแต่หน้ารายละเอียดทรัพย์ ไม่ต้องคำนวณเอง ประหยัดเวลามาก",
    isPublished: true,
  },
  {
    id: "seed-3",
    name: "คุณอัญชิสา",
    role: "เจ้าของทรัพย์ปล่อยเช่า",
    quote:
      "Owner Portal ทำให้ติดตามรายได้ค่าเช่าและสถานะห้องได้ตลอด ไม่ต้องโทรถามทีมงานบ่อยๆ เหมือนเมื่อก่อน",
    isPublished: true,
  },
  {
    id: "seed-4",
    name: "คุณกวิน",
    role: "ลูกค้าซื้อทาวน์โฮม บางนา",
    quote:
      "ทีมงานตอบไวมาก นัดชมได้ภายในวันเดียว ข้อมูลค่าใช้จ่ายและค่าโอนครบ ไม่ต้องถามซ้ำหลายรอบ",
    isPublished: true,
  },
];
