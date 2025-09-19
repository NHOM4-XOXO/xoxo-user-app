"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedBanner({
  slides = [],
  interval = 5000,
  className = "",
  onCtaClick,
}) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!slides.length) return;
    timer.current = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer.current);
  }, [slides.length, interval]);

  if (!slides?.length) return null;

  const slide = slides[idx];

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-2xl border",
        "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm",
        "border-neutral-200/70 dark:border-neutral-800",
        className,
      ].join(" ")}
      style={{ aspectRatio: "16 / 6" }}
    >
      <Image
        src={slide.img}
        alt={slide.title || "banner"}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex items-end">
        <div className="max-w-xl text-white drop-shadow">
          <div className="text-sm/none opacity-90 mb-1">{slide.subtitle}</div>
          <h3 className="text-xl sm:text-2xl font-semibold">{slide.title}</h3>

          {slide.cta ? (
            <div className="mt-3">
              {onCtaClick ? (
                <button
                  onClick={() => onCtaClick(slide)}
                  className="rounded-xl px-4 py-2 text-m active:scale-95 transition-all duration-300 cursor-pointer
                             bg-blue-300 text-neutral-900 hover:bg-blue-300/80 border-blue-500/50"
                >
                  {slide.cta}
                </button>
              ) : slide.href ? (
                <Link
                  href={slide.href}
                  className="inline-block rounded-xl border px-4 py-2 text-sm cursor-pointer
                             bg-white/90 text-neutral-900 hover:bg-white
                             active:scale-[0.98] transition"
                >
                  {slide.cta}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={[
              "h-2 w-2 rounded-full cursor-pointer transition-all duration-300",
              i === idx
                ? "bg-blue-500 scale-110 shadow-md"
                : "bg-white/50 hover:bg-blue-300/80",
            ].join(" ")}
            aria-label={`Chuyển đến slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
