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

export interface NewLaunchProject {
  slug: string;
  name: string;
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
