import type { Metadata } from "next";
import ManagePropertiesAdmin from "./ManagePropertiesAdmin";

export const metadata: Metadata = {
  title: "Admin: จัดการทรัพย์ | Paramee",
};

export default function ManagePropertiesPage() {
  return <ManagePropertiesAdmin />;
}
