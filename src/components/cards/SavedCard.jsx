"use client";
import React from "react";
import Image from "next/image";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Calendar,
  Gamepad2,
  FileText,
  Video,
} from "lucide-react";
import { coverForEvent } from "@/utils/imageSources";

export function SavedCard({
  item,
  onRemove,
  onTogglePin,
  showTypeBadge = false,
}) {
  const { id, title, cover, type, location, timeLabel, datetime, pinned } =
    item;

  const coverSrc =
    (cover && cover.trim()) ||
    (type === "event" ? coverForEvent(item, 960, 540) : "");

  const icon =
    type === "event"
      ? Calendar
      : type === "game"
      ? Gamepad2
      : type === "article"
      ? FileText
      : type === "video"
      ? Video
      : Bookmark;
  const Icon = icon;

  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden 
                 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10
                 border border-neutral-200/70 dark:border-neutral-800 hover:border-blue-300/50 h-full cursor-pointer"
    >
      {coverSrc && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={coverSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          {showTypeBadge && (
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full 
                         border bg-white/60 dark:bg-white/5"
            >
              <Icon className="w-3 h-3" />
              {type}
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1 text-sm opacity-80">
          {timeLabel && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {timeLabel}
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {location}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-2 border-t text-sm">
        <button
          onClick={() => onRemove?.(id)}
          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
          title="Xóa khỏi đã lưu"
        >
          <BookmarkCheck className="w-4 h-4" /> Bỏ lưu
        </button>
      </div>
    </article>
  );
}
