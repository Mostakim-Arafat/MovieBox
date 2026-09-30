import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";
import { createMovieEmbedding } from "@/lib/AI/embedding";

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

export async function POST(request: Request) {
    try {
        const movie = await request.json();

        console.log(movie)

        if (!movie.title?.trim() || !Array.isArray(movie.genre) || movie.genre.length === 0) {
            return NextResponse.json({ error: "Title and at least one genre are required" }, { status: 400 });
        }

        const embedding = await createMovieEmbedding({
            title: movie.title,
            description: movie.description ?? movie.synopsis ?? "",
            genres: Array.isArray(movie.genre) ? movie.genre : [],
            releaseYear: movie.year ?? movie.releaseYear ?? undefined,
        });

        const movieDocument = {
            ...movie,
            embedding,
        };

        const db = await getDatabase();
        const result = await db.collection("metaData").insertOne(movieDocument);
        return NextResponse.json({ id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("MongoDB insert error:", error);
        return NextResponse.json({ error: "Failed to save movie" }, { status: 500 });
    }
}