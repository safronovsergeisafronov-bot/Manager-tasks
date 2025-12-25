
import { GoogleGenAI, Type } from "@google/genai";

export const generateSubtasks = async (taskTitle: string, description: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    console.error("Критическая ошибка: API_KEY отсутствует");
    return {
      subtasks: [],
      tokens: 0,
      isError: true,
      errorMsg: "API_KEY не настроен в Vercel. Добавьте переменную API_KEY в настройках проекта и сделайте Redeploy."
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Ты — профессиональный менеджер проектов. Разбей следующую задачу на 5 конкретных и выполнимых подзадач на РУССКОМ ЯЗЫКЕ:
    
    Задача: ${taskTitle}
    Описание: ${description}
    
    Верни только список строк в формате JSON.`;

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

    const text = response.text;
    const jsonStr = text?.trim() || '[]';
    
    return {
      subtasks: JSON.parse(jsonStr) as string[],
      tokens: response.usageMetadata?.totalTokenCount || 0,
      isError: false
    };
  } catch (e) {
    console.error("Ошибка при вызове Gemini API:", e);
    const errorMessage = e instanceof Error ? e.message : "Ошибка сети";
    return {
      subtasks: [],
      tokens: 0,
      isError: true,
      errorMsg: `Ошибка AI: ${errorMessage}`
    };
  }
};

export const suggestTaskPriority = async (taskTitle: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return { text: "Ошибка: Ключ API не настроен.", tokens: 0, isError: true };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `На основе названия задачи "${taskTitle}" предложи приоритет: НИЗКИЙ, СРЕДНИЙ, ВЫСОКИЙ или СРОЧНО. Дай краткое пояснение на русском языке.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return {
      text: response.text || "Не удалось получить ответ.",
      tokens: response.usageMetadata?.totalTokenCount || 0,
      isError: false
    };
  } catch (e) {
    return {
      text: "Ошибка при получении приоритета.",
      tokens: 0,
      isError: true
    };
  }
};
