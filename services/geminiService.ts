import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, CausalInsight } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCausalImpact = async (logs: DailyLog[]): Promise<CausalInsight[]> => {
  const ai = getClient();
  
  // We use the 3-pro-preview model for complex reasoning and causal inference
  const modelId = 'gemini-3-pro-preview';

  const prompt = `
    You are an expert Causal Inference Engine for a Habit Coaching app.
    
    I will provide you with 365 days of user logs containing habits (inputs), context (covariates like weather/workday), and outcomes (sleep, energy).
    
    YOUR TASK:
    1. Analyze the data to find TRUE CAUSAL DRIVERS, not just correlations.
    2. Use logic similar to 'Difference-in-Differences' or 'Counterfactual Reasoning' (e.g., compare days with similar contexts but different habits).
    3. Identify the top 3 factors driving 'Sleep Quality' or 'Energy Level'.
    
    DATA:
    ${JSON.stringify(logs.slice(-14))} // Sending last 14 days to keep context manageable but sufficient

    OUTPUT FORMAT:
    Return a JSON array of objects.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            factor: { type: Type.STRING, description: "The specific habit or context identified." },
            impactType: { type: Type.STRING, enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
            confidenceScore: { type: Type.INTEGER, description: "Confidence 0-100 based on data consistency." },
            description: { type: Type.STRING, description: "Explanation of the causal link found." },
            recommendation: { type: Type.STRING, description: "Actionable advice based on this finding." }
          },
          required: ["factor", "impactType", "confidenceScore", "description", "recommendation"]
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as CausalInsight[];
  }
  return [];
};

export const runCounterfactualSimulation = async (
  logs: DailyLog[], 
  userQuery: string, 
  history: {role: string, parts: {text: string}[]}[]
) => {
  const ai = getClient();
  const modelId = 'gemini-2.5-flash'; // Flash is sufficient for chat/simulation speed

  const systemInstruction = `
    You are the 'Habit Impact Simulator'. 
    Your goal is to answer "What If" questions based on the user's historical data and general causal knowledge.
    
    User Data Context:
    ${JSON.stringify(logs.slice(-7))}

    Rules:
    1. Be scientific but accessible.
    2. If the user's data supports a conclusion (e.g., "Every time you drank coffee late, sleep dropped"), cite the data.
    3. If data is sparse, use general scientific consensus but label it as "General Knowledge" or "External Evidence".
    4. Provide specific predicted outcomes (e.g., "Sleep quality would likely improve by ~15%").
  `;

  const chat = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction,
    },
    history: history
  });

  const result = await chat.sendMessage({ message: userQuery });
  return result.text;
};

export const parseNaturalLanguageLog = async (text: string): Promise<Partial<DailyLog>> => {
  const ai = getClient();
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    Extract health and habit metrics from the following user journal entry into a structured JSON format.
    
    USER ENTRY: "${text}"

    INSTRUCTIONS:
    - Map 'coffee', 'latte', 'espresso' to 'caffeineIntake' (estimate mg: coffee=100, espresso=64).
    - Identify 'caffeineCutoffHour' (0-24) based on the *last* time they mention caffeine.
    - Extract 'exerciseMinutes' and 'screenTimeMinutes'.
    - Infer 'sleepQuality', 'energyLevel', 'stressLevel' (1-10) if mentioned (e.g. "felt great" = 8-9 energy).
    - If a field is not mentioned, do NOT include it in the JSON.
    - Return ONLY valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caffeineIntake: { type: Type.INTEGER },
          caffeineCutoffHour: { type: Type.INTEGER },
          screenTimeMinutes: { type: Type.INTEGER },
          exerciseMinutes: { type: Type.INTEGER },
          meditationMinutes: { type: Type.INTEGER },
          sleepQuality: { type: Type.INTEGER },
          energyLevel: { type: Type.INTEGER },
          stressLevel: { type: Type.INTEGER },
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as Partial<DailyLog>;
  }
  return {};
};