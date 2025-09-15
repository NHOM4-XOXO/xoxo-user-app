"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiBookmark, FiTag, FiSearch, FiGrid, FiList, FiTrash2, FiEdit2, FiSave, FiShare2, FiFolder, FiFileText, FiUsers } from "react-icons/fi";

const TABS = {
  SAVED: "SAVED",
  NOTES: "NOTES",
  DEPT:  "DEPT",
};

// ===== Mock data (frontend-only, có thể thay bằng data API sau) =====
const SAVED_MOCK = [
  { id: "s1", kind: "post",   title: "Thông báo lịch thi giữa kỳ", from: "Class 11A — Physics", tags: ["exam", "school"], savedAt: "2025-09-10T09:00:00Z" },
  { id: "s2", kind: "file",   title: "HR — Policy: Leave & Benefits.pdf", from: "HR Portal",     tags: ["policy","corp"], savedAt: "2025-09-08T14:20:00Z" },
  { id: "s3", kind: "link",   title: "Robotics Club: Meeting Notes",       from: "Robotics Club", tags: ["club","notes"], savedAt: "2025-09-02T08:32:00Z" },
  { id: "s4", kind: "post",   title: "Cardiology: ACLS quick sheet",       from: "Cardio Dept.",  tags: ["hospital","training"], savedAt: "2025-08-31T16:45:00Z" },
];

const DEPT_DOCS_MOCK = [
  { id: "d1", title: "Template Proposal Q4.docx", unit: "Sales APAC",     tags: ["template","sales"], updated: "2025-09-11T07:10:00Z", shared: true },
  { id: "d2", title: "SOP: Night Shift Handover", unit: "Cardiology Dept", tags: ["sop","handover"], updated: "2025-09-05T19:45:00Z", shared: false },
  { id: "d3", title: "Exam Bank: Kinematics.zip", unit: "Class 11A",       tags: ["exam","zip"],     updated: "2025-09-03T10:05:00Z", shared: true },
];

// ===== helpers =====
const fmtDate = (iso) => new Date(iso).toLocaleString();

