import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Save, Sun, Cloud, CloudRain } from 'lucide-react';

interface DailyLogViewProps {
  onAddLog: (log: DailyLog) => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({ onAddLog }) => {
  const [formData, setFormData] = useState<Partial<DailyLog>>({
    caffeineIntake: 200,
    caffeineCutoffHour: 14,
    screenTimeMinutes: 120,
    exerciseMinutes: 30,
    meditationMinutes: 0,
    weatherCondition: 'Sunny',
    isWorkDay: true,
    sleepQuality: 7,
    energyLevel: 7,
    stressLevel: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      ...formData as DailyLog,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    onAddLog(newLog);
    alert("Log saved successfully!");
  };

  const update = (key: keyof DailyLog, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Daily Log</h2>
          <p className="text-teal-100 opacity-90">Track your inputs and outcomes to fuel the Causal Engine.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Inputs Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Habits (Inputs)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Caffeine (mg)</label>
                <input type="number" value={formData.caffeineIntake} onChange={e => update('caffeineIntake', Number(e.target.value))} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Last Coffee Time (24h)</label>
                <input type="number" max={24} min={0} value={formData.caffeineCutoffHour} onChange={e => update('caffeineCutoffHour', Number(e.target.value))} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
                <p className="text-xs text-slate-400 mt-1">e.g., 14 for 2:00 PM</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Exercise (mins)</label>
                <input type="range" min="0" max="180" value={formData.exerciseMinutes} onChange={e => update('exerciseMinutes', Number(e.target.value))} className="w-full accent-teal-600" />
                <div className="text-right text-sm text-slate-600">{formData.exerciseMinutes} min</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Screen Time (mins)</label>
                <input type="number" value={formData.screenTimeMinutes} onChange={e => update('screenTimeMinutes', Number(e.target.value))} className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>

            </div>
          </div>

          {/* Context Section */}
           <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Context</h3>
            <div className="flex gap-4">
              {['Sunny', 'Cloudy', 'Rainy'].map((weather) => (
                <button 
                  key={weather}
                  type="button"
                  onClick={() => update('weatherCondition', weather)}
                  className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${formData.weatherCondition === weather ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  {weather === 'Sunny' && <Sun size={20} />}
                  {weather === 'Cloudy' && <Cloud size={20} />}
                  {weather === 'Rainy' && <CloudRain size={20} />}
                  <span className="text-sm font-medium">{weather}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="workday" checked={formData.isWorkDay} onChange={e => update('isWorkDay', e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              <label htmlFor="workday" className="text-slate-700">Is this a Work Day?</label>
            </div>
          </div>

          {/* Outcomes Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Outcomes</h3>
             <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-600">Sleep Quality</label>
                  <span className="text-sm font-bold text-teal-600">{formData.sleepQuality}/10</span>
                </div>
                <input type="range" min="1" max="10" value={formData.sleepQuality} onChange={e => update('sleepQuality', Number(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>

               <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-600">Energy Level</label>
                  <span className="text-sm font-bold text-teal-600">{formData.energyLevel}/10</span>
                </div>
                <input type="range" min="1" max="10" value={formData.energyLevel} onChange={e => update('energyLevel', Number(e.target.value))} className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>
             </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-2">
            <Save size={20} />
            Log Data
          </button>
        </form>
      </div>
    </div>
  );
};