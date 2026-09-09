import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

const FALLBACK_TRENDING = [
  { _id: "1", title: "Cocktail 2", poster: "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400" },
  { _id: "2", title: "Detective Conan", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400" },
  { _id: "3", title: "Musafir Cafe", poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400" },
  { _id: "4", title: "Lock Upp", poster: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400" },
  { _id: "5", title: "Operation Safed Sagar", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400" },
  { _id: "6", title: "The Last House", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=400" },
  { _id: "7", title: "Main Vaapaa Aaunga", poster: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=400" },
  { _id: "8", title: "Action Waves", poster: "https://images.unsplash.com/photo-1501430654243-c934ccd2e1c0?q=80&w=400" },
  { _id: "9", title: "Magic Spell", poster: "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=400" },
  { _id: "10", title: "Cyberpunk Alley", poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400" },
];

export async function GET() {
  try {
    const db = await getDatabase();
    const movies = await db.collection("trending").find({}).toArray();
    if (movies && movies.length > 0) {
      return NextResponse.json(movies);
    }
    return NextResponse.json(FALLBACK_TRENDING);
  } catch (error) {
    return NextResponse.json(FALLBACK_TRENDING);
  }
}