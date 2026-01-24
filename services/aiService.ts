
import { GoogleGenAI } from "@google/genai";
import { TimelineItem, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHistoricalInsight = async (item: TimelineItem, lang: Language) => {
  const prompt = `As a world-class historian, provide a concise, fascinating, and educational insight about "${item.title[lang]}" (Year: ${item.startYear}). 
  Focus on its long-term impact on human history or Jewish culture. 
  Keep it under 100 words. Format as Markdown. Language: ${lang === 'he' ? 'Hebrew' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'he' ? "נכשל בטעינת תובנה חכמה." : "Failed to load AI insight.";
  }
};
