"use client";
import React, { useState } from "react";
import TabNav from "@/components/ux/TabNav";
import GameCard from "@/components/cards/GameCard";
import { EmptyState } from "@/components/ux/EmptyState";
import { useSaved } from "@/utils/savedStore";
import ModalPlayGame from "@/components/modals/ModalPlayGame";

const gamesSeed = [
  {
    id: "guessnumber",
    title: "Guess Number",
    platform: "Web",
    tags: ["puzzle"],
    desc: "Đoán số bí mật, game kinh điển.",
    cover:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1280&auto=format&fit=crop",
    playUrl: "/playables/guessnumber/index.html",
    status: "released",
  },
  {
    id: "pig",
    title: "Pig Dice Game",
    platform: "Web",
    tags: ["dice", "party"],
    desc: "Đổ xúc xắc vui nhộn, ai đạt điểm trước sẽ thắng.",
    cover:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1280&auto=format&fit=crop",
    playUrl: "/playables/pig/index.html",
    status: "released",
  },
  {
    id: "skyblocks",
    title: "Sky Blocks",
    platform: "Web",
    tags: ["puzzle", "casual"],
    desc: "Xếp khối trên mây, hack não và thư giãn.",
    cover:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1280&auto=format&fit=crop",
    playUrl: null,
    status: "coming",
  },
  {
    id: "flappy",
    title: "Flappy Bird Neo",
    platform: "Web",
    tags: ["arcade"],
    desc: "Bay qua các ống, thử thách huyền thoại.",
    cover:
      "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?q=80&w=1280&auto=format&fit=crop",
    playUrl: null,
    status: "coming",
  },
  {
    id: "match3",
    title: "Candy Match 3",
    platform: "Web",
    tags: ["puzzle", "match3"],
    desc: "Xếp kẹo 3 ô – thư giãn mỗi ngày.",
    cover:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?q=80&w=1280&auto=format&fit=crop",
    playUrl: null,
    status: "coming",
  },
  {
    id: "runner",
    title: "City Runner",
    platform: "Web",
    tags: ["runner", "arcade"],
    desc: "Chạy bền trong thành phố, né chướng ngại vật.",
    cover:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1280&auto=format&fit=crop",
    playUrl: null,
    status: "coming",
  },
];

export default function GamesPage() {
  const [games] = useState(gamesSeed);
  const { addItem, remove, isSaved } = useSaved();

  const [open, setOpen] = useState(false);
  const [curGame, setCurGame] = useState(null);

  const onPlay = (game) => {
    setCurGame(game);
    setOpen(true);
  };

  const toggleSave = (game) => {
    if (isSaved(game.id)) {
      remove(game.id);
    } else {
      addItem({
        id: game.id,
        type: "game",
        title: game.title,
        cover: game.cover,
        platform: game.platform,
        tags: game.tags,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <div className="pt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <main className="space-y-4 relative">
        <div className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-400/10 blur-2xl" />

        <TabNav className="mt-2" />

        <header className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chơi game</h1>
            <p className="opacity-70">
              Mini game chạy trực tiếp trong trình duyệt.
            </p>
          </div>

          <button
            className={[
              "rounded-xl border px-4 py-2 text-sm cursor-pointer transition active:scale-[0.98]",
              "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm",
              "hover:bg-blue-50 dark:hover:bg-blue-900/30",
              "border-neutral-200/70 dark:border-neutral-800",
            ].join(" ")}
            onClick={() => alert("Sắp có!")}
          >
            + Đề xuất game
          </button>
        </header>

        {games?.length ? (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((g, i) => (
              <div
                key={g.id}
                className="h-full animate-[fadeIn_300ms_ease-out]"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <GameCard
                  game={g}
                  onPlay={onPlay}
                  onToggleSave={toggleSave}
                  saved={isSaved(g.id)}
                  priority={i === 0}
                />
              </div>
            ))}
          </section>
        ) : (
          <EmptyState
            title="Chưa có game"
            hint="Danh sách game đang được cập nhật."
          />
        )}
      </main>

      <ModalPlayGame
        open={open}
        onClose={() => setOpen(false)}
        src={curGame?.playUrl || "/games/demo/index.html"}
        title={curGame?.title || "Play Game"}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
