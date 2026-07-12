export type PropertyType = "คอนโด" | "บ้าน" | "ทาวน์โฮม" | "ที่ดิน";

export type PropertyStatus = "Available" | "Reserved" | "Sold" | "For Rent";

export type TransitLine = "BTS" | "MRT" | "ARL";

export interface Property {
  slug: string;
  ownerId: string;
  name: string;
  type: PropertyType;
  address: string;
  district: string;
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
  transit: {
    station: string;
    line: TransitLine;
    distanceMeters: number;
  };
  investor: {
    roiPercent: number;
    rentalYieldPercent: number;
    occupancyPercent: number;
    cashflowPerMonth: number;
  };
  description: string;
}
