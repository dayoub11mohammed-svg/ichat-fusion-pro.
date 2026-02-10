
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are an expert friend chatting on a messaging app like WhatsApp or Telegram. Keep your messages short, conversational, and friendly. Use emojis occasionally. Act as if you are the user's primary contact.",
        temperature: 0.9,
      }
    });

    return response.text || "I'm not sure what to say, but I'm here!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops, lost connection for a second. What were we saying?";
  }
};
