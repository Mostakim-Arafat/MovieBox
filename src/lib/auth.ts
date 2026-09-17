import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!mongoUrl) {
  console.warn(
    "\n⚠️  [MovieBox Auth] MONGO_URL is missing in your .env or .env.local file.\n" +
    "👉 Please add MONGO_URL=\"your_mongodb_connection_string\" to .env.local to enable database authentication.\n"
  );
}

// Fallback to a valid scheme connection string so MongoClient doesn't crash on undefined at module startup
const client = new MongoClient(mongoUrl || "mongodb://127.0.0.1:27017/Moviebox");
const db = client.db("Moviebox");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "development_secret_key_moviebox_123456789",
  user: {
    modelName: "users",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
});