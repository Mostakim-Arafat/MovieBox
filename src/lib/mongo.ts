import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL as string;

if (!uri) {
    throw new Error("MONGO_URL environment variable is not defined");
}

// Use a global variable to cache the MongoClient promise across hot reloads in dev
const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development, use a global variable so the client is not recreated on every HMR
    if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(uri);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
}

export async function getDatabase() {
    const dbClient = await clientPromise;
    return dbClient.db("Moviebox");
}