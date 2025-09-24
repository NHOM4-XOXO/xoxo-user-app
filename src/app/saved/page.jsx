"use client";

import React, { useMemo, useState } from "react";
import TabNav from "@/components/ux/TabNav";
import { SavedCard } from "@/components/cards/SavedCard";
import { useSaved } from "@/utils/savedStore";
import MonthCalendar from "@/components/ux/MonthCalendar";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";
function groupKey(ts) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function groupLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function parseVNTimeLabelToISO(tl) {
  if (!tl) return null;
  const dot = tl.split("·").map((s) => s.trim());
  let timePart = "",
    datePart = "";
  if (dot.length === 2) {
    timePart = dot[0];
    datePart = dot[1];
  } else {
    const m = tl.match(/(\d{1,2}:\d{2})?\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (m) {
      timePart = m[1] || "";
      datePart = m[2];
    } else {
      datePart = tl.trim();
    }
  }
  const dm = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!dm) return null;
  const d = dm[1].padStart(2, "0"),
    m = dm[2].padStart(2, "0"),
    y = dm[3];
  const hm = (timePart || "09:00").split(":");
  const hh = String(hm[0] || "09").padStart(2, "0");
  const mm = String(hm[1] || "00").padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function Dropdown({ id, openId, setOpenId, value, onChange, options, title }) {
  const open = openId === id;
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpenId(open ? null : id)}
        title={title}
        className="flex items-center justify-between gap-2 w-40 px-3 py-2 text-sm rounded-xl border
                   bg-white/80 dark:bg-neutral-900/70 backdrop-blur-sm
                   border-neutral-200/70 dark:border-neutral-800
                   hover:border-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-300
                   shadow-sm transition cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className="w-4 h-4 opacity-70 text-blue-600" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute mt-1 w-full rounded-xl border bg-white dark:bg-neutral-900 shadow-lg z-20
                     border-neutral-200/70 dark:border-neutral-800 overflow-hidden"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpenId(null);
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition
                          hover:bg-blue-50 dark:hover:bg-blue-900/30
                          ${
                            opt.value === value ? "bg-blue-600 text-white" : ""
                          }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SavedPage() {
  const { items, remove, toggle } = useSaved();

  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [order, setOrder] = useState("newest");
  const [view, setView] = useState("list");
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    let list = items || [];
    if (type !== "all")
      list = list.filter((it) => (it.type || "other") === type);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((it) => {
        const hay = `${it.title} ${it.category || ""} ${it.location || ""} ${
          it.excerpt || ""
        }`.toLowerCase();
        return hay.includes(needle);
      });
    }
    if (order === "pinned") {
      list = [...list].sort((a, b) => {
        const ap = a.pinned ? 1 : 0;
        const bp = b.pinned ? 1 : 0;
        if (bp !== ap) return bp - ap;
        return (b.savedAt || 0) - (a.savedAt || 0);
      });
    } else if (order === "oldest") {
      list = [...list].sort((a, b) => (a.savedAt || 0) - (b.savedAt || 0));
    } else {
      list = [...list].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    }
    return list;
  }, [items, q, type, order]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of filtered) {
      const key = groupKey(it.savedAt || Date.now());
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    }
    return Array.from(map.entries()).sort((a, b) =>
      order === "oldest" ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])
    );
  }, [filtered, order]);

  const calendarEvents = useMemo(
    () =>
      (items || [])
        .filter((it) => it.type === "event" && (it.datetime || it.timeLabel))
        .map((it) => {
          const datetime = it.datetime || parseVNTimeLabelToISO(it.timeLabel);
          return {
            id: it.id,
            title: it.title,
            datetime,
            timeLabel: it.timeLabel,
            location: it.location,
          };
        })
        .filter((it) => !!it.datetime),
    [items]
  );

  return (
    <div className="pt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <main className="space-y-4 relative">
        <div className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-400/10 blur-2xl" />

        <TabNav className="mt-2" />

        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 ">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Đã lưu</h1>
            <p className="opacity-70">
              Quản lý những nội dung & sự kiện bạn quan tâm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm trong mục đã lưu..."
              className="rounded-xl border px-3 py-2 text-sm
             bg-white/80 dark:bg-neutral-900/70 backdrop-blur-sm
             border-neutral-200/70 dark:border-neutral-800
             focus:outline-none focus:ring-2 focus:ring-blue-400
             hover:border-blue-300/60 shadow-sm transition"
            />

            <Dropdown
              id="type"
              openId={openId}
              setOpenId={setOpenId}
              value={type}
              onChange={setType}
              title="Loại nội dung"
              options={[
                { value: "all", label: "Tất cả" },
                { value: "event", label: "Sự kiện" },
                { value: "article", label: "Bài viết" },
                { value: "video", label: "Video" },
                { value: "game", label: "Game" },
                { value: "other", label: "Khác" },
              ]}
            />

            <Dropdown
              id="order"
              openId={openId}
              setOpenId={setOpenId}
              value={order}
              onChange={setOrder}
              title="Sắp xếp"
              options={[
                { value: "newest", label: "Mới nhất" },
                { value: "oldest", label: "Cũ nhất" },
                { value: "pinned", label: "Ghim trước" },
              ]}
            />

            <div className="flex rounded-xl border overflow-hidden">
              <button
                onClick={() => {
                  setView("list");
                  setOpenId(null);
                }}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
              >
                Danh sách
              </button>
              <button
                onClick={() => {
                  setView("calendar");
                  setOpenId(null);
                }}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  view === "calendar"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
              >
                Lịch
              </button>
            </div>
          </div>
        </header>

        {view === "calendar" ? (
          <MonthCalendar
            events={calendarEvents}
            onSelectEvent={(e) => {
              alert(
                `${e.title}\n${e.timeLabel || e.datetime}\n${e.location || ""}`
              );
            }}
          />
        ) : grouped.length ? (
          <section className="space-y-6">
            {grouped.map(([isoDay, arr]) => (
              <div key={isoDay}>
                <h3 className="text-sm font-medium opacity-70 mb-3">
                  {groupLabel(isoDay)}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {arr.map((it) => (
                    <SavedCard
                      key={it.id}
                      item={it}
                      onRemove={remove}
                      onTogglePin={toggle}
                      showTypeBadge
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed p-12 text-center opacity-80">
            <div className="font-semibold">Chưa có gì trong Đã lưu</div>
            <div className="text-sm">
              Quay lại mục Sự kiện và bấm{" "}
              <span className="font-medium">Lưu</span> để thêm vào đây.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
