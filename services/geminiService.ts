
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization as per guidelines.
export const generateSubtasks = async (taskTitle: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a professional project manager. Break down the following task into a list of 5 concrete, actionable subtasks:
  
  Task: ${taskTitle}
  Description: ${description}
  
  Provide only a list of strings representing the subtasks.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    // response.text is a getter, use it directly.
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const suggestTaskPriority = async (taskTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on the task title "${taskTitle}", suggest if the priority should be LOW, NORMAL, HIGH, or URGENT. Explain briefly why.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};
