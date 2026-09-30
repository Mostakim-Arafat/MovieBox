import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongo";
import { gemini } from "@/lib/AI/gemini";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log(query)

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!gemini) {
      return NextResponse.json({ success: false, error: "Gemini API key is missing" }, { status: 500 });
    }

    // 1. Generate embedding using Gemini text-embedding-004
    const embeddingResponse = await gemini.models.embedContent({
      model: "gemini-embedding-2",
      contents: query,
      config: {
        outputDimensionality: 768,
      },
    });

    const queryEmbedding = embeddingResponse.embeddings?.[0]?.values;

    if (!queryEmbedding || queryEmbedding.length === 0) {
      return NextResponse.json({ success: false, error: "Failed to generate embedding" }, { status: 500 });
    }

    console.log(queryEmbedding)

    // 2. Connect to MongoDB
    const db = await getDatabase();
    const moviesCollection = db.collection("metaData");

    // 3. Execute Vector Search Pipeline
    const results = await moviesCollection.aggregate([
      {
        $vectorSearch: {
          index: "MyfirstTry", // Make sure this matches your exact Atlas index name (or change to "movie_embedding_index")
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 20,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          poster: 1,
          genre: 1,     // Using your collection's field name ("genre")
          year: 1,      // Using your collection's field name ("year")
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]).toArray();

    const filteredResults = results.filter((movie) => movie.score > 0.7);
    console.log(filteredResults)

    return NextResponse.json({ success: true, movies: filteredResults }, { status: 200 });
  } catch (error: any) {
    console.error("AI Search Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}