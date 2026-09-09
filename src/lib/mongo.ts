import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase() {
  if (!uri || !clientPromise) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }
  const dbClient = await clientPromise;
  return dbClient.db("Moviebox");
}