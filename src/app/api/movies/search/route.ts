import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const db = await getDatabase();
    const movies = await db
      .collection("metaData")
      .find({
        title: { $regex: query, $options: "i" },
      })
      .limit(5)
      .toArray();

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json([]);
  }
}