// app/api/xoxo-ai/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
        }

        const provider = process.env.XOXO_PROVIDER || "MOCK";

        // 1) MOCK
        if (provider === "MOCK") {
            return NextResponse.json({
                text: `Vừa hỏi: "${prompt}"`,
            });
        }

        // 2) OPENAI
        if (provider === "OPENAI") {
            const apiKey = process.env.OPENAI_API_KEY;
            const model = process.env.XOXO_OPENAI_MODEL || "gpt-4o-mini";
            if (!apiKey) {
                return NextResponse.json(
                    { error: "Thiếu OPENAI_API_KEY" },
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
                        { role: "system", content: "Trợ lý XoXo AI thân thiện." },
                        { role: "user", content: prompt },
                    ],
                }),
            });

            if (!res.ok) {
                const err = await res.text();
                return NextResponse.json(
                    { error: `OpenAI error: ${err}` },
                    { status: 500 }
                );
            }
            const data = await res.json();
            const text =
                data?.choices?.[0]?.message?.content || "Không có phản hồi từ OpenAI.";
            return NextResponse.json({ text });
        }

        // 3) OLLAMA (local)
        if (provider === "OLLAMA") {
            const host = process.env.XOXO_OLLAMA_HOST || "http://localhost:11434";
            const model = process.env.XOXO_OLLAMA_MODEL || "llama3";

            const res = await fetch(`${host}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model,
                    prompt,
                    stream: false,
                }),
            });

            if (!res.ok) {
                const err = await res.text();
                return NextResponse.json(
                    { error: `Ollama error: ${err}` },
                    { status: 500 }
                );
            }
            const data = await res.json();
            return NextResponse.json({ text: data?.response || "No response." });
        }

        return NextResponse.json(
            { error: `Provider không hợp lệ: ${provider}` },
            { status: 400 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
