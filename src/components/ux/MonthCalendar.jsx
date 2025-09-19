"use client";
import React, { useMemo, useState, useEffect } from "react";

function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfMonth(d) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + 1, 0);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function toKey(d) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISOish(v) {
  if (!v) return null;
  const dt = new Date(v);
  return isNaN(dt.getTime()) ? null : dt;
}

function nearestUpcomingDate(dates, now = new Date()) {
  if (!dates.length) return null;
  const future = dates
    .filter(
      (dt) => dt >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
    )
    .sort((a, b) => a - b);
  if (future.length) return future[0];
  return dates.sort((a, b) => Math.abs(a - now) - Math.abs(b - now))[0];
}

export default function MonthCalendar({
  events = [], 
  onSelectEvent, 
  className = "",
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const dt = parseISOish(e.datetime);
      if (!dt) continue;
      const k = toKey(dt);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    for (const [k, arr] of map)
      arr.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    return map;
  }, [events]);

  const allEventDates = useMemo(() => {
    const arr = [];
    for (const e of events) {
      const dt = parseISOish(e.datetime);
      if (dt) arr.push(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    }
    return arr;
  }, [events]);

  const initialSelectedDate = useMemo(
    () => nearestUpcomingDate(allEventDates) || new Date(),
    [allEventDates]
  );
  const [cursor, setCursor] = useState(() => startOfMonth(initialSelectedDate));
  const [selectedKey, setSelectedKey] = useState(() =>
    toKey(initialSelectedDate)
  );

  useEffect(() => {
    const first = startOfMonth(cursor);
    const last = endOfMonth(cursor);
    const sel = new Date(selectedKey);
    if (sel < first || sel > last) {
      const inMonth = allEventDates
        .filter((d) => d >= first && d <= last)
        .sort((a, b) => a - b);
      if (inMonth.length) setSelectedKey(toKey(inMonth[0]));
    }
  }, [cursor, selectedKey, allEventDates]);

  const first = startOfMonth(cursor);
  const startWeekDay = (first.getDay() + 6) % 7; 
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startWeekDay);

  const now = new Date();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const k = toKey(d);
    const items = eventsByDay.get(k) || [];
    cells.push({
      date: d,
      key: k,
      items,
      inMonth: d.getMonth() === cursor.getMonth(),
      isToday: mounted && sameDay(d, now),
      isSelected: k === selectedKey,
      hasEvents: items.length > 0,
    });
  }

  const monthLabel = mounted
    ? cursor.toLocaleString("vi-VN", { month: "long", year: "numeric" })
    : "Lịch";

  const selectedItems = eventsByDay.get(selectedKey) || [];

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl p-4 sm:p-5",
        "bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-400/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-3">
        <div>
          <div className="text-lg sm:text-xl font-semibold capitalize">
            {monthLabel}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const next = nearestUpcomingDate(allEventDates, new Date());
              if (next) {
                setCursor(startOfMonth(next));
                setSelectedKey(toKey(next));
              }
            }}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition active:scale-[0.98]"
          >
            Sự kiện kế tiếp
          </button>
          <button
            onClick={() => {
              const t = new Date();
              setCursor(startOfMonth(t));
              setSelectedKey(toKey(t));
            }}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition active:scale-[0.98]"
          >
            Hôm nay
          </button>
          <div className="flex rounded-xl border overflow-hidden">
            <button
              onClick={() => setCursor(addMonths(cursor, -1))}
              className="px-3 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition"
            >
              Tháng trước
            </button>
            <button
              onClick={() => setCursor(addMonths(cursor, +1))}
              className="px-3 py-1.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition"
            >
              Tháng sau
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] sm:text-xs uppercase tracking-wide opacity-70 mb-1">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((w) => (
          <div key={w} className="px-2 py-1 text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedKey(c.key)}
            className={[
              "relative rounded-2xl p-2 h-20 sm:h-24 text-left transition-all duration-200 cursor-pointer",
              c.inMonth
                ? "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm"
                : "bg-neutral-100/40 dark:bg-neutral-900/30 opacity-70",
              "hover:shadow-md hover:-translate-y-[1px]",
              "hover:bg-gradient-to-br hover:from-blue-50/60 hover:to-cyan-50/40 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/10",
              c.isSelected
                ? "ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/10 scale-[1.01]"
                : "",
            ].join(" ")}
            title={c.hasEvents ? `${c.items.length} sự kiện` : ""}
          >
            
            <div className="flex items-center justify-between">
              <div
                className={`text-xs sm:text-sm font-semibold ${
                  c.hasEvents ? "text-blue-700 dark:text-blue-300" : ""
                }`}
              >
                {new Date(c.date).getDate()}
              </div>

              {c.hasEvents && (
                <span
                  className={[
                    "h-[6px] w-[6px] rounded-full",
                    c.isSelected
                      ? "bg-blue-500 animate-pulse"
                      : "bg-blue-500/80",
                  ].join(" ")}
                />
              )}
            </div>

            <div className="mt-1.5 space-y-1">
              {c.items.slice(0, 2).map((e) => (
                <div
                  key={e.id}
                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 truncate"
                  title={e.title}
                >
                  {e.title}
                </div>
              ))}
              {c.items.length > 2 && (
                <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-900/30">
                  +{c.items.length - 2}
                </div>
              )}
            </div>

            {c.isToday && !c.isSelected && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-blue-400/40" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="text-sm font-medium opacity-80 mb-2">
          Sự kiện ngày{" "}
          {mounted
            ? new Date(selectedKey).toLocaleDateString("vi-VN")
            : selectedKey}
        </div>
        {selectedItems.length ? (
          <ul className="space-y-2">
            {selectedItems.map((e, i) => (
              <li
                key={e.id}
                className={[
                  "rounded-2xl p-3 sm:p-3.5 transition-all",
                  "bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
                  "hover:shadow-md hover:-translate-y-[1px] border border-transparent hover:border-blue-300/60",
                  "animate-[fadeIn_300ms_ease-out]",
                ].join(" ")}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="font-medium">{e.title}</div>
                <div className="text-sm opacity-80">
                  {e.timeLabel ||
                    (e.datetime &&
                      new Date(e.datetime).toLocaleString("vi-VN"))}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                {onSelectEvent && (
                  <div className="mt-2">
                    <button
                      onClick={() => onSelectEvent(e)}
                      className="rounded-lg border px-2.5 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer active:scale-[0.98] transition"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm opacity-70">
            Không có sự kiện trong ngày này.
          </div>
        )}
      </div>

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