export default function SavedPage() {
  const [tab, setTab] = useState(TABS.SAVED);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid"); // 'grid' | 'list'

  // ---- Saved state (local only) ----
  const [saved, setSaved] = useState(SAVED_MOCK);

  // ---- Notes state: lưu localStorage để demo không mất khi refresh ----
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("xoxo_notes");
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("xoxo_notes", JSON.stringify(notes));
    } catch {}
  }, [notes]);

  // ---- Dept docs (mock) ----
  const [docs, setDocs] = useState(DEPT_DOCS_MOCK);

  // ---- search filter theo tab ----
  const filteredSaved = useMemo(() => {
    if (!query) return saved;
    const q = query.toLowerCase();
    return saved.filter(x =>
      x.title.toLowerCase().includes(q) ||
      x.from.toLowerCase().includes(q) ||
      x.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query, saved]);

  const filteredNotes = useMemo(() => {
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter(n =>
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q) ||
      (n.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [query, notes]);

  const filteredDocs = useMemo(() => {
    if (!query) return docs;
    const q = query.toLowerCase();
    return docs.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.unit.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query, docs]);

  return (
    <div className="flex min-h-screen bg-fb-light-secondary dark:bg-black dark:text-white">
      {/* Left sidebar nhỏ (nhúng trong file để bạn không phải tạo thêm component) */}
      <aside className="hidden lg:block w-72 sm:w-80 shrink-0 border-r border-gray-200/70 dark:border-gray-800">
        <div className="sticky top-14 h-[calc(100vh-56px)] overflow-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Lưu trữ</h2>

          <nav className="space-y-1">
            <SidebarBtn active={tab === TABS.SAVED} onClick={() => setTab(TABS.SAVED)} icon={<FiBookmark />} label="Đã lưu" />
            <SidebarBtn active={tab === TABS.NOTES} onClick={() => setTab(TABS.NOTES)} icon={<FiFileText />} label="Ghi chú" />
            <SidebarBtn active={tab === TABS.DEPT}  onClick={() => setTab(TABS.DEPT)}  icon={<FiFolder />} label="Tài liệu nội bộ" />
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {tab === TABS.SAVED && "Đã lưu (cá nhân)"}
              {tab === TABS.NOTES && "Ghi chú cá nhân"}
              {tab === TABS.DEPT  && "Tài liệu nội bộ (phòng ban / lớp học)"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-white dark:bg-neutral-900 rounded-lg px-2 border border-gray-200 dark:border-gray-800">
              <FiSearch className="opacity-60" />
              <input
                className="h-9 bg-transparent outline-none px-2 text-sm w-56"
                placeholder={tab === TABS.NOTES ? "Tìm trong ghi chú…" : "Tìm theo tiêu đề/tags…"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {tab !== TABS.NOTES && (
              <div className="flex border rounded-lg overflow-hidden border-gray-200 dark:border-gray-800">
                <button onClick={() => setView("grid")} className={`px-3 py-2 cursor-pointer ${view === "grid" ? "bg-gray-200 dark:bg-gray-700" : ""}`} title="Dạng lưới"><FiGrid /></button>
                <button onClick={() => setView("list")} className={`px-3 py-2 cursor-pointer ${view === "list" ? "bg-gray-200 dark:bg-gray-700" : ""}`} title="Dạng danh sách"><FiList /></button>
              </div>
            )}
          </div>
        </div>

        {/* Content per tab */}
        {tab === TABS.SAVED && (
          <SavedSection
            items={filteredSaved}
            view={view}
            onRemove={(id) => setSaved(s => s.filter(x => x.id !== id))}
          />
        )}

        {tab === TABS.NOTES && (
          <NotesSection
            items={filteredNotes}
            onCreate={(note) => setNotes(n => [{ ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...n])}
            onUpdate={(id, patch) => setNotes(n => n.map(x => x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x))}
            onDelete={(id) => setNotes(n => n.filter(x => x.id !== id))}
          />
        )}

        {tab === TABS.DEPT && (
          <DeptDocsSection
            items={filteredDocs}
            view={view}
            onToggleShare={(id) => setDocs(d => d.map(x => x.id === id ? { ...x, shared: !x.shared } : x))}
          />
        )}
      </main>
    </div>
  );
}

/* ===================== Sub components ===================== */

function SidebarBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
      ${active ? "bg-gray-200 dark:bg-gray-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
    >
      <span className="text-blue-600">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function SavedSection({ items, view, onRemove }) {
  if (!items.length) return <EmptyState title="Chưa có mục đã lưu" desc="Bạn có thể lưu bài viết, file, link nội bộ để xem lại nhanh." />;
  if (view === "list") {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer">
        {items.map((it) => (
          <div key={it.id} className="flex items-center gap-3 p-3">
            <KindBadge kind={it.kind} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{it.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{it.from} • {fmtDate(it.savedAt)}</div>
              <div className="flex gap-2 mt-1">
                {it.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 text-sm cursor-pointer"><FiShare2 /></button>
              <button onClick={() => onRemove(it.id)} className="px-2 py-1 rounded-md border hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 cursor-pointer"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.id} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow cursor-pointer">
          <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center cursor-pointer">
            <div className="text-5xl opacity-30">{it.kind === "file" ? "📄" : it.kind === "link" ? "🔗" : "📝"}</div>
          </div>
          <div className="p-3">
            <div className="font-medium line-clamp-2">{it.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{it.from}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {it.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{fmtDate(it.savedAt)}</span>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><FiShare2 /></button>
                <button onClick={() => onRemove(it.id)} className="px-2 py-1 rounded-md border hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 cursor-pointer"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesSection({ items, onCreate, onUpdate, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Avatar src="https://i.pravatar.cc/100?img=15" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Ghi chú này chỉ mình bạn thấy</div>
        </div>
        <NoteComposer onSubmit={onCreate} />
      </div>

      {/* List */}
      {!items.length ? (
        <EmptyState title="Chưa có ghi chú" desc="Ghi lại ý tưởng, tóm tắt bài học, hoặc việc cần làm." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(n => (
            <NoteCard key={n.id} note={n} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function DeptDocsSection({ items, view, onToggleShare }) {
  if (!items.length) return <EmptyState title="Chưa có tài liệu" desc="Tài liệu dùng chung cho phòng ban/lớp sẽ xuất hiện ở đây." />;

  const Icon = ({ className }) => <FiFolder className={className} />;
  if (view === "list") {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {items.map((d) => (
          <div key={d.id} className="flex items-center gap-3 p-3">
            <Icon className="text-blue-600" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{d.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{d.unit} • cập nhật {fmtDate(d.updated)}</div>
              <div className="flex gap-2 mt-1">{d.tags.map(t => <Tag key={t} label={t} />)}</div>
            </div>
            <button
              onClick={() => onToggleShare(d.id)}
              className={`px-2 py-1 rounded-md border text-sm ${d.shared ? "bg-green-100 dark:bg-green-900/20 text-green-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              title={d.shared ? "Đang chia sẻ nội bộ" : "Bật chia sẻ nội bộ"}
            >
              <FiUsers />
            </button>
          </div>
        ))}
      </div>
    );
  }
  // grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(d => (
        <div key={d.id} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow">
          <div className="relative h-28 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
            <FiFolder className="text-5xl opacity-30" />
          </div>
          <div className="p-3">
            <div className="font-medium line-clamp-2">{d.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.unit}</div>
            <div className="flex gap-2 mt-2 flex-wrap">{d.tags.map(t => <Tag key={t} label={t} />)}</div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Cập nhật {fmtDate(d.updated)}</span>
              <button
                onClick={() => onToggleShare(d.id)}
                className={`px-2 py-1 rounded-md border ${d.shared ? "bg-green-100 dark:bg-green-900/20 text-green-700" : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}`}
                title={d.shared ? "Đang chia sẻ nội bộ" : "Bật chia sẻ nội bộ"}
              >
                <FiUsers />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ========== small atoms ========== */

function Tag({ label }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-700">
      <FiTag className="opacity-60" /> {label}
    </span>
  );
}

function KindBadge({ kind }) {
  const map = { post: "Bài viết", file: "Tệp", link: "Liên kết" };
  return (
    <span className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">{map[kind] || "Mục"}</span>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <div className="text-5xl mb-2">Ghim</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
    </div>
  );
}

function Avatar({ src }) {
  return (
    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
      <Image src={src} alt="avatar" fill className="object-cover" />
    </div>
  );
}

/* ========== notes composer & card ========== */

function NoteComposer({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean);
    onSubmit({ title: title.trim(), content: content.trim(), tags: tagArr });
    setTitle(""); setContent(""); setTags("");
  };

  return (
    <div className="space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề…"
        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nội dung ghi chú…"
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tags (ngăn cách dấu phẩy), ví dụ: hr, exam"
        className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none text-sm"
      />
      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm cursor-pointer">
          <FiSave /> Lưu ghi chú
        </button>
      </div>
    </div>
  );
}

function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [t, setT] = useState(note.title || "");
  const [c, setC] = useState(note.content || "");
  const [tags, setTags] = useState((note.tags || []).join(", "));

  const onSaveEdit = () => {
    const tagArr = tags.split(",").map(s => s.trim()).filter(Boolean);
    onUpdate(note.id, { title: t, content: c, tags: tagArr });
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        {!editing ? (
          <div className="font-medium">{note.title || "(Không tiêu đề)"}</div>
        ) : (
          <input value={t} onChange={(e) => setT(e.target.value)} className="w-full px-2 py-1 rounded-md border bg-transparent" />
        )}
        <div className="flex items-center gap-2">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="px-2 py-1 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 text-sm cursor-pointer"><FiEdit2 /></button>
          ) : (
            <button onClick={onSaveEdit} className="px-2 py-1 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 text-sm cursor-pointer"><FiSave /></button>
          )}
          <button onClick={() => onDelete(note.id)} className="px-2 py-1 rounded-md border hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 cursor-pointer"><FiTrash2 /></button>
        </div>
      </div>

      {!editing ? (
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
      ) : (
        <textarea value={c} onChange={(e) => setC(e.target.value)} rows={4} className="w-full px-2 py-1 rounded-md border bg-transparent" />
      )}

      <div className="mt-2 flex gap-2 flex-wrap">
        {!editing ? (
          (note.tags || []).map(t => <Tag key={t} label={t} />)
        ) : (
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-2 py-1 rounded-md border bg-transparent text-sm" placeholder="tags, ví dụ: idea, task" />
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {note.updatedAt ? `Cập nhật ${fmtDate(note.updatedAt)}` : `Tạo ${fmtDate(note.createdAt)}`}
      </div>
    </div>
  );
}