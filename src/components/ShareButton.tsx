"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

export default function ShareButton({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 border border-gold-dark px-5 py-3 text-sm font-medium text-gold-dark transition-colors hover:bg-cream-dark ${className}`}
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={2} /> : <Share2 className="h-4 w-4" strokeWidth={1.75} />}
      {copied ? t.propertyDetail.linkCopied : t.propertyDetail.share}
    </button>
  );
}
