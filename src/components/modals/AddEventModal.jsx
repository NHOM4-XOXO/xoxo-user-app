"use client";
import React, { useState, useEffect } from "react";

export default function AddEventModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [cover, setCover] = useState("");
  const [category, setCategory] = useState("general");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setCover("");
      setCategory("general");
      setSaved(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    const isoDateTime = date && time ? new Date(`${date}T${time}`) : null;
    onSubmit({
      title,
      date,
      time,
      datetime: isoDateTime,
      location,
      cover,
      category,
      saved,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-lg rounded-2xl border bg-white dark:bg-neutral-900 p-4 shadow-xl">
        <h3 className="text-lg font-semibold">Thêm sự kiện</h3>
        <div className="mt-3 grid gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="rounded-xl border px-3 py-2 bg-transparent"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 bg-transparent"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-xl border px-3 py-2 bg-transparent"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Địa điểm"
            className="rounded-xl border px-3 py-2 bg-transparent"
          />
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="Ảnh cover (URL)"
            className="rounded-xl border px-3 py-2 bg-transparent"
          />

          <label className="text-sm">
            <span className="block mb-1 opacity-70">Danh mục</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 bg-transparent"
            >
              <option value="general">Khác</option>
              <option value="esport">Esport</option>
              <option value="basketball">Bóng rổ</option>
              <option value="tech">Công nghệ</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
            />
            <span>Thêm vào mục Đã lưu</span>
          </label>
        </div>

        <div className="mt-4 flex justify-between items-center gap-2">
          <button
            onClick={() => {
              if (date && time && title) {
                const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${
                  date.replace(/-/g, "") + "T" + time.replace(":", "") + "00Z"
                }\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;
                const blob = new Blob([ics], {
                  type: "text/calendar;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${title}.ics`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
          >
            + Lưu vào Calendar
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
