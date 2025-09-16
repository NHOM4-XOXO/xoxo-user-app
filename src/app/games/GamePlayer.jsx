"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function GamePlayer({ slug }) {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/data/games.json")
      .then((r) => r.json())
      .then(setGames)
      .catch((e) => setError(e?.message || "Load games failed"));
  }, []);

  const game = useMemo(
    () => (slug ? games.find((g) => g.slug === slug) : null),
    [games, slug]
  );

  if (error) {
    return (
      <div className="p-4 text-red-600">Lỗi tải danh sách game: {error}</div>
    );
  }

  if (slug) {
    if (!games.length) {
      return <div className="p-4">Đang tải game…</div>;
    }
    if (!game) {
      return (
        <div className="p-4">
          Không tìm thấy game.{" "}
          <button
            className="underline text-blue-600"
            onClick={() => router.push("/games")}
          >
            Quay lại danh sách
          </button>
        </div>
      );
    }

    return (
      <main className="p-4 space-y-4">
        <button className="underline" onClick={() => router.push("/games")}>
          ← Danh sách game
        </button>
        <h1 className="text-2xl font-bold">{game.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{game.desc}</p>

        {/* Demo: mở game trong iframe (nếu site cho phép) */}
        <div className="w-full aspect-video border rounded-lg overflow-hidden">
          <iframe
            src={game.url}
            className="w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </main>
    );
  }

  // Trang danh sách: không có slug -> liệt kê
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Games</h1>

      {!games.length ? (
        <div className="mt-4">Đang tải danh sách…</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => router.push(`/games/${g.slug}`)}
              className="text-left border rounded-lg p-3 hover:shadow"
            >
              {g.cover ? (
                // Nếu có ảnh cover trong public/images/games/…
                <img
                  src={g.cover}
                  alt={g.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : null}
              <div className="font-medium">{g.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {g.desc}
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
