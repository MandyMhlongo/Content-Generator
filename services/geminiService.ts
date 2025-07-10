
import { GoogleGenAI, GenerateContentResponse, Candidate as GoogleGenAICandidate } from "@google/genai";
import { API_MODEL_NAME } from '../constants';
import { GeminiResponseData, Candidate } from "../types";


// Ensure API_KEY is available. In a real app, this might come from a secure backend or build-time env.
// For this environment, we assume process.env.API_KEY is set.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
  // It's better to throw an error or handle this state in the UI
  // For now, the app will show an error message during generation if API key is missing.
}

const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" }); // Provide a dummy if not set to avoid immediate crash on load

export const generateContentWithGemini = async (
  prompt: string, 
  systemInstruction?: string
): Promise<GeminiResponseData> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }

  try {
    const config: { systemInstruction?: string; temperature?: number; topK?: number; topP?: number } = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    // You can add other parameters like temperature, topK, topP here if needed
    // config.temperature = 0.7; 

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: API_MODEL_NAME,
      contents: prompt,
      config: config,
    });
    
    // The Gemini API client directly provides 'text' and 'candidates' on the response object.
    const text = response.text;
    
    // Explicitly cast to bridge the type gap if direct assignment isn't enough,
    // or ensure your local 'Candidate' type is a superset or compatible subset.
    // Given the types.ts modification, this direct assignment should now be valid.
    const candidates: Candidate[] | undefined = response.candidates as Candidate[] | undefined;


    if (text === undefined || text === null) {
      // This case should ideally be covered by safety ratings or other errors from the API.
      // If text is truly missing without an error, it's an unexpected state.
      console.warn("Gemini API returned a response without text content.");
      return { text: "", candidates: candidates };
    }

    return { text: text, candidates: candidates };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Check for common API key related errors (this is a guess, actual error messages may vary)
      if (error.message.toLowerCase().includes("api key not valid") || error.message.toLowerCase().includes("permission denied")) {
        throw new Error("Invalid or missing API Key. Please check your configuration.");
      }
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
