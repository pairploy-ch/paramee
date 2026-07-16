"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5">
      <button
        aria-label="ปิด"
        className="absolute inset-0 cursor-default"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-heading text-base font-semibold text-maroon-dark">{title}</h2>
            <p className="mt-1.5 text-sm text-ink/60">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="border border-cream-dark px-4 py-2 text-sm font-medium text-ink/60 transition-colors hover:border-gold-dark hover:text-gold-dark disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "กำลังลบ..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
