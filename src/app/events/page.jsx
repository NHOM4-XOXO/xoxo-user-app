"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import FilterBar from "@/components/ux/FilterBar";
import TabNav from "@/components/ux/TabNav";
import { EventCard } from "@/components/cards/EventCard";
import { EmptyState } from "@/components/ux/EmptyState";
import AddEventModal from "@/components/modals/AddEventModal";
import FeaturedBanner from "@/components/hero/FeaturedBanner";

import { useSaved } from "@/utils/savedStore";
import { bannerForTopic, coverForEvent } from "@/utils/imageSources";

export const dynamic = "force-dynamic";
const slidesByTopic = {
  esport: bannerForTopic("esport").map((url) => ({
    title: "E-Sports tuần này",
    subtitle: "Giải đấu & scrims mở đăng ký",
    cta: "Xem ngay",
    href: "/events?topic=esport",
    img: url,
  })),
  basketball: bannerForTopic("basketball").map((url) => ({
    title: "Bóng rổ cuối tuần",
    subtitle: "Pickup & mini tourney",
    cta: "Tham gia",
    href: "/events?topic=basketball",
    img: url,
  })),
  tech: bannerForTopic("tech").map((url) => ({
    title: "Tech Talks · AI/Web",
    subtitle: "Xu hướng mới nhất",
    cta: "Lấy vé",
    action: "buy",
    href: "/events?topic=tech",
    img: url,
  })),
  music: bannerForTopic("music").map((url) => ({
    title: "Music Jam",
    subtitle: "Acoustic & live",
    cta: "Vào xem",
    href: "/events?topic=music",
    img: url,
  })),
  chill: bannerForTopic("chill").map((url) => ({
    title: "Chill Meetup",
    subtitle: "Boardgame & coffee",
    cta: "Xem thêm",
    href: "/events?topic=chill",
    img: url,
  })),
};
const topicOrder = ["all", "esport", "basketball", "tech", "music", "chill"];

