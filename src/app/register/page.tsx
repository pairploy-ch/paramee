import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "สมัครสมาชิกเจ้าของทรัพย์ | Paramee",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
