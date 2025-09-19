import Image from "next/image";
import { Monitor, Gamepad2, Bookmark, BookmarkCheck, Tag } from "lucide-react";

export default function GameCard({
  game,
  onPlay,
  onToggleSave,
  saved = false,
  priority = false,
}) {
  const cover = (game?.cover && game.cover.trim()) || "";
  const platform = game?.platform || "Web";
  const tags = game?.tags || [];
  const isComing = game?.status === "coming";

  return (
    <article
      className={[
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10",
        "border border-transparent hover:border-blue-300/50",
        "h-full cursor-pointer",
      ].join(" ")}
    >
      <div className="relative h-44 w-full overflow-hidden">
        {cover && (
          <Image
            src={cover}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        )}

        <span
          className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium
              bg-white/85 text-neutral-900 backdrop-blur border border-white/60 shadow-sm
              dark:bg-neutral-900/80 dark:text-white dark:border-neutral-800"
        >
          <Monitor className="w-3 h-3" />
          {platform}
        </span>

        {isComing && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <span className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600/90 rounded-lg shadow">
              Sắp phát hành
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {game.title}
        </h3>
        {game.desc && (
          <p className="mt-1 text-sm opacity-80 line-clamp-2">{game.desc}</p>
        )}

        {tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full border bg-white/60 dark:bg-white/5 border-neutral-200/70 dark:border-neutral-800 inline-flex items-center gap-1"
              >
                <Tag className="w-3 h-3" /> {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex gap-2 pt-3">
          <button
            onClick={() => !isComing && onPlay?.(game)}
            disabled={isComing}
            aria-disabled={isComing}
            className={[
              "flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition",
              "border-neutral-200/70 dark:border-neutral-800",
              isComing
                ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] cursor-pointer",
            ].join(" ")}
            title={isComing ? "Sắp phát hành" : "Chơi ngay"}
          >
            <Gamepad2 className="w-4 h-4" />
            {isComing ? "Sắp phát hành" : "Chơi ngay"}
          </button>

          <button
            onClick={() => onToggleSave?.(game)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium 
                        active:scale-[0.98] transition cursor-pointer
                        border-neutral-200/70 dark:border-neutral-800
                        ${
                          saved
                            ? "bg-white text-blue-700 border-blue-600"
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
        </div>
      </div>
    </article>
  );
}
