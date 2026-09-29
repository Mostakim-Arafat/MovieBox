import { GoogleGenAI } from "@google/genai";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

//unknown to me
function loadGeminiEnvFromFiles() {
  const envFiles = [".env"];

  for (const envFile of envFiles) {
    const filePath = path.resolve(process.cwd(), envFile);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;

      const [, key, value] = match;
      const cleanValue = value.replace(/^['"]|['"]$/g, "").trim();

      if ((key === "GEMINI_API_KEY") && !process.env[key]) {
        process.env[key] = cleanValue;
      }
    }
  }
}

loadGeminiEnvFromFiles();
// till this
export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY ?? "";
}

export const gemini = getGeminiApiKey()
  ? new GoogleGenAI({ apiKey: getGeminiApiKey() })
  : undefined;

export function getGeminiClient() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Add GEMINI_API_KEY or GOOGLE_API_KEY to your .env file or export it in the shell before using Gemini features."
    );
  }

  return gemini ?? new GoogleGenAI({ apiKey });
}


console.log(getGeminiApiKey())
console.log("hello")