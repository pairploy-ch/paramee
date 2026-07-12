import type { Metadata } from "next";
import AddPropertyForm from "./AddPropertyForm";

export const metadata: Metadata = {
  title: "Admin: เพิ่มทรัพย์ | Paramee",
};

export default function AdminPropertiesPage() {
  return <AddPropertyForm />;
}
