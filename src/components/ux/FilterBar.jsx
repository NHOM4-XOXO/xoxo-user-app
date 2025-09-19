"use client";
import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function FilterBar({
  placeholder = "Tìm kiếm...",
  onSearch = () => {},
  filters = [],
  onChange = () => {},
  className = "",
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`w-full rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-3 sm:p-4 shadow-sm ${className}`}
    >
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2 flex-1 rounded-xl border px-3 py-2 focus-within:ring-2 focus-within:ring-black/10 dark:focus-within:ring-white/20 transition">
          <Search className="w-4 h-4 opacity-70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
            placeholder={placeholder}
            className="bg-transparent outline-none w-full text-sm"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                onSearch("");
              }}
              className="rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transitio  cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
        </button>
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-[fadeIn_220ms_ease]">
          {filters.map((f) => (
            <label key={f.key} className="text-sm">
              <span className="block mb-1 opacity-70">{f.label}</span>
              <select
                className="w-full rounded-xl border bg-transparent px-3 py-2 cursor-pointer"
                onChange={(e) => onChange(f.key, e.target.value)}
                defaultValue={f.defaultValue ?? ""}
              >
                {(f.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
