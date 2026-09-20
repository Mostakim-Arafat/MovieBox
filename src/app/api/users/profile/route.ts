import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongo";

function buildUserQuery(user: { id?: string; email?: string }) {
  const queryConditions: any[] = [];

  if (user.id) {
    queryConditions.push({ id: user.id });
    if (ObjectId.isValid(user.id)) {
      queryConditions.push({ _id: new ObjectId(user.id) });
    }
    queryConditions.push({ _id: user.id });
  }

  if (user.email) {
    queryConditions.push({ email: user.email });
  }

  return queryConditions.length > 0 ? { $or: queryConditions } : null;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const query = buildUserQuery(session.user);

    if (!query) {
      return NextResponse.json({ error: "User identifier missing" }, { status: 400 });
    }

    const dbUser = await db.collection("users").findOne(query);

    return NextResponse.json({
      id: dbUser?.id || session.user.id,
      name: dbUser?.name ?? session.user.name ?? "",
      email: dbUser?.email ?? session.user.email ?? "",
      phone: dbUser?.phone ?? "",
      location: dbUser?.location ?? "",
      avatar: dbUser?.image ?? session.user.image ?? "",
    });
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, location, avatar } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const query = buildUserQuery(session.user);

    if (!query) {
      return NextResponse.json({ error: "User identifier missing" }, { status: 400 });
    }

    const updateFields: Record<string, any> = {
      name: name.trim(),
      phone: typeof phone === "string" ? phone.trim() : "",
      location: typeof location === "string" ? location.trim() : "",
      updatedAt: new Date(),
    };

    if (avatar !== undefined) {
      updateFields.image = typeof avatar === "string" ? avatar.trim() : "";
    }

    const result = await db.collection("users").updateOne(query, {
      $set: updateFields,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: session.user.id,
        name: updateFields.name,
        email: session.user.email,
        phone: updateFields.phone,
        location: updateFields.location,
        avatar: updateFields.image ?? session.user.image ?? "",
      },
    });
  } catch (error: any) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}