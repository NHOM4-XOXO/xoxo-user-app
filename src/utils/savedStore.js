const KEY = "xoxo_saved";

function readRaw() {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function writeRaw(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getSaved() {
  return readRaw();
}

export function isSaved(id) {
  return readRaw().some((it) => it.id === id);
}

export function saveItem(item) {
  const items = readRaw();
  const exists = items.some((it) => it.id === item.id);
  if (!exists) {
    items.unshift({
      ...item,
      savedAt: item.savedAt ?? Date.now(),
      pinned: !!item.pinned,
    });
    writeRaw(items);
  }
  return items;
}

export function saveEvent(evt) {
  return saveItem({ ...evt, type: "event" });
}

export function removeSaved(id) {
  const items = readRaw().filter((it) => it.id !== id);
  writeRaw(items);
  return items;
}

export function togglePin(id, force) {
  const items = readRaw().map((it) => {
    if (it.id === id) {
      const pinned = typeof force === "boolean" ? force : !it.pinned;
      return { ...it, pinned, pinnedAt: pinned ? Date.now() : undefined };
    }
    return it;
  });
  writeRaw(items);
  return items;
}

import { useEffect, useState } from "react";
export function useSaved() {
  const [items, setItems] = useState([]);

  useEffect(() => setItems(readRaw()), []);

  const addItem = (it) => setItems(saveItem(it));
  const addEvent = (evt) => setItems(saveEvent(evt));
  const remove = (id) => setItems(removeSaved(id));
  const pin = (id) => setItems(togglePin(id, true));
  const unpin = (id) => setItems(togglePin(id, false));
  const toggle = (id) => setItems(togglePin(id));
  const refresh = () => setItems(readRaw());
  const check = (id) => items.some((it) => it.id === id);

  return { items, addItem, addEvent, remove, pin, unpin, toggle, refresh, isSaved: check };
}
