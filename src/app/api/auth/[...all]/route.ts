import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  try {
    // If MONGO_URL is missing, return null for get-session instead of 500 server crash
    if (!process.env.MONGO_URL && !process.env.MONGODB_URI) {
      if (request.nextUrl.pathname.includes("get-session")) {
        return NextResponse.json(null, { status: 200 });
      }
    }
    return await handler.GET(request);
  } catch (error) {
    console.error("[Auth API Handler Error]:", error);
    if (request.nextUrl.pathname.includes("get-session")) {
      return NextResponse.json(null, { status: 200 });
    }
    return NextResponse.json({ error: "Authentication server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGO_URL && !process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "Database not configured. Please set MONGO_URL in .env.local." },
        { status: 503 }
      );
    }
    return await handler.POST(request);
  } catch (error) {
    console.error("[Auth API Handler Error]:", error);
    return NextResponse.json({ error: "Authentication server error" }, { status: 500 });
  }
}