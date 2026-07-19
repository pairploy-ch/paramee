import type { Metadata } from "next";
import CoAgentRegisterForm from "./CoAgentRegisterForm";

export const metadata: Metadata = {
  title: "สมัคร Co-Agent | Paramee Asset",
};

export default function CoAgentRegisterPage() {
  return <CoAgentRegisterForm />;
}
