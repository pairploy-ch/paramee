export type PropertyType = "คอนโด" | "บ้าน" | "ทาวน์โฮม" | "ที่ดิน";

export type PropertyStatus = "Available" | "Reserved" | "Sold" | "For Rent";

export type TransitLine = "BTS" | "MRT" | "ARL" | "อื่นๆ";

export type PropertyTier = 1 | 2 | 3;

export interface TransitInfo {
  station: string;
  line: TransitLine;
  distanceMeters: number;
}

export interface LeaseTerm {
  duration: string;
  price: number;
}

export const landTransferFeeParties = ["เจ้าของออก", "50/50", "ลูกค้าออก"] as const;
export type LandTransferFeeParty = (typeof landTransferFeeParties)[number];

export interface Property {
  slug: string;
  ownerId: string;
  tier: PropertyTier;
  name: string;
  type: PropertyType;
  address: string;
  district: string;
  mapUrl: string | null;
  status: PropertyStatus;
  salePrice: number | null;
  rentPrice: number | null;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  facing: string;
  images: string[];
  commonFeePerSqm: number;
  avgRentInArea: number;
  transferFeeEstimate: number;
  transit: TransitInfo[];
  investor: {
    roiPercent: number;
    rentalYieldPercent: number;
    occupancyPercent: number;
    cashflowPerMonth: number;
  };
  description: string;
  remarks: string;
  leaseTerms: LeaseTerm[];
  landDeedType: string | null;
  landTransferFeeParty: LandTransferFeeParty | null;
  unitCode: string;
  rentalMinTermMonths: number;
  rentalDepositMonths: number;
  rentalAdvanceMonths: number;
}

export const newLaunchRegions = ["กรุงเทพฯ", "พัทยา", "เชียงใหม่", "ภูเก็ต", "อื่นๆ"] as const;
export type NewLaunchRegion = (typeof newLaunchRegions)[number];

export interface NewLaunchProject {
  slug: string;
  name: string;
  projectCode: string;
  projectType: PropertyType;
  region: NewLaunchRegion | null;
  unitTypesCount: string;
  priceMin: number | null;
  priceMax: number | null;
  locationHighlight: string;
  rentYieldPrice: string;
  developer: string;
  unitCount: string;
  buildingCount: string;
  completionYear: string;
  latestPromotion: string;
  mapUrl: string | null;
  commonAreaFacilities: string;
  reservationDeposit: string;
  images: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  isPublished: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  coverImage: string | null;
  authorName: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface LeaseChecklistItem {
  name: string;
  ready: boolean;
  value: string;
  detail: string;
}

export const defaultLeaseChecklistItems: LeaseChecklistItem[] = [
  "เตียง",
  "หมอนหนุน",
  "หมอนข้าง",
  "ชุดเครื่องนอน",
  "ตู้เสื้อผ้า",
  "โต๊ะทำงาน/ โต๊ะทานข้าว",
  "เก้าอี้",
  "โต๊ะข้างเตียง",
  "โต๊ะวางทีวี",
  "ตู้เก็บรองเท้า",
  "โซฟา",
  "ผ้าม่าน",
  "ราวตากผ้า",
  "ทีวี พร้อมรีโมท",
  "แอร์ พร้อมรีโมท",
  "ตู้เย็น",
  "ไมโครเวฟ",
  "เตาไฟฟ้า",
  "ฮู้ดดูดควัน",
  "เครื่องทำน้ำอุ่น",
  "พัดลม",
  "กาต้มน้ำ",
  "เครื่องซักผ้า",
  "กุญแจห้อง",
  "คีย์การ์ดเข้าห้อง",
  "คีย์การ์ดเข้าอาคาร",
  "คีย์การ์ดจอดรถ",
  "สติ๊กเกอร์จอดรถ",
  "กุญแจตู้จดหมาย",
].map((name) => ({ name, ready: false, value: "", detail: "" }));

export interface LeaseContract {
  id: string;
  createdAt: string;
  projectName: string;
  projectAddress: string;
  roomNumber: string;
  building: string;
  floor: string;
  lessorName: string;
  lessorIdCard: string;
  lessorAddress: string;
  lesseeName: string;
  lesseeIdCard: string;
  lesseeAddress: string;
  contractDate: string | null;
  startDate: string | null;
  endDate: string | null;
  contractYears: number;
  rentPerMonth: number;
  paymentDueDay: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  depositAmount: number;
  cleaningFee: number;
  receiptDate: string | null;
  reservationDepositAmount: number;
  damageDepositAmount: number;
  checklistItems: LeaseChecklistItem[];
}

export const coAgentWorkTypes = ["Freelance ฟรีแลนซ์", "Company บริษัท/นิติบุคคล"] as const;
export type CoAgentWorkType = (typeof coAgentWorkTypes)[number];

export const coAgentExpertiseAreas = ["เมืองชลบุรี", "บางแสน", "ศรีราชา", "พัทยา", "อมตะ", "อื่นๆ"] as const;

export const coAgentMarketingChannels = [
  "Facebook ส่วนตัว",
  "Facebook Page",
  "TikTok",
  "Instagram",
  "Website (eg. DD Property, Property Hub, Living Insider)",
  "ป้ายโฆษณา",
  "อื่นๆ",
] as const;

export interface CoAgentApplication {
  id: string;
  createdAt: string;
  fullName: string;
  nickname: string;
  phone: string;
  lineId: string;
  email: string;
  workType: string;
  expertiseAreas: string[];
  marketingChannels: string[];
  marketingName: string;
  idCardFiles: string[];
  bankBookFile: string;
  companyCertFile: string | null;
}
