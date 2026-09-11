import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const SYSTEM_PROMPT = `You are the official assistant for MovieBox, a movie 
and TV show streaming platform. You help users with:
- Information about movies and TV shows available on MovieBox
- General questions about movies, genres, actors, and recommendations
- Questions about MovieBox itself (what it is, how it works, pricing plans, 
  features like watchlist, reviews, dark mode, etc.)

Keep answers short, friendly, and helpful. If asked about something outside 
movies/TV shows/MovieBox, politely redirect the conversation back to those 
topics.`;

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export async function POST(req: NextRequest) {
    try {
        const { messages } = (await req.json()) as { messages: ChatMessage[] };

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Gemini needs history in its own format, and the last message sent separately
        const history = messages.slice(0, -1).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const lastMessage = messages[messages.length - 1];

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.content);
        const text = result.response.text();

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to get response" },
            { status: 500 }
        );
    }
}