"use client";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// ====== Config ======
const MAX_THREADS = 10;
const WELCOME_MD = "Chào bạn , Mình là trợ lý **XoXo AI**. ";

// ====== UI helpers ======
function Bubble({ role, children, innerRef }) {
  const mine = role === "user";
  const base =
    "max-w-[85%] px-3 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed";
  const cls = mine
    ? `${base} bg-blue-600 text-white rounded-br-md`
    : `${base} bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md`;
  return (
    <div
      ref={innerRef}
      className={`flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <div className={cls}>
        {role === "assistant" ? (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (!inline && match) {
                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              ul({ children }) {
                return <ul className="list-disc pl-5">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5">{children}</ol>;
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

function HistoryList({ turns, activeTurnId, onSelectTurn, onClear }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Lịch sử phiên</h2>
        <button
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
          title="Xoá lịch sử của thread này"
        >
          Xoá
        </button>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {turns.length === 0 ? (
          <p className="text-sm text-gray-500 p-3">Chưa có lượt hỏi nào.</p>
        ) : (
          <ul className="space-y-1">
            {turns.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => onSelectTurn(t.id)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeTurnId === t.id
                      ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    Lần {idx + 1} • {new Date(t.ts).toLocaleTimeString()}
                  </div>
                  <div className="font-medium line-clamp-2">
                    {t.user.slice(0, 120) || "(trống)"}
                  </div>
                  {t.assistant && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {t.assistant.replace(/\n/g, " ").slice(0, 140)}
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

function PaywallModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[90%] max-w-md p-6">
        <h3 className="text-lg font-bold mb-2">
          Đã đạt giới hạn hộp hội thoại
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bạn đã mở hơn <strong>{MAX_THREADS}</strong> hộp hội thoại đồng thời.
          Để tiếp tục, vui lòng đóng bớt cuộc trò chuyện hoặc nâng cấp gói.
        </p>
        <div className="mt-4 flex gap-2 justify-end">
          <button
            className="px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-blue-600 text-white"
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
  // ------- Threads (đa hộp hội thoại) -------
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
  const [activeThreadId, setActiveThreadId] = useState(threads[0].id);
  const [showPaywall, setShowPaywall] = useState(false);

  // ------- Responsive toggles -------
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  // ------- Chat state trong thread đang mở -------
  const activeThread = threads.find((t) => t.id === activeThreadId);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTurnId, setActiveTurnId] = useState(null);

  const bottomRef = useRef(null);
  const messageRefs = useRef(new Map());
  const turnAnchorRefs = useRef(new Map());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages, loading]);

  // Gom lịch sử theo turn cho thread hiện tại
  const turns = useMemo(() => {
    if (!activeThread) return [];
    const map = new Map();
    for (const m of activeThread.messages) {
      if (!m.turnId) continue;
      if (!map.has(m.turnId)) {
        map.set(m.turnId, { id: m.turnId, ts: m.ts, user: "", assistant: "" });
      }
      const entry = map.get(m.turnId);
      if (m.role === "user") entry.user = m.content;
      if (m.role === "assistant") entry.assistant = m.content;
      entry.ts = Math.min(entry.ts, m.ts);
    }
    return Array.from(map.values()).sort((a, b) => a.ts - b.ts);
  }, [activeThread]);

  // ------- Thread actions -------
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
    setThreads((arr) => [...arr, newThread]);
    setActiveThreadId(id);
    setActiveTurnId(null);
    setInput("");
  }

  function handleCloseThread(threadId) {
    const idx = threads.findIndex((t) => t.id === threadId);
    if (idx === -1) return;
    const copy = threads.slice();
    copy.splice(idx, 1);
    setThreads(copy);

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

  // ------- Chat actions -------
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
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setShowHistoryMobile(false);
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

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Tabs threads: responsive */}
      <div className="sticky top-14 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b">
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
          {/* Nút mở lịch sử (mobile) */}
          <button
            className="lg:hidden px-3 py-1.5 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setShowHistoryMobile(true)}
          >
            Lịch sử
          </button>

          {/* tabs */}
          <div className="flex flex-wrap items-center gap-2 px-2 py-2">
            {threads.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border cursor-pointer whitespace-nowrap ${
                  t.id === activeThreadId
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setActiveThreadId(t.id)}
                title={t.title}
              >
                <span className="text-sm">{t.title}</span>
                <button
                  className={`ml-1 text-xs rounded-full px-1.5 ${
                    t.id === activeThreadId
                      ? "hover:bg-blue-500/50"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseThread(t.id);
                  }}
                  // title="Đóng hộp hội thoại"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="ml-1 px-3 py-1.5 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={handleNewThread}
            >
              + Hộp mới
            </button>
            <span className="text-xs text-gray-500 ml-auto pr-1">
              {threads.length}/{MAX_THREADS}
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r bg-white dark:bg-gray-900">
          <HistoryList
            turns={turns}
            activeTurnId={activeTurnId}
            onSelectTurn={handleSelectTurn}
            onClear={handleClearThreadHistory}
          />
        </aside>

        {/* Drawer lịch sử (mobile) */}
        {showHistoryMobile && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowHistoryMobile(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white dark:bg-gray-900 shadow-xl animate-[slideIn_.2s_ease-out]">
              <HistoryList
                turns={turns}
                activeTurnId={activeTurnId}
                onSelectTurn={handleSelectTurn}
                onClear={handleClearThreadHistory}
              />
            </div>
          </div>
        )}

        {/* Khung chat */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">XoXo AI</h1>
          </div>

          {/* Chat area + input: responsive height */}
          <div
            className="border rounded-2xl p-3 sm:p-4 bg-white dark:bg-gray-900 flex flex-col"
            style={{ height: "calc(100vh - 220px)" }}
          >
            <div className="space-y-3 overflow-y-auto flex-1">
              {(activeThread?.messages || []).map((m) => (
                <Bubble key={m.id} role={m.role} innerRef={setMessageRef(m)}>
                  {m.content}
                </Bubble>
              ))}
              {loading && <Bubble role="assistant">Đang nghĩ…</Bubble>}
              <div ref={bottomRef} />
            </div>

            <div className="mt-3 sm:mt-4 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder="Nhập câu hỏi… (Enter để gửi, Shift+Enter để xuống dòng)"
                className="flex-1 min-h-12 max-h-40 border rounded-2xl p-3 outline-none bg-white dark:bg-gray-900"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim() || !activeThread}
                className="px-4 py-2 rounded-2xl bg-blue-600 text-white disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          </div>

          {/* <p className="mt-2 text-xs text-gray-500">
            Tối đa {MAX_THREADS} hộp thoại.
          </p> */}
        </main>
      </div>

      {/* Paywall */}
      <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* tiny keyframes for drawer */}
      <style jsx global>{`
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
