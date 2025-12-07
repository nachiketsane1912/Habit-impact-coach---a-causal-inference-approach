import { DailyLog } from '../types';

// Helper to generate a date string X days ago
const getDateXDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// We generate 30 days of data with a specific hidden pattern:
// 1. Late caffeine (> 15:00) causes Sleep Quality < 6.
// 2. Exercise > 30 mins causes Energy Level > 7.
// 3. High Stress is correlated with Work Days.

export const generateMockData = (): DailyLog[] => {
  const logs: DailyLog[] = [];

  for (let i = 29; i >= 0; i--) {
    const isWorkDay = i % 7 !== 0 && i % 7 !== 6;
    const baseStress = isWorkDay ? 6 : 3;
    
    // Random variations
    let caffeineCutoff = 12 + Math.floor(Math.random() * 8); // 12pm to 8pm
    let exercise = Math.random() > 0.4 ? 15 + Math.floor(Math.random() * 45) : 0; // 60% chance of exercise
    let caffeineMg = 100 + Math.floor(Math.random() * 200);

    // Causal Logic injection for realistic AI discovery
    let sleepQuality = 7 + Math.floor(Math.random() * 3); // Base good sleep
    
    // Causal Rule 1: Late caffeine destroys sleep
    if (caffeineCutoff > 15) {
      sleepQuality -= Math.floor(Math.random() * 3) + 2; // Drop by 2-5 points
    }

    // Causal Rule 2: Exercise boosts energy
    let energyLevel = 5 + Math.floor(Math.random() * 3);
    if (exercise > 30) {
      energyLevel += 2;
    }
    
    // Cap values
    sleepQuality = Math.max(1, Math.min(10, sleepQuality));
    energyLevel = Math.max(1, Math.min(10, energyLevel));

    logs.push({
      id: `log-${i}`,
      date: getDateXDaysAgo(i),
      caffeineIntake: caffeineMg,
      caffeineCutoffHour: caffeineCutoff,
      screenTimeMinutes: 60 + Math.floor(Math.random() * 120),
      exerciseMinutes: exercise,
      meditationMinutes: Math.random() > 0.7 ? 15 : 0,
      weatherCondition: Math.random() > 0.5 ? 'Sunny' : 'Cloudy',
      isWorkDay,
      sleepQuality,
      energyLevel,
      stressLevel: Math.max(1, Math.min(10, baseStress + (Math.random() * 2 - 1))),
    });
  }

  return logs;
};