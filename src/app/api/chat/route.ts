import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

type MovieData = {
    title: string;
    year?: number;
    genre?: string[] | string;
    rating?: number;
};

async function sendWithRetry(chat: any, message: string, retries = 2) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await chat.sendMessage(message);
        } catch (error) {
            if (i === retries) throw error;
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    throw new Error("Failed after retries");
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = (await req.json()) as { messages: ChatMessage[] };

        // Fetch real movie data so the chatbot only talks about actual site movies
        let moviesList = "No movie data available right now.";
        try {
            const moviesRes = await fetch(
                "https://movie-box-teal-two.vercel.app/api/movies"
            );
            const moviesData: MovieData[] = await moviesRes.json();

            moviesList = moviesData
                .slice(0, 50) // keep prompt size reasonable
                .map((m) => {
                    const genre = Array.isArray(m.genre)
                        ? m.genre.join(", ")
                        : m.genre || "N/A";
                    return `- ${m.title} (${m.year ?? "N/A"}) | Genre: ${genre} | Rating: ${m.rating ?? "N/A"
                        }`;
                })
                .join("\n");
        } catch (e) {
            console.error("Failed to load movies for chatbot context:", e);
        }

        const SYSTEM_PROMPT = `You are the official assistant for MovieBox, a movie 
and TV show streaming platform.

IMPORTANT: Only recommend or discuss movies from the list below, which are 
the actual movies available on MovieBox. Do NOT mention or invent movies 
that are not in this list, even if they are famous real movies.

Available movies on MovieBox:
${moviesList}

You help users with:
- Recommending movies from the list above based on genre, mood, or rating
- Answering questions about MovieBox itself (pricing plans, features, dark 
  mode, watchlist, reviews, etc.)

Team information (only share this if the user specifically asks who built 
this project, who the team is, or who created you/this chatbot):
- This project was created by team "EG-1305.3-House of webDev"
- The team has 3 members:
  1. Alomgir Hossain
  2. Mostakim
  3. Syeda Sima
- This AI chatbot assistant was specifically built by Alomgir Hossain.

Keep answers short, friendly, and helpful. Respond in the same language the 
user writes in (Bengali or English). If asked about something outside 
movies/MovieBox/the team, politely redirect back to those topics.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: SYSTEM_PROMPT,
        });

        // Gemini requires history to start with a "user" role message.
        const historyRaw = messages.slice(0, -1);
        const firstUserIndex = historyRaw.findIndex((m) => m.role === "user");
        const trimmedHistory =
            firstUserIndex === -1 ? [] : historyRaw.slice(firstUserIndex);

        const history = trimmedHistory.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const lastMessage = messages[messages.length - 1];

        const chat = model.startChat({ history });
        const result = await sendWithRetry(chat, lastMessage.content);
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