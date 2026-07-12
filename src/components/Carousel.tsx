"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({
  children,
  itemClassName,
  dotClassName,
  dotsWrapperClassName,
}: {
  children: React.ReactNode[];
  itemClassName: string;
  dotClassName?: (active: boolean) => string;
  dotsWrapperClassName?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });

  const [activeIndex, setActiveIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setPageCount(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, children.length]);

  function updateActiveFromScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    setActiveIndex(Math.min(Math.round(el.scrollLeft / el.clientWidth), pageCount - 1));
  }

  function goToPage(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  const onWindowMouseMove = useCallback((e: MouseEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.isDown) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  }, []);

  const onWindowMouseUp = useCallback(() => {
    const el = scrollerRef.current;
    drag.current.isDown = false;
    if (el) {
      el.style.scrollSnapType = "";
      const index = Math.round(el.scrollLeft / el.clientWidth);
      goToPage(index);
    }
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onWindowMouseMove]);

  function onMouseDown(e: React.MouseEvent) {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { isDown: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.style.scrollSnapType = "none";
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
  }

  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [onWindowMouseMove, onWindowMouseUp]);

  const hasMultiplePages = pageCount > 1;

  return (
    <div>
      <div className="relative px-0 lg:px-14">
        <div
          ref={scrollerRef}
          onScroll={updateActiveFromScroll}
          onMouseDown={onMouseDown}
          onClickCapture={onClickCapture}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 cursor-grab select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children.map((child, i) => (
            <div key={i} className={itemClassName}>
              {child}
            </div>
          ))}
        </div>

        {hasMultiplePages && (
          <>
            <button
              aria-label="ก่อนหน้า"
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold-dark bg-white text-gold-dark shadow-md transition-colors hover:bg-maroon hover:text-cream lg:flex"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              aria-label="ถัดไป"
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold-dark bg-white text-gold-dark shadow-md transition-colors hover:bg-maroon hover:text-cream lg:flex"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      {hasMultiplePages && (
        <div className={dotsWrapperClassName ?? "mt-6 flex justify-center gap-2"}>
          {Array.from({ length: pageCount }).map((_, i) =>
            dotClassName ? (
              <button key={i} aria-label={`ไปหน้าที่ ${i + 1}`} onClick={() => goToPage(i)} className={dotClassName(i === activeIndex)} />
            ) : (
              <button
                key={i}
                aria-label={`ไปหน้าที่ ${i + 1}`}
                onClick={() => goToPage(i)}
                className={`h-2 transition-all ${
                  i === activeIndex ? "w-7 bg-maroon" : "w-2 bg-gold-light/60 hover:bg-gold"
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
