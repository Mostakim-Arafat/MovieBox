import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";

        const db = await getDatabase();
        
        const movies = await db.collection("metaData").find({
            title: { $regex: query, $options: "i" }
        }).limit(5).toArray();

        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}