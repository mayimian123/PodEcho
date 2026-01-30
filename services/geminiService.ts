import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to get the correct model based on complexity
const FLASH_MODEL = 'gemini-3-flash-preview'; // Good for extraction (Basic Text Tasks)
const PRO_MODEL = 'gemini-3-pro-preview'; // Good for reasoning/chat (Complex Text Tasks)

export const extractInsight = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure process.env.API_KEY.";
  
  try {
    const prompt = `
      You are an expert learning assistant. 
      Analyze the following text from a podcast transcript. 
      Extract the core underlying concept or insight in a concise, high-impact sentence. 
      Do not use "The text says" or "The speaker mentions". Just state the insight directly.
      
      Text: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
    });

    return response.text || "Could not extract insight.";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return "Error generating insight.";
  }
};

export const chatWithContext = async (
  history: { role: 'user' | 'model'; text: string }[],
  contextText: string,
  userMessage: string
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";

  try {
    const systemInstruction = `
      You are a Socratic tutor helping a user deepen their understanding of a specific podcast segment.
      
      The user is focusing on this specific excerpt: "${contextText}"
      
      Your goal is to:
      1. Answer their questions based on the excerpt.
      2. Challenge them gently to think deeper.
      3. Connect ideas to broader concepts (Feynman technique, mental models).
      4. Keep responses conversational but intellectual.
      5. Keep responses relatively short (under 150 words) unless asked for elaboration.
    `;

    // Map history to the format expected by the SDK if needed, 
    // but generateContent is stateless, so we construct the prompt manually or use chat
    // For this simple implementation, we will use a stateless prompt with history appended for simplicity
    // or use the Chat API. Let's use Chat API.

    const chat = ai.chats.create({
      model: PRO_MODEL,
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm having trouble thinking right now.";

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error communicating with AI.";
  }
};

export const generateSummary = async (notes: any[]): Promise<any> => {
  if (!process.env.API_KEY) return null;
  
  // This would be used for the "Save" feature in deep dive or Export
  // Mocked for the simple demo flow, but here is how it would work.
  return "Summary generation not fully implemented in this demo path.";
};