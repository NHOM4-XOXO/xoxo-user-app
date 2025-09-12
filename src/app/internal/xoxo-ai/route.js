// app/internal/xoxo-ai/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";       // bắt buộc để đọc env
export const dynamic = "force-dynamic";

export async function GET() {
    // Trả về DEBUG để chắc chắn env đã nạp
    const provider = process.env.XOXO_PROVIDER || "OPENAI";
    const hasKey = Boolean(process.env.OPENAI_API_KEY);
    const model = process.env.XOXO_OPENAI_MODEL || "gpt-4o-mini";
    return NextResponse.json({ ok: true, provider, hasKey, model });
}

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const provider = process.env.XOXO_PROVIDER || "OPENAI";

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
        }

        if (provider === "MOCK") {
            return NextResponse.json({ text: `🤖 (mock) "${prompt}"` });
        }

        if (provider === "OPENAI") {
            const apiKey = process.env.OPENAI_API_KEY;
            const model = process.env.XOXO_OPENAI_MODEL || "gpt-4o-mini";
            if (!apiKey) {
                return NextResponse.json(
                    { error: "Thiếu OPENAI_API_KEY trong .env.local" },
                    { status: 500 }
                );
            }

            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    temperature: 0.7,
                    messages: [
                        { role: "system", content: "Bạn là trợ lý XoXo AI thân thiện." },
                        { role: "user", content: prompt },
                    ],
                }),
            });

            const textRaw = await res.text();
            if (!res.ok) {
                return NextResponse.json(
                    { error: "OpenAI error", status: res.status, body: textRaw },
                    { status: 500 }
                );
            }

            let data;
            try {
                data = JSON.parse(textRaw);
            } catch {
                return NextResponse.json(
                    { error: "Không parse được JSON từ OpenAI", raw: textRaw },
                    { status: 500 }
                );
            }

            const text =
                data?.choices?.[0]?.message?.content || "Không có phản hồi từ OpenAI.";
            return NextResponse.json({ text });
        }

        if (provider === "OLLAMA") {
            const host = process.env.XOXO_OLLAMA_HOST || "http://localhost:11434";
            const model = process.env.XOXO_OLLAMA_MODEL || "llama3";

            const res = await fetch(`${host}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, prompt, stream: false }),
            });

            const textRaw = await res.text();
            if (!res.ok) {
                return NextResponse.json(
                    { error: "Ollama error", status: res.status, body: textRaw },
                    { status: 500 }
                );
            }

            let data;
            try {
                data = JSON.parse(textRaw);
            } catch {
                return NextResponse.json(
                    { error: "Không parse được JSON từ Ollama", raw: textRaw },
                    { status: 500 }
                );
            }

            return NextResponse.json({ text: data?.response || "No response." });
        }

        return NextResponse.json(
            { error: `Provider không hợp lệ: ${provider}` },
            { status: 400 }
        );
    } catch (e) {
        return NextResponse.json({ error: "Server error", detail: String(e) }, { status: 500 });
    }
}
