import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const SYSTEM_PROMPT = `You are the official assistant for MovieBox, a movie 
and TV show streaming platform. You help users with:
- Information about movies and TV shows available on MovieBox
- General questions about movies, genres, actors, and recommendations
- Questions about MovieBox itself (what it is, how it works, pricing plans, 
  features like watchlist, reviews, dark mode, etc.)

Team information (only share this if the user specifically asks who built 
this project, who the team is, or who created you/this chatbot):
- This project was created by team "EG-1305.3-House of webDev"
- The team has 3 members:
  1. Alomgir Hossain
  2. Mostakim
  3. Syeda Sima
- This AI chatbot assistant was specifically built by Alomgir Hossain.

Keep answers short, friendly, and helpful. If asked about something outside 
movies/TV shows/MovieBox/the team, politely redirect the conversation back 
to those topics.`;

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export async function POST(req: NextRequest) {
    try {
        const { messages } = (await req.json()) as { messages: ChatMessage[] };

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: SYSTEM_PROMPT,
        });

        const historyRaw = messages.slice(0, -1);

        // Gemini requires history to start with a "user" role message.
        // Drop any leading assistant messages (like the initial welcome message).
        const firstUserIndex = historyRaw.findIndex((m) => m.role === "user");
        const trimmedHistory =
            firstUserIndex === -1 ? [] : historyRaw.slice(firstUserIndex);

        const history = trimmedHistory.map((m) => ({
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