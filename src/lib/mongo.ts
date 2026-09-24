import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Moviebox";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getDatabase() {
    if (!clientPromise) {
        client = new MongoClient(uri);
        clientPromise = client.connect();
    }
    const dbClient = await clientPromise;
    return dbClient.db("Moviebox");
}