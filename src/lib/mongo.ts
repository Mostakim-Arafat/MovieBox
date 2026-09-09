
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL as string

console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

const client = new MongoClient(uri)
const clientPromise = client.connect()

export async function getDatabase() {
    const dbClient = await clientPromise
    return dbClient.db("Moviebox")
}