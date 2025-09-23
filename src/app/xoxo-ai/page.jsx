"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import LoadingOverlay from "@/components/LoadingOverlay";

const MAX_THREADS = 10;
const WELCOME_MD = "Chào bạn, mình là trợ lý **XoXo AI**.";

export const dynamic = "force-dynamic";

// ====== UI helpers ======
function Bubble({ role, children, innerRef }) {
  const mine = role === "user";
  const base =
    "max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm transition-all duration-200 hover:shadow-md";
  const cls = mine
    ? `${base} bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md border border-blue-500/20`
    : `${base} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200/50 dark:border-gray-700/50`;

  return (
    <div
      ref={innerRef}
      className={`flex ${
        mine ? "justify-end" : "justify-start"
      } animate-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={cls}>
        {role === "assistant" ? (
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (!inline && match) {
                  return (
                    <div className="my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 dark:bg-gray-950">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                        <span className="text-xs text-gray-400 font-mono">
                          {match[1]}
                        </span>
                        <button
                          onClick={() =>
                            navigator.clipboard?.writeText(String(children))
                          }
                          className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                        <code {...props}>
                          {String(children).replace(/\n$/, "")}
                        </code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <code
                    className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              ul({ children }) {
                return <ul className="list-disc pl-5 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
            }}
          >
            {children}
          </ReactMarkdown>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function HistoryTurns({ turns, activeTurnId, onSelectTurn, onClear }) {
  return (
    <div className="mt-2 rounded-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
      <div className="px-3 py-2 text-sm font-semibold bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Lịch sử phiên
        </span>
        <button
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition"
          title="Xoá lịch sử thread này"
        >
          Xoá
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto p-2 no-jank">
        {turns.length === 0 ? (
          <p className="text-xs text-gray-500 px-2 py-3">
            Chưa có lượt hỏi nào.
          </p>
        ) : (
          <ul className="space-y-2">
            {turns.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => onSelectTurn(t.id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeTurnId === t.id
                      ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeTurnId === t.id ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    />
                    Lần {idx + 1} • {new Date(t.ts).toLocaleTimeString()}
                  </div>
                  <div className="text-sm font-medium line-clamp-2">
                    {t.user || "(trống)"}
                  </div>
                  {t.assistant && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {t.assistant.replace(/\n/g, " ")}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SidebarThreads({
  threads,
  activeThreadId,
  setActiveThreadId,
  turnsForActive,
  activeTurnId,
  onSelectTurn,
  onClearThreadHistory,
  onNewThread,
  onCloseThread,
  scrollRef, // NEW: ref để giữ/khôi phục scrollTop
}) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="p-3 border-b border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between sticky top-0 bg-inherit z-10">
        <h2 className="font-semibold">Hộp hội thoại</h2>
        <button
          onClick={onNewThread}
          className="px-3 py-1.5 text-sm rounded-full border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Tạo hộp mới"
        >
          + Hộp mới
        </button>
      </div>

      {/* Khối cuộn sidebar */}
      <div
        ref={scrollRef}
        className="p-2 overflow-y-auto flex-1 no-jank overscroll-contain"
      >
        <ul className="space-y-2">
          {threads.map((t) => {
            const isActive = t.id === activeThreadId;
            return (
              <li
                key={t.id}
                className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900"
              >
                <div
                  className={`flex items-center justify-between gap-2 p-3 cursor-pointer rounded-xl ${
                    isActive
                      ? "bg-blue-50/60 dark:bg-blue-950/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={() => setActiveThreadId(t.id)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-blue-600" : "bg-green-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-700 dark:text-blue-300" : ""
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <button
                    className={`text-xs px-2 py-1 rounded-full ${
                      isActive
                        ? "hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        : "hover:bg-red-50 dark:hover:bg-red-950/20"
                    }`}
                    title="Đóng hộp này"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseThread(t.id);
                    }}
                  >
                    ×
                  </button>
                </div>

                {isActive && (
                  <div className="px-2 pb-2">
                    <HistoryTurns
                      turns={turnsForActive}
                      activeTurnId={activeTurnId}
                      onSelectTurn={onSelectTurn}
                      onClear={onClearThreadHistory}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3 text-[12px] text-gray-500">
          {threads.length}/{MAX_THREADS} hộp đang mở
        </div>
      </div>
    </div>
  );
}

function PaywallModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-2.5L13.73 4a2 2 0 00-3.46 0L3.34 16.5c-.77.83.19 2.5 1.73 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">
            Đã đạt giới hạn hộp hội thoại
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          Bạn đã mở hơn{" "}
          <strong className="text-orange-600 dark:text-orange-400">
            {MAX_THREADS}
          </strong>{" "}
          hộp đồng thời. Đóng bớt hoặc nâng cấp gói.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
            onClick={onClose}
          >
            Tìm hiểu gói
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== Main ======
export default function XoxoAiPage() {
  // Threads
  const [threads, setThreads] = useState(() => {
    const id = createId("thread");
    return [
      {
        id,
        title: "Cuộc trò chuyện 1",
        createdAt: Date.now(),
        messages: [
          {
            id: "welcome",
            role: "assistant",
            content: WELCOME_MD,
            ts: Date.now(),
            turnId: null,
          },
        ],
      },
    ];
  });
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Drawer mobile
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // Chat state
  const activeThread = useMemo(
    () => threads.find((t) => t.id === (activeThreadId ?? threads[0]?.id)),
    [threads, activeThreadId]
  );
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState(null);

  const bottomRef = useRef(null);
  const messageRefs = useRef(new Map());
  const turnAnchorRefs = useRef(new Map());
  const sidebarScrollRef = useRef(null); // NEW: ref chống giật cho sidebar

  // lock body scroll when drawer open (mobile)
  useEffect(() => {
    if (showSidebarMobile) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = original);
    }
  }, [showSidebarMobile]);

  // auto scroll chat khi có message mới / hết loading
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages, loading]);

  // Turns for active thread
  const turnsForActive = useMemo(() => {
    if (!activeThread) return [];
    const map = new Map();
    for (const m of activeThread.messages) {
      if (!m.turnId) continue;
      if (!map.has(m.turnId))
        map.set(m.turnId, { id: m.turnId, ts: m.ts, user: "", assistant: "" });
      const entry = map.get(m.turnId);
      if (m.role === "user") entry.user = m.content;
      if (m.role === "assistant") entry.assistant = m.content;
      entry.ts = Math.min(entry.ts, m.ts);
    }
    return Array.from(map.values()).sort((a, b) => a.ts - b.ts);
  }, [activeThread]);

  // Helpers
  function createId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }

  function handleNewThread() {
    if (threads.length >= MAX_THREADS) {
      setShowPaywall(true);
      return;
    }
    const id = createId("thread");
    const nth = threads.length + 1;
    const newThread = {
      id,
      title: `Cuộc trò chuyện ${nth}`,
      createdAt: Date.now(),
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MD,
          ts: Date.now(),
          turnId: null,
        },
      ],
    };

    // giữ vị trí cuộn sidebar để không giật
    const prevTop = sidebarScrollRef.current?.scrollTop ?? 0;

    setThreads((arr) => [...arr, newThread]);
    setActiveThreadId(id);
    setActiveTurnId(null);
    setInput("");

    // khôi phục vị trí cuộn sau render
    requestAnimationFrame(() => {
      if (sidebarScrollRef.current)
        sidebarScrollRef.current.scrollTop = prevTop;
    });

    // KHÔNG auto scroll chat ở đây để tránh giật
  }

  function handleCloseThread(threadId) {
    const idx = threads.findIndex((t) => t.id === threadId);
    if (idx === -1) return;

    const prevTop = sidebarScrollRef.current?.scrollTop ?? 0;

    const copy = threads.slice();
    copy.splice(idx, 1);
    setThreads(copy);

    requestAnimationFrame(() => {
      if (sidebarScrollRef.current)
        sidebarScrollRef.current.scrollTop = prevTop;
    });

    if (!copy.length) {
      const id = createId("thread");
      setThreads([
        {
          id,
          title: "Cuộc trò chuyện 1",
          createdAt: Date.now(),
          messages: [
            {
              id: "welcome",
              role: "assistant",
              content: WELCOME_MD,
              ts: Date.now(),
              turnId: null,
            },
          ],
        },
      ]);
      setActiveThreadId(id);
      return;
    }

    if (threadId === activeThreadId) {
      const fallback = copy[idx] || copy[idx - 1] || copy[0];
      setActiveThreadId(fallback?.id);
      setActiveTurnId(null);
      setInput("");
    }
  }

  function renameActiveThreadIfFirstUserMessage(prompt) {
    if (!activeThread) return;
    const hasOnlyWelcome = activeThread.messages.length === 1;
    if (hasOnlyWelcome) {
      const newTitle = prompt.slice(0, 30) || activeThread.title;
      setThreads((arr) =>
        arr.map((t) =>
          t.id === activeThread.id ? { ...t, title: newTitle } : t
        )
      );
    }
  }

  // Chat actions
  async function send() {
    const prompt = input.trim();
    if (!prompt || loading || !activeThread) return;

    const turnId = createId("turn");
    const userMsg = {
      id: createId("msg"),
      role: "user",
      content: prompt,
      ts: Date.now(),
      turnId,
    };

    setThreads((arr) =>
      arr.map((t) =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, userMsg] }
          : t
      )
    );
    renameActiveThreadIfFirstUserMessage(prompt);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/internal/xoxo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      const assistantMsg = {
        id: createId("msg"),
        role: "assistant",
        content: res.ok
          ? data?.text || "Không có phản hồi."
          : `**Lỗi:** ${data?.error || "Có lỗi xảy ra."}${
              data?.status ? ` (${data.status})` : ""
            }${data?.body ? `\n\n\`\`\`\n${data.body}\n\`\`\`` : ""}`,
        ts: Date.now(),
        turnId,
      };

      setThreads((arr) =>
        arr.map((t) =>
          t.id === activeThread.id
            ? { ...t, messages: [...t.messages, assistantMsg] }
            : t
        )
      );

      setActiveTurnId(turnId);
      requestAnimationFrame(() => {
        const anchor = turnAnchorRefs.current.get(turnId);
        anchor?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch {
      const assistantMsg = {
        id: createId("msg"),
        role: "assistant",
        content: "Lỗi mạng hoặc server.",
        ts: Date.now(),
        turnId,
      };
      setThreads((arr) =>
        arr.map((t) =>
          t.id === activeThread.id
            ? { ...t, messages: [...t.messages, assistantMsg] }
            : t
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      if (isComposing || e.nativeEvent.isComposing) return;
      e.preventDefault();
      send();
    }
  }

  function handleSelectTurn(turnId) {
    setActiveTurnId(turnId);
    const anchor = turnAnchorRefs.current.get(turnId);
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    setShowSidebarMobile(false);
  }

  function handleClearThreadHistory() {
    if (!activeThread) return;
    setThreads((arr) =>
      arr.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [
                {
                  id: "welcome",
                  role: "assistant",
                  content: WELCOME_MD,
                  ts: Date.now(),
                  turnId: null,
                },
              ],
            }
          : t
      )
    );
    setActiveTurnId(null);
  }

  function setMessageRef(msg) {
    return (el) => {
      if (el) {
        messageRefs.current.set(msg.id, el);
        if (msg.role === "assistant" && msg.turnId) {
          turnAnchorRefs.current.set(msg.turnId, el);
        }
      }
    };
  }

  // ====== UI ======
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-900">
      {/* Header sticky, fixed height để tránh nhảy */}
      <div className="shrink-0 sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            className="lg:hidden px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setShowSidebarMobile(true)}
            aria-label="Mở danh sách hộp"
          >
            ☰
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              XoXo AI
            </h1>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">Hộp hội thoại ở sidebar • Bấm 1 hộp để xem “Lịch sử phiên”</p> */}
          </div>

          {/* + Hộp mới luôn hiển thị */}
          <div className="ml-auto">
            <button
              onClick={handleNewThread}
              className="inline-flex px-3 py-2 rounded-lg border border-dashed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              + Hộp mới
            </button>
          </div>
        </div>
      </div>

      {/* Content: 2 cột scroll độc lập */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar desktop/tablet */}
        <aside className="hidden md:block md:w-72 lg:w-80 xl:w-96 shrink-0 h-full border-r border-gray-200/60 dark:border-gray-700/60">
          <SidebarThreads
            threads={threads}
            activeThreadId={activeThread?.id}
            setActiveThreadId={(id) => {
              setActiveThreadId(id);
              setActiveTurnId(null);
            }}
            turnsForActive={turnsForActive}
            activeTurnId={activeTurnId}
            onSelectTurn={handleSelectTurn}
            onClearThreadHistory={handleClearThreadHistory}
            onNewThread={handleNewThread}
            onCloseThread={handleCloseThread}
            scrollRef={sidebarScrollRef}
          />
        </aside>

        {/* Drawer mobile */}
        {showSidebarMobile && (
          <div className="md:hidden fixed inset-0 z-30">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowSidebarMobile(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700 animate-[slideIn_.25s_ease-out]">
              <SidebarThreads
                threads={threads}
                activeThreadId={activeThread?.id}
                setActiveThreadId={(id) => {
                  setActiveThreadId(id);
                  setActiveTurnId(null);
                }}
                turnsForActive={turnsForActive}
                activeTurnId={activeTurnId}
                onSelectTurn={(turnId) => {
                  handleSelectTurn(turnId);
                  setShowSidebarMobile(false);
                }}
                onClearThreadHistory={handleClearThreadHistory}
                onNewThread={handleNewThread}
                onCloseThread={handleCloseThread}
                scrollRef={sidebarScrollRef}
              />
            </div>
          </div>
        )}

        {/* Chat column */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 flex flex-col">
          <div className="flex-1 min-h-0 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col shadow">
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 no-jank overscroll-contain">
              {(activeThread?.messages || []).map((m) => (
                <Bubble key={m.id} role={m.role} innerRef={setMessageRef(m)}>
                  {m.content}
                </Bubble>
              ))}
              {loading && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Đang nghĩ…
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-4 sm:mt-5 flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="Nhập câu hỏi… (Enter để gửi, Shift+Enter để xuống dòng)"
                  className="w-full min-h-12 max-h-40 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-12 outline-none bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {input.length > 0 && `${input.length} ký tự`}
                </div>
              </div>
              <button
                onClick={send}
                disabled={loading || !input.trim() || !activeThread}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                Gửi
              </button>
            </div>
          </div>

          {/* <p className="mt-2 text-[12px] text-gray-500">
            Mobile: mở ☰ để chọn hộp & xem lịch sử. Desktop/Tablet: sidebar
            trái, mỗi cột tự cuộn độc lập.
          </p> */}
        </main>
      </div>

      {/* FAB mobile: thêm hộp nhanh */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-20 rounded-full w-12 h-12 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl leading-[48px]"
        onClick={handleNewThread}
        aria-label="Thêm hộp mới"
      >
        +
      </button>

      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Global styles: animations + chống nhảy scrollbar */}
      <style jsx global>{`
        .no-jank {
          scrollbar-gutter: stable both-edges;
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .slide-in-from-bottom-2 {
          animation: slideInFromBottom 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .zoom-in-95 {
          animation: zoomIn 0.2s ease-out;
        }
        @keyframes slideInFromBottom {
          from {
            transform: translateY(8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      <LoadingOverlay visible={loading} />
    </div>
  );
}

// function createId(prefix) {
//   return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
// }
