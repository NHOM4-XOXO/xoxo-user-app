import Image from "next/image";
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  Bookmark,
  BookmarkCheck,
  Ticket,
} from "lucide-react";
import { coverForEvent } from "@/utils/imageSources";

export function EventCard({
  evt,
  onRegister,
  onSchedule,
  onToggleSave,
  onBuy,
  saved = false,
  showActions = true,
}) {
  const coverSrc =
    (evt?.cover && evt.cover.trim()) || coverForEvent(evt, 960, 540);

  return (
    <article
      className={[
        "group rounded-2xl border bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10",
        "border-neutral-200/70 dark:border-neutral-800",
        "hover:border-blue-200 dark:hover:border-blue-500/40 cursor-pointer",
      ].join(" ")}
    >
      <div
        className="relative w-full overflow-hidden rounded-t-2xl"
        style={{ aspectRatio: "16 / 9" }}
      >
        <Image
          src={coverSrc}
          alt={evt?.title || "event cover"}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={false}
        />
        {evt?.category && (
          <div className="absolute left-3 top-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium
                            bg-white/80 text-neutral-900 backdrop-blur border border-white/60 shadow-sm
                            dark:bg-neutral-900/70 dark:text-white dark:border-neutral-800"
            >
              <Tag className="w-3 h-3" />
              {evt.category}
            </span>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4">
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {evt.title}
        </h3>

        <div className="mt-2 grid gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-80" />
            <span className="opacity-90">{evt.timeLabel}</span>
          </div>
          {evt.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 opacity-80" />
              <span className="opacity-90">{evt.location}</span>
            </div>
          )}
          {typeof evt.attendees === "number" && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 opacity-80" />
              <span className="opacity-90">{evt.attendees} người quan tâm</span>
            </div>
          )}
        </div>

        {evt.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {evt.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full border bg-white/70 dark:bg-white/5
                           border-neutral-200/70 dark:border-neutral-800"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onToggleSave?.(evt)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm
                          active:scale-[0.98] transition cursor-pointer
                          border-neutral-200/70 dark:border-neutral-800
                          ${
                            saved
                              ? "bg-blue-600 text-white dark:bg-blue-500"
                              : "bg-white/60 dark:bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          }`}
              title={saved ? "Bỏ lưu" : "Lưu"}
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              {saved ? "Đã lưu" : "Lưu"}
            </button>

            {onRegister && (
              <button
                onClick={() => onRegister(evt)}
                className="rounded-xl border px-3 py-1.5 text-sm cursor-pointer
                           border-neutral-200/70 dark:border-neutral-800
                           bg-white/60 dark:bg-transparent
                           hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-[0.98] transition"
              >
                Đăng ký
              </button>
            )}

            {onSchedule && (
              <button
                onClick={() => onSchedule(evt)}
                className="rounded-xl border px-3 py-1.5 text-sm cursor-pointer
                           border-neutral-200/70 dark:border-neutral-800
                           bg-white/60 dark:bg-transparent
                           hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-[0.98] transition"
              >
                Xem lịch
              </button>
            )}

            {onBuy && (
              <button
                onClick={() => onBuy(evt)}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm
                           cursor-pointer border-neutral-200/70 dark:border-neutral-800
                           bg-white/60 dark:bg-transparent
                           hover:bg-green-50 dark:hover:bg-green-900/30 active:scale-[0.98] transition"
              >
                <Ticket className="w-4 h-4" />
                Lấy vé
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
