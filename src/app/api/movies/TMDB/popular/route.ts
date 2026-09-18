import { NextResponse } from "next/server";
import { fetchPopularMovies } from "@/lib/fetchPopularTv";


export async function GET() {
    try {
      
        const movies = await fetchPopularMovies()
        return NextResponse.json(movies);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}