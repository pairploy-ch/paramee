import type { Metadata } from "next";
import LeadsAdmin from "./LeadsAdmin";

export const metadata: Metadata = {
  title: "Admin: Track Lead | Paramee",
};

export default function AdminLeadsPage() {
  return <LeadsAdmin />;
}
