import type { NewLaunchProject, NewLaunchRegion, PropertyType } from "@/lib/types";

export interface NewLaunchFormValues {
  name: string;
  projectCode: string;
  projectType: PropertyType;
  region: NewLaunchRegion | "";
  unitTypesCount: string;
  priceMin: string;
  priceMax: string;
  locationHighlight: string;
  rentYieldPrice: string;
  developer: string;
  unitCount: string;
  buildingCount: string;
  completionYear: string;
  latestPromotion: string;
  mapUrl: string;
  commonAreaFacilities: string;
  reservationDeposit: string;
  images: string[];
}

export const emptyNewLaunchFormValues: NewLaunchFormValues = {
  name: "",
  projectCode: "",
  projectType: "คอนโด",
  region: "",
  unitTypesCount: "",
  priceMin: "",
  priceMax: "",
  locationHighlight: "",
  rentYieldPrice: "",
  developer: "",
  unitCount: "",
  buildingCount: "",
  completionYear: "",
  latestPromotion: "",
  mapUrl: "",
  commonAreaFacilities: "",
  reservationDeposit: "",
  images: [""],
};

export function projectToFormValues(p: NewLaunchProject): NewLaunchFormValues {
  return {
    name: p.name,
    projectCode: p.projectCode,
    projectType: p.projectType,
    region: p.region ?? "",
    unitTypesCount: p.unitTypesCount,
    priceMin: p.priceMin != null ? String(p.priceMin) : "",
    priceMax: p.priceMax != null ? String(p.priceMax) : "",
    locationHighlight: p.locationHighlight,
    rentYieldPrice: p.rentYieldPrice,
    developer: p.developer,
    unitCount: p.unitCount,
    buildingCount: p.buildingCount,
    completionYear: p.completionYear,
    latestPromotion: p.latestPromotion,
    mapUrl: p.mapUrl ?? "",
    commonAreaFacilities: p.commonAreaFacilities,
    reservationDeposit: p.reservationDeposit,
    images: p.images.length ? p.images : [""],
  };
}
