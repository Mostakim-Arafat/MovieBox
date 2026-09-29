import { getGeminiClient } from "@/lib/gemini";

export async function createMovieEmbedding(movie: {
  title: string;
  description?: string;
  genres?: string[];
  releaseYear?: number;
}) {
  const text = `
title: ${movie.title}
text: ${movie.description ?? ""}
genre: ${(movie.genres ?? []).join(", ")}
year: ${movie.releaseYear ?? ""}
`.trim();

  const client = getGeminiClient();
  const response = await client.models.embedContent({
    model: "gemini-embedding-2",
    contents: `title: ${movie.title} | text: ${text}`,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0];

  if (!embedding) {
    throw new Error("Gemini did not return an embedding for this movie.");
  }

  return embedding.values;
}
