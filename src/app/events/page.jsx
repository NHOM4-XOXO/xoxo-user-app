"use client";

import React, { useMemo, useState } from "react";
import {
  FiCalendar, FiClock, FiMapPin, FiUsers, FiSearch, FiFilter,
  FiPlus, FiDownload, FiX
} from "react-icons/fi";

// ------------------------
// Mock data (frontend-only)
// ------------------------
const ORGS = ["Thể Thao", "Kỹ Thuật", "Game", "Âm Nhạc", "Sức Khoẻ",];
const TAGS = ["tất cả", "F1", "esports", "bóng đá", "Phim", "sức khoẻ","bóng rổ"];

const INITIAL_EVENTS = [
  // thể Thao
  { id: "e101", org: "thể Thao", title: "Bình luận thể thao", desc: "MU & MC", whenStart: "2025-10-11T16:00:00", whenEnd: "2025-10-11T17:00:00", where: "Kênh Thể Thao 14", tags: ["bóng đá"], capacity: 300 },
  { id: "e102", org: "thể Thao", title: "Ngôi sao bóng rổ Linsanity chính thức giải nghệ", desc: "Bóng rổ .", whenStart: "2025-10-20T15:00:00", whenEnd: "2025-10-20T16:30:00", where: "Room D2", tags: ["bóng rổ"], capacity: 80 },

  // Kỹ Thuật
  { id: "e201", org: "Kỹ Thuật", title: "Physics Midterm", desc: "Hackathon • Class KTC", whenStart: "2025-10-03T10:00:00", whenEnd: "2025-10-03T11:30:00", where: "Room 403", tags: ["exam"], capacity: 60 },
  { id: "e202", org: "Kỹ Thuật", title: "Parent-Teacher Ceremony", desc: "Trao đổi tiến độ học tập.", whenStart: "2025-10-25T09:00:00", whenEnd: "2025-10-25T11:00:00", where: "Hall B", tags: ["ceremony"], capacity: 200 },

  // Game
  { id: "e301", org: "Game", title: "Esports", desc: "Back To School • SCO & DUT Esports.", whenStart: "2025-10-15T08:00:00", whenEnd: "2025-10-15T09:00:00", where: "Ward C", tags: ["esports"], capacity: 40 },
  { id: "e302", org: "Game", title: "Wellness — Mindful Breathing", desc: "15 phút thư giãn cho ca trực đêm.", whenStart: "2025-10-05T21:00:00", whenEnd: "2025-10-05T21:15:00", where: "Break Room", tags: ["wellness"], capacity: 20 },

  // a past example
  { id: "e000", org: "thể Thao", title: "Offsite Recap", desc: "Tổng kết hoạt động quý trước.", whenStart: "2025-08-22T14:00:00", whenEnd: "2025-08-22T15:00:00", where: "Room C1", tags: ["ceremony"], capacity: 120, past: true },
];

const TABS = { UPCOMING: "UPCOMING", PAST: "PAST", MINE: "MINE" };

// ----------------------------------
// Helpers
// ----------------------------------
const fmtDateTime = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

const isPast = (e) => {
  if (e.past) return true;
  const end = new Date(e.whenEnd || e.whenStart).getTime();
  return end < Date.now();
};

const toLocalInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

// ics download (client-side)
function buildICS(event) {
  const dt = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };

  const dtstamp = dt(event.whenStart);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XOXO Networking//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@xoxo.local`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dt(event.whenStart)}`,
    `DTEND:${dt(event.whenEnd || event.whenStart)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.desc || "")}`,
    `LOCATION:${escapeICS(event.where || "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
function escapeICS(str) {
  return String(str).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

// ----------------------------------
// Page
// ----------------------------------
export default function EventsPage() {
  // org đang xem
  const [org, setOrg] = useState("thể Thao");
  const [tab, setTab] = useState(TABS.UPCOMING);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");

  // RSVP state (UI-only)
  // values: "going" | "interested" | undefined
  const [rsvp, setRsvp] = useState({});

  // event list
  const [events, setEvents] = useState(INITIAL_EVENTS);

  // modal create
  const [openCreate, setOpenCreate] = useState(false);

  const eventsByOrg = useMemo(
    () => events.filter((e) => e.org === org),
    [events, org]
  );

  const filtered = useMemo(() => {
    let arr = eventsByOrg.slice().sort((a, b) => new Date(a.whenStart) - new Date(b.whenStart));

    if (tab === TABS.UPCOMING) arr = arr.filter((e) => !isPast(e));
    if (tab === TABS.PAST) arr = arr.filter((e) => isPast(e));
    if (tab === TABS.MINE) {
      arr = arr.filter((e) => rsvp[e.id] === "going" || rsvp[e.id] === "interested");
    }

    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          (e.desc || "").toLowerCase().includes(s) ||
          (e.where || "").toLowerCase().includes(s)
      );
    }

    if (tag !== "all") {
      arr = arr.filter((e) => (e.tags || []).includes(tag));
    }

    return arr;
  }, [eventsByOrg, tab, q, tag, rsvp]);

  return (
    <div className="flex min-h-screen bg-fb-light-secondary dark:bg-black dark:text-white">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 sm:w-80 shrink-0 border-r border-gray-200/70 dark:border-gray-800">
        <div className="sticky top-14 h-[calc(100vh-56px)] overflow-auto p-4 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Sự kiện</h2>
          </section>

          <section>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Đề xuất</div>
            <div className="grid grid-cols-3 gap-2">
              {ORGS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOrg(o)}
                  className={`px-3 py-2 rounded-lg border text-sm capitalize cursor-pointer ${
                    org === o ? "bg-gray-200 dark:bg-gray-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  type="button"
                >
                  {o}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Tag</div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-3 py-1 rounded-full border text-xs capitalize cursor-pointer ${
                    tag === t ? "bg-gray-200 dark:bg-gray-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  type="button"
                >
                  {t.replace("-", " ")}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Khám phá sự kiện</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-white dark:bg-neutral-900 rounded-lg px-2 border border-gray-200 dark:border-gray-800">
              <FiSearch className="opacity-60" />
              <input
                className="h-9 bg-transparent outline-none px-2 text-sm w-56"
                placeholder="Tìm theo tiêu đề/địa điểm/mô tả…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            {/* Create (UI-only) */}
            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Tạo sự kiện (mock)"
            >
              <FiPlus /> Tạo sự kiện
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <TabBtn active={tab === TABS.UPCOMING} onClick={() => setTab(TABS.UPCOMING)}>Sắp diễn ra</TabBtn>
          <TabBtn active={tab === TABS.PAST} onClick={() => setTab(TABS.PAST)}>Đã diễn ra</TabBtn>
          <TabBtn active={tab === TABS.MINE} onClick={() => setTab(TABS.MINE)}>RSVP của tôi</TabBtn>

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiFilter /> {tag === "all" ? "Tất cả tag" : `Tag: ${tag}`}
          </div>
        </div>

        {/* Event list */}
        {!filtered.length ? (
          <EmptyState
            title="Không có sự kiện phù hợp"
            desc="Thử đổi bộ lọc hoặc hạng mục."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((ev) => (
              <EventCard
              className="cursor-pointer"
                key={ev.id}
                ev={ev}
                status={rsvp[ev.id]}
                onRsvp={(s) => setRsvp((m) => ({ ...m, [ev.id]: s }))}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal tạo sự kiện */}
      {openCreate && (
        <CreateEventModal
          orgDefault={org}
          onClose={() => setOpenCreate(false)}
          onCreate={(payload) => {
            const id = `e${Math.random().toString(36).slice(2, 8)}`;
            setEvents((prev) => [
              ...prev,
              { id, ...payload, tags: payload.tags ? [payload.tags] : [] },
            ]);
            setOpenCreate(false);
            // auto switch sang tab Upcoming để demo
            setTab(TABS.UPCOMING);
          }}
        />
      )}
    </div>
  );
}

// ----------------------------------
// Components
// ----------------------------------
function TabBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm ${
        active ? "bg-gray-200 dark:bg-gray-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function EventCard({ ev, status, onRsvp }) {
  const past = isPast(ev);
  const ics = buildICS(ev);
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow bg-white dark:bg-neutral-900">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-start gap-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/10 text-blue-600">
          <FiCalendar />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold leading-6 truncate">{ev.title}</h3>
            {past && <span className="px-2 py-0.5 text-xs rounded-full border border-gray-300 dark:border-gray-700">Đã diễn ra</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ev.desc}</p>
        </div>
      </div>

      <div className="p-3 space-y-2 text-sm">
        <Row icon={<FiClock />} text={`${fmtDateTime(ev.whenStart)} → ${fmtDateTime(ev.whenEnd || ev.whenStart)}`} />
        {ev.where && <Row icon={<FiMapPin />} text={ev.where} />}
        <Row icon={<FiUsers />} text={`${ev.capacity || "—"} chỗ`} />
        {ev.tags?.length ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {ev.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-700">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {/* RSVP (UI-only) */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRsvp(status === "interested" ? undefined : "interested")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              status === "interested" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={past ? "Sự kiện đã diễn ra" : "Quan tâm"}
            disabled={past}
          >
            Quan tâm
          </button>
          <button
            type="button"
            onClick={() => onRsvp(status === "going" ? undefined : "going")}
            className={`px-3 py-1.5 rounded-lg border text-sm ${
              status === "going" ? "bg-blue-600 text-white border-blue-600 hover:opacity-90" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={past ? "Sự kiện đã diễn ra" : "Tham gia"}
            disabled={past}
          >
            Tham gia
          </button>
        </div>

        {/* Export .ics */}
        <a
          href={icsHref}
          download={`${ev.title.replace(/\s+/g, "_")}.ics`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Tải file .ics để thêm vào lịch cá nhân"
        >
          <FiDownload /> Lưu .ics
        </a>
      </div>
    </div>
  );
}

function Row({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <span className="text-gray-800 dark:text-gray-200" suppressHydrationWarning>{text}</span>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <div className="text-5xl mb-2">📅</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
    </div>
  );
}

/* ===========================
   Create Event Modal (UI-only)
   =========================== */
function CreateEventModal({ orgDefault, onClose, onCreate }) {
  // mặc định: start = now + 10 phút, end = start + 60 phút
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  now.setSeconds(0, 0);
  const end = new Date(now.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [org, setOrg] = useState(orgDefault);
  const [where, setWhere] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [tag, setTag] = useState("esports");

  const [start, setStart] = useState(toLocalInputValue(now));
  const [finish, setFinish] = useState(toLocalInputValue(end));

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      org,
      title: title.trim(),
      desc: desc.trim(),
      where: where.trim(),
      capacity: Number(capacity) || undefined,
      tags: tag,
      whenStart: new Date(start).toISOString(),
      whenEnd: new Date(finish).toISOString(),
    };
    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[10%] mx-auto max-w-2xl rounded-2xl border bg-white dark:bg-neutral-900 border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg">Tạo sự kiện (demo)</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiX />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm">Tiêu đề</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" placeholder="VD: R&D Lightning Talks" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Hạng mục</label>
              <select value={org} onChange={(e)=>setOrg(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700">
                {ORGS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Mô tả</label>
            <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" placeholder="Mô tả ngắn…" />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm">Bắt đầu</label>
              <input type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Kết thúc</label>
              <input type="datetime-local" value={finish} onChange={(e)=>setFinish(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm">Địa điểm</label>
              <input value={where} onChange={(e)=>setWhere(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" placeholder="VD: Auditorium A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Sức chứa</label>
              <input type="number" min={1} value={capacity} onChange={(e)=>setCapacity(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Tag</label>
              <select value={tag} onChange={(e)=>setTag(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-transparent outline-none border-gray-300 dark:border-gray-700">
                {TAGS.filter(t=>t!=="all").map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700">
              Hủy
            </button>
            <button type="submit" className="px-3 py-2 rounded-lg border bg-blue-600 text-white border-blue-600 hover:opacity-90">
              Tạo sự kiện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
