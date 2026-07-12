"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { PropertyStatus } from "@/lib/types";

export default function PropertyGallery({
  images,
  name,
  status,
}: {
  images: string[];
  name: string;
  status: PropertyStatus;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function prev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function next() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      <div className="relative grid h-[280px] grid-cols-3 gap-2 overflow-hidden rounded-2xl sm:h-[420px]">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="relative col-span-2 cursor-zoom-in"
          aria-label="ดูรูปทั้งหมด"
        >
          <Image
            src={images[0]}
            alt={name}
            fill
            sizes="(min-width: 1024px) 700px, 100vw"
            priority
            className="object-cover"
          />
        </button>
        <div className="flex h-full flex-col gap-2">
          {images.slice(1).map((src, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setOpenIndex(i + 1)}
              className="relative flex-1 cursor-zoom-in"
              aria-label="ดูรูปทั้งหมด"
            >
              <Image
                src={src}
                alt={`${name} รูปที่ ${i + 2}`}
                fill
                sizes="240px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <div className="absolute left-4 top-4">
          <StatusBadge status={status} />
        </div>
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="ปิด"
            onClick={() => setOpenIndex(null)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-cream/30 text-cream hover:bg-cream/10"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="ก่อนหน้า"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}

          <div
            className="relative h-full max-h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${name} รูปที่ ${openIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="ถัดไป"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-cream/70">
            {openIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
