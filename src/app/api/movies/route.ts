import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET() {
    try {
        const db = await getDatabase();
        const movies = await db.collection("metaData").find({}).toArray();
        return NextResponse.json(movies);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}