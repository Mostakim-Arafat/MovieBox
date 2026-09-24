import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";
import { ObjectId } from "mongodb";

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

        const db = await getDatabase();
        const result = await db.collection("metaData").insertOne(movie);
        console.log(result)
        return NextResponse.json({ id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("MongoDB insert error:", error);
        return NextResponse.json({ error: "Failed to save movie" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
        const result = await db.collection("metaData").deleteOne(filter);

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("MongoDB delete error:", error);
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, _id, ...updateData } = body;
        const movieId = id || _id;

        if (!movieId) {
            return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const filter = ObjectId.isValid(movieId) ? { _id: new ObjectId(movieId) } : { id: movieId };
        const result = await db.collection("metaData").updateOne(filter, { $set: updateData });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("MongoDB update error:", error);
        return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
    }
}