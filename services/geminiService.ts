
import { GoogleGenAI, Type } from "@google/genai";

// Безопасное получение API ключа без краша приложения
const getApiKey = () => {
  try {
    // В браузере без сборщика process может быть не определен
    return (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : "";
  } catch (e) {
    return "";
  }
};

export const generateSubtasks = async (taskTitle: string, description: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("API_KEY не настроен. AI функции будут недоступны.");
    return ["Ошибка: API_KEY не настроен в переменных окружения"];
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Ты — профессиональный менеджер проектов. Разбей следующую задачу на 5 конкретных и выполнимых подзадач на РУССКОМ ЯЗЫКЕ:
  
  Задача: ${taskTitle}
  Описание: ${description}
  
  Верни только список строк.`;

  try {
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

    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Ошибка парсинга AI ответа", e);
    return ["Не удалось сгенерировать подзадачи автоматически"];
  }
};

export const suggestTaskPriority = async (taskTitle: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return "API_KEY не настроен";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `На основе названия задачи "${taskTitle}" предложи приоритет: НИЗКИЙ, СРЕДНИЙ, ВЫСОКИЙ или СРОЧНО. Дай краткое пояснение на русском языке.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (e) {
    return "Не удалось получить рекомендацию по приоритету";
  }
};
