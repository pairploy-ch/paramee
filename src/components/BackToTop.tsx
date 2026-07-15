"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="กลับขึ้นด้านบน"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 z-40 flex h-11 w-11 rotate-45 items-center justify-center border border-gold-light/50 bg-maroon-dark text-gold-light shadow-lg transition-colors hover:bg-maroon"
    >
      <ArrowUp className="h-4 w-4 -rotate-45" strokeWidth={2} />
    </button>
  );
}
