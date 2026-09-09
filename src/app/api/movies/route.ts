import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET() {
    try {
        const db = await getDatabase();
        const movies = await db.collection("metaData").find({}).toArray();
        return NextResponse.json(movies);
    } catch (error) {
        console.error("Movies API error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: "Failed to fetch movies", details: message }, { status: 500 });
    }
}