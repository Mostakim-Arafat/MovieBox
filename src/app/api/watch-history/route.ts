import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const history = await db
            .collection("watchHistory")
            .find({ userEmail: email })
            .sort({ watchedAt: -1 })
            .toArray();

        return NextResponse.json(history);
    } catch (error) {
        console.error("Failed to fetch watch history:", error);
        return NextResponse.json({ error: "Failed to fetch watch history" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userEmail, movieId, title, poster, year, genre, rating, duration } = body;

        if (!userEmail || !movieId || !title) {
            return NextResponse.json(
                { error: "userEmail, movieId, and title are required" },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        const entry = {
            userEmail,
            movieId,
            title,
            poster: poster || "",
            year: year || null,
            genre: genre || [],
            rating: rating || 0,
            duration: duration || "",
            watchedAt: new Date(),
        };

        await db.collection("watchHistory").insertOne(entry);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Failed to save watch history:", error);
        return NextResponse.json({ error: "Failed to save watch history" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const db = await getDatabase();
        await db.collection("watchHistory").deleteMany({ userEmail: email });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to clear watch history:", error);
        return NextResponse.json({ error: "Failed to clear watch history" }, { status: 500 });
    }
}
