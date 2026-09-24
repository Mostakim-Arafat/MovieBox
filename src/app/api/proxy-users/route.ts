import { NextRequest, NextResponse } from "next/server";

const LIVE_API = "https://movie-box-teal-two.vercel.app/api/movies";

export async function GET() {
    try {
        const res = await fetch(LIVE_API);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch movies" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const res = await fetch(LIVE_API + "/" + id, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete movie" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        const res = await fetch(LIVE_API + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        if (!res.ok) throw new Error("Update failed");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update movie" },
            { status: 500 }
        );
    }
}