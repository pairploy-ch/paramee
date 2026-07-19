import { defaultLeaseChecklistItems, type LeaseChecklistItem, type LeaseContract } from "@/lib/types";

export interface LeaseFormValues {
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
  contractDate: string;
  startDate: string;
  endDate: string;
  contractYears: string;
  rentPerMonth: string;
  paymentDueDay: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  depositAmount: string;
  cleaningFee: string;
  receiptDate: string;
  reservationDepositAmount: string;
  damageDepositAmount: string;
  checklistItems: LeaseChecklistItem[];
}

export const emptyLeaseFormValues: LeaseFormValues = {
  projectName: "",
  projectAddress: "",
  roomNumber: "",
  building: "",
  floor: "",
  lessorName: "",
  lessorIdCard: "",
  lessorAddress: "",
  lesseeName: "",
  lesseeIdCard: "",
  lesseeAddress: "",
  contractDate: "",
  startDate: "",
  endDate: "",
  contractYears: "1",
  rentPerMonth: "",
  paymentDueDay: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountName: "",
  depositAmount: "",
  cleaningFee: "",
  receiptDate: "",
  reservationDepositAmount: "",
  damageDepositAmount: "",
  checklistItems: defaultLeaseChecklistItems,
};

export function contractToFormValues(c: LeaseContract): LeaseFormValues {
  return {
    projectName: c.projectName,
    projectAddress: c.projectAddress,
    roomNumber: c.roomNumber,
    building: c.building,
    floor: c.floor,
    lessorName: c.lessorName,
    lessorIdCard: c.lessorIdCard,
    lessorAddress: c.lessorAddress,
    lesseeName: c.lesseeName,
    lesseeIdCard: c.lesseeIdCard,
    lesseeAddress: c.lesseeAddress,
    contractDate: c.contractDate ?? "",
    startDate: c.startDate ?? "",
    endDate: c.endDate ?? "",
    contractYears: String(c.contractYears),
    rentPerMonth: String(c.rentPerMonth),
    paymentDueDay: c.paymentDueDay,
    bankName: c.bankName,
    bankAccountNumber: c.bankAccountNumber,
    bankAccountName: c.bankAccountName,
    depositAmount: String(c.depositAmount),
    cleaningFee: String(c.cleaningFee),
    receiptDate: c.receiptDate ?? "",
    reservationDepositAmount: String(c.reservationDepositAmount),
    damageDepositAmount: String(c.damageDepositAmount),
    checklistItems: c.checklistItems.length ? c.checklistItems : defaultLeaseChecklistItems,
  };
}

export function formValuesToInput(v: LeaseFormValues): Omit<LeaseContract, "id" | "createdAt"> {
  return {
    projectName: v.projectName,
    projectAddress: v.projectAddress,
    roomNumber: v.roomNumber,
    building: v.building,
    floor: v.floor,
    lessorName: v.lessorName,
    lessorIdCard: v.lessorIdCard,
    lessorAddress: v.lessorAddress,
    lesseeName: v.lesseeName,
    lesseeIdCard: v.lesseeIdCard,
    lesseeAddress: v.lesseeAddress,
    contractDate: v.contractDate || null,
    startDate: v.startDate || null,
    endDate: v.endDate || null,
    contractYears: Number(v.contractYears) || 0,
    rentPerMonth: Number(v.rentPerMonth) || 0,
    paymentDueDay: v.paymentDueDay,
    bankName: v.bankName,
    bankAccountNumber: v.bankAccountNumber,
    bankAccountName: v.bankAccountName,
    depositAmount: Number(v.depositAmount) || 0,
    cleaningFee: Number(v.cleaningFee) || 0,
    receiptDate: v.receiptDate || null,
    reservationDepositAmount: Number(v.reservationDepositAmount) || 0,
    damageDepositAmount: Number(v.damageDepositAmount) || 0,
    checklistItems: v.checklistItems,
  };
}
