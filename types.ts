export interface DailyLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  
  // Habits (Inputs)
  caffeineIntake: number; // mg
  caffeineCutoffHour: number; // 24h format, e.g. 14 for 2pm
  screenTimeMinutes: number;
  exerciseMinutes: number;
  meditationMinutes: number;
  
  // Context (Covariates)
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';
  isWorkDay: boolean;
  
  // Outcomes
  sleepQuality: number; // 1-10
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
}

export interface CausalInsight {
  factor: string;
  impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidenceScore: number; // 0-100
  description: string;
  recommendation: string;
}

export interface SimulationMessage {
  role: 'user' | 'model';
  text: string;
}
