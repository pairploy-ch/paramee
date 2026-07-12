import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "นัดชมทรัพย์ | Paramee",
};

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
