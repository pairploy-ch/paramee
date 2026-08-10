import type { Metadata } from "next";
import PhotoShootForm from "./PhotoShootForm";

export const metadata: Metadata = {
  title: "นัดถ่ายภาพ | Paramee",
};

export default function PhotoShootPage() {
  return <PhotoShootForm />;
}
