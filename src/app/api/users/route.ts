import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";

export async function GET(){
    try{
        const db = await getDatabase()
        const user = await db.collection('users').find().toArray()
        return NextResponse.json(user)
    }
    catch{
        return NextResponse.json({ error : "user get data issue"})
    }
}

