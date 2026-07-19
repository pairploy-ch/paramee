import type { Metadata } from "next";
import LeaseContractForm from "../LeaseContractForm";

export const metadata: Metadata = {
  title: "Admin: เพิ่มสัญญาเช่า | Paramee",
};

export default function NewLeaseContractPage() {
  return <LeaseContractForm />;
}
