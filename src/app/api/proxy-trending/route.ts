import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch(
            "https://movie-box-teal-two.vercel.app/api/trending"
        );
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch trending" },
            { status: 500 }
        );
    }
}