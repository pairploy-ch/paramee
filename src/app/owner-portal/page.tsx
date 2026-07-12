import type { Metadata } from "next";
import OwnerPortal from "./OwnerPortal";

export const metadata: Metadata = {
  title: "Owner Portal | Paramee",
};

export default function OwnerPortalPage() {
  return <OwnerPortal />;
}