// ---------- Seed data demo ----------
const seed = [
  {
    id: 1,
    title: "Valorant Community Cup",
    datetime: "2025-09-26T19:30",
    location: "TP.HCM",
    city: "hcm",
    attendees: 220,
    category: "esport",
    tags: ["valorant", "esport"],
    cover: "",
  },
  {
    id: 2,
    title: "League Scrims Night",
    datetime: "2025-09-28T20:00",
    location: "Hà Nội",
    city: "hn",
    attendees: 160,
    category: "esport",
    tags: ["lol", "esport"],
    cover: "",
  },
  {
    id: 3,
    title: "PUBG Duo Showdown",
    datetime: "2025-10-02T21:00",
    location: "Online",
    city: "online",
    attendees: 300,
    category: "esport",
    tags: ["pubg", "esport"],
    cover: "",
  },
  {
    id: 4,
    title: "Pickup Basketball D7",
    datetime: "2025-09-27T17:00",
    location: "TP.HCM",
    city: "hcm",
    attendees: 48,
    category: "basketball",
    tags: ["pickup", "sports"],
    cover: "",
  },
  {
    id: 5,
    title: "3x3 Hà Nội",
    datetime: "2025-10-01T18:00",
    location: "Hà Nội",
    city: "hn",
    attendees: 76,
    category: "basketball",
    tags: ["3x3", "sports"],
    cover: "",
  },
  {
    id: 6,
    title: "Tech Talk: AI Agents",
    datetime: "2025-09-29T19:00",
    location: "TP.HCM",
    city: "hcm",
    attendees: 120,
    category: "tech",
    tags: ["ai", "talk"],
    cover: "",
  },
  {
    id: 7,
    title: "Web Perf Mastery",
    datetime: "2025-10-03T19:00",
    location: "Online",
    city: "online",
    attendees: 95,
    category: "tech",
    tags: ["web", "perf"],
    cover: "",
  },
  {
    id: 8,
    title: "Music Jam Night",
    datetime: "2025-09-30T20:00",
    location: "TP.HCM",
    city: "hcm",
    attendees: 60,
    category: "music",
    tags: ["acoustic"],
    cover: "",
  },
  {
    id: 9,
    title: "Boardgame Meetup",
    datetime: "2025-10-04T15:00",
    location: "Hà Nội",
    city: "hn",
    attendees: 24,
    category: "chill",
    tags: ["boardgame"],
    cover: "",
  },
  {
    id: 10,
    title: "Retro Arcade Night",
    datetime: "2025-10-05T19:30",
    location: "Online",
    city: "online",
    attendees: 140,
    category: "esport",
    tags: ["arcade"],
    cover: "",
  },
  {
    id: 11,
    title: "JS Hack & Learn",
    datetime: "2025-10-06T19:00",
    location: "TP.HCM",
    city: "hcm",
    attendees: 80,
    category: "tech",
    tags: ["js", "hack"],
    cover: "",
  },
  {
    id: 12,
    title: "Streetball Thu Đức",
    datetime: "2025-10-07T17:30",
    location: "TP.HCM",
    city: "hcm",
    attendees: 52,
    category: "basketball",
    tags: ["streetball"],
    cover: "",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState(seed);
  const [open, setOpen] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [city, setCity] = useState("all");

  const router = useRouter();
  const { addEvent, remove, isSaved } = useSaved();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const slides = slidesByTopic[selectedTopic] || slidesByTopic.tech;

  const withBase = useMemo(
    () => events.map((e) => ({ ...e, date: new Date(e.datetime) })),
    [events]
  );

  const handleBannerCTA = (slide) => {
    if (slide?.action === "buy") {
      alert('Tính năng "Lấy vé" đang phát triển.');
      return;
    }
    if (slide?.href) {
      window.location.href = slide.href;
    }
  };

  const withLabels = useMemo(() => {
    if (!mounted)
      return withBase.map((e) => ({
        ...e,
        timeLabel: e.datetime.replace("T", " "),
      }));
    return withBase.map((e) => ({
      ...e,
      timeLabel: e.date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
  }, [withBase, mounted]);

  const filtered = useMemo(() => {
    const base = withLabels.filter((e) => {
      if (selectedTopic !== "all" && e.category !== selectedTopic) return false;
      if (city !== "all" && e.city !== city) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${e.title} ${e.location} ${(e.tags || []).join(" ")} ${
          e.category
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!mounted || timeRange === "all") return base;

    const now = new Date();
    const endWeek = new Date();
    endWeek.setDate(now.getDate() + 7);
    const endMonth = new Date();
    endMonth.setMonth(now.getMonth() + 1);

    return base.filter((e) => {
      if (timeRange === "today") {
        return (
          e.date.getDate() === now.getDate() &&
          e.date.getMonth() === now.getMonth() &&
          e.date.getFullYear() === now.getFullYear()
        );
      }
      if (timeRange === "week") return e.date >= now && e.date <= endWeek;
      if (timeRange === "month") return e.date >= now && e.date <= endMonth;
      return true;
    });
  }, [withLabels, selectedTopic, city, query, timeRange, mounted]);

  const handleSearch = (q) => setQuery(q);
  const handleChange = (k, v) => {
    if (k === "time") setTimeRange(v);
    if (k === "where") setCity(v);
  };

  const onRegister = (evt) => alert(`Đã đăng ký quan tâm: ${evt.title}`);
  const onSchedule = (evt) => alert(`Lịch thi đấu / Agenda cho: ${evt.title}`);

  const onBuy = (evt) => {
    alert(`Tính năng "Lấy vé" cho sự kiện "${evt.title}" đang phát triển.`);
  };

  const handleToggleSave = (evt) => {
    if (isSaved(evt.id)) {
      remove(evt.id);
      return;
    }
    const cover =
      (evt.cover && evt.cover.trim()) || coverForEvent(evt, 960, 540);

    const savedItem = {
      id: evt.id,
      title: evt.title,
      date: evt.datetime || evt.date || undefined,
      datetime: evt.datetime || undefined,
      timeLabel: evt.timeLabel,
      location: evt.location,
      cover,
      category: evt.category,
      tags: evt.tags,
      type: "event",
      savedAt: Date.now(),
    };
    addEvent(savedItem);
    router.push("/saved");
  };

  return (
    <div className="pt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <main className="space-y-4 relative">
        <div className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-400/10 blur-2xl" />

        <TabNav className="mt-2" />

        <div className="flex flex-wrap gap-2">
          {topicOrder.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`text-sm px-3 py-1.5 rounded-full border transition cursor-pointer ${
                selectedTopic === t
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
              }`}
            >
              {t === "all" ? "Tất cả" : t}
            </button>
          ))}
        </div>

        <FeaturedBanner
          slides={slides}
          className="mt-1"
          onCtaClick={handleBannerCTA}
        />

        <header className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sự kiện</h1>
            <p className="opacity-70">
              Bạn có thể lưu sự kiện để xem lại ở mục Đã lưu.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border px-4 py-2 text-sm cursor-pointer transition active:scale-[0.98]
                       bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm
                       hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            + Thêm sự kiện
          </button>
        </header>

        <FilterBar
          placeholder="Tìm sự kiện, địa điểm, từ khóa..."
          onSearch={handleSearch}
          onChange={handleChange}
          filters={[
            {
              key: "time",
              label: "Thời gian",
              options: [
                { value: "all", label: "Tất cả" },
                { value: "today", label: "Hôm nay" },
                { value: "week", label: "Tuần này" },
                { value: "month", label: "Tháng này" },
              ],
            },
            {
              key: "where",
              label: "Khu vực",
              options: [
                { value: "all", label: "Tất cả" },
                { value: "hcm", label: "TP.HCM" },
                { value: "hn", label: "Hà Nội" },
                { value: "online", label: "Online" },
              ],
            },
          ]}
        />

        {filtered?.length ? (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e) => (
              <EventCard
                key={e.id}
                evt={e}
                onRegister={onRegister}
                onSchedule={onSchedule}
                onToggleSave={handleToggleSave}
                onBuy={onBuy}
                saved={isSaved(e.id)}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            title="Không tìm thấy"
            hint="Thử đổi bộ lọc hoặc từ khóa khác."
          />
        )}

        <AddEventModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            const dt = data?.datetime ? new Date(data.datetime) : new Date();
            const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);

            const newEvt = {
              id: Date.now(),
              title: data.title || "Sự kiện mới",
              datetime: iso,
              location: data.location || "Online",
              city: "online",
              attendees: 0,
              category: data.category || "general",
              tags: [data.category || "general"],
              cover: data.cover && data.cover.trim() ? data.cover : "",
            };

            setEvents((prev) => [newEvt, ...prev]);

            if (data.saved) {
              const coverSaved =
                (data.cover && data.cover.trim()) ||
                coverForEvent(newEvt, 960, 540);

              const savedItem = {
                ...newEvt,
                cover: coverSaved,
                date: iso,
                datetime: iso,
                type: "event",
                timeLabel: mounted
                  ? new Date(iso).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : iso.replace("T", " "),
                savedAt: Date.now(),
              };
              addEvent(savedItem);
              router.push("/saved");
            }

            setOpen(false);
          }}
        />
      </main>
    </div>
  );
}
