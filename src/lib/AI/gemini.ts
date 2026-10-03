import { GoogleGenAI } from "@google/genai";

export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
}

export const gemini = getGeminiApiKey()
  ? new GoogleGenAI({ apiKey: getGeminiApiKey() })
  : undefined;

export function getGeminiClient() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Add GEMINI_API_KEY or GOOGLE_API_KEY to your environment variables before using Gemini features."
    );
  }

  return gemini ?? new GoogleGenAI({ apiKey });
}


console.log(getGeminiApiKey())
console.log("hello")