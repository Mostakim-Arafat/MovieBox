import { MongoClient } from "mongodb";
import dns from "dns";

// Set DNS servers to Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = "mongodb+srv://moviebox:movie2005@cluster0.6ivmdtk.mongodb.net/?appName=Cluster0";

async function test() {
    try {
        console.log("Connecting...");
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
        await client.connect();
        console.log("Connected!");
        
        const db = client.db("Moviebox");
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
        // Test metaData collection
        const movieCount = await db.collection("metaData").countDocuments();
        console.log("Movies in metaData:", movieCount);
        
        // Test trending collection
        const trendingCount = await db.collection("trending").countDocuments();
        console.log("Trending count:", trendingCount);
        
        // Get one movie sample
        const sample = await db.collection("metaData").findOne();
        console.log("Sample movie keys:", sample ? Object.keys(sample) : "No data");
        
        // Get one trending sample
        const trendingSample = await db.collection("trending").findOne();
        console.log("Trending sample keys:", trendingSample ? Object.keys(trendingSample) : "No data");
        
        await client.close();
        console.log("Done!");
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
