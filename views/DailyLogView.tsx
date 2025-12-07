import React, { useState } from 'react';
import { DailyLog, HabitIntervention } from '../types';
import { parseNaturalLanguageLog } from '../services/geminiService';
import { Save, Sun, Cloud, CloudRain, PlusCircle, Activity, Mic, Sparkles, Loader2, Edit3, ArrowDown } from 'lucide-react';

interface DailyLogViewProps {
  onAddLog: (log: DailyLog) => void;
  onAddIntervention: (intervention: HabitIntervention) => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({ onAddLog, onAddIntervention }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'intervention'>('daily');

  // State for Daily Log
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

  // Smart Log States
  const [nlInput, setNlInput] = useState('');
  const [isProcessingNL, setIsProcessingNL] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // State for New Intervention
  const [interventionForm, setInterventionForm] = useState<Partial<HabitIntervention>>({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleDailySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      ...formData as DailyLog,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    onAddLog(newLog);
    alert("Daily data logged successfully!");
    setNlInput('');
  };

  const handleInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!interventionForm.name) return;

    const newIntervention: HabitIntervention = {
      id: Math.random().toString(36).substr(2, 9),
      name: interventionForm.name || 'New Habit',
      description: interventionForm.description || '',
      startDate: interventionForm.startDate || new Date().toISOString().split('T')[0],
    };
    onAddIntervention(newIntervention);
    alert("New habit intervention started! Tracking effectiveness...");
    // Reset form
    setInterventionForm({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const update = (key: keyof DailyLog, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNlInput(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleSmartExtract = async () => {
    if (!nlInput.trim()) return;
    setIsProcessingNL(true);
    try {
      const extractedData = await parseNaturalLanguageLog(nlInput);
      setFormData(prev => ({ ...prev, ...extractedData }));
    } catch (error) {
      console.error("Failed to extract data", error);
      alert("Could not extract data from text. Please try again.");
    } finally {
      setIsProcessingNL(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Tab Header */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'daily' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <Activity size={16} /> Daily Log
          </button>
          <button 
            onClick={() => setActiveTab('intervention')}
            className={`flex-1 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'intervention' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <PlusCircle size={16} /> New Habit
          </button>
        </div>
        
        {/* Daily Tracking Form */}
        {activeTab === 'daily' && (
          <div className="p-4 md:p-8 animate-fade-in">
             
             {/* Section 1: AI Smart Log */}
             <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-xl border border-indigo-100 p-4 md:p-6 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Sparkles size={64} className="text-indigo-600" />
               </div>
               
               <div className="relative z-10">
                 <label className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                   <Sparkles size={16} className="text-indigo-600" />
                   Smart Log (AI)
                 </label>
                 <p className="text-xs text-indigo-700/80 mb-3">
                   Describe your day naturally (e.g., "Drank coffee at 2 PM, ran 5k, slept poorly"). We'll extract the data.
                 </p>
                 
                 <div className="relative">
                   <textarea 
                      value={nlInput}
                      onChange={(e) => setNlInput(e.target.value)}
                      placeholder="Type or speak here..."
                      className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none pr-10 min-h-[80px] resize-none"
                   />
                   <button 
                    onClick={startListening}
                    className={`absolute right-2 bottom-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                    title="Voice Input"
                   >
                     <Mic size={18} />
                   </button>
                 </div>

                 <button 
                  onClick={handleSmartExtract}
                  disabled={!nlInput || isProcessingNL}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                 >
                   {isProcessingNL ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                   {isProcessingNL ? 'Extracting Data...' : 'Analyze & Fill Form'}
                 </button>
               </div>
             </div>

             <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] bg-slate-200 flex-1"></div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <ArrowDown size={12} /> Then Review Below
                </span>
                <div className="h-[1px] bg-slate-200 flex-1"></div>
             </div>

             {/* Section 2: Preset Habits Form */}
             <form onSubmit={handleDailySubmit} className="space-y-6 md:space-y-8">
              
              {/* Inputs Section */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <Edit3 size={18} className="text-slate-400" />
                  Habits (Preset Metrics)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                <h3 className="text-base md:text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Context</h3>
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2">
                  {['Sunny', 'Cloudy', 'Rainy'].map((weather) => (
                    <button 
                      key={weather}
                      type="button"
                      onClick={() => update('weatherCondition', weather)}
                      className={`flex-1 min-w-[80px] py-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${formData.weatherCondition === weather ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {weather === 'Sunny' && <Sun size={20} />}
                      {weather === 'Cloudy' && <Cloud size={20} />}
                      {weather === 'Rainy' && <CloudRain size={20} />}
                      <span className="text-sm font-medium">{weather}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <input type="checkbox" id="workday" checked={formData.isWorkDay} onChange={e => update('isWorkDay', e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                  <label htmlFor="workday" className="text-slate-700 font-medium">Is this a Work Day?</label>
                </div>
              </div>

              {/* Outcomes Section */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Outcomes</h3>
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

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base">
                <Save size={20} />
                Save Daily Log
              </button>
            </form>
          </div>
        )}

        {/* New Intervention Form */}
        {activeTab === 'intervention' && (
           <form onSubmit={handleInterventionSubmit} className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in bg-slate-50/50">
             <div className="bg-indigo-50 border border-indigo-100 p-3 md:p-4 rounded-lg text-indigo-800 text-xs md:text-sm mb-4">
                <strong>Event Study:</strong> Define a specific change you are making (e.g., "Started Magnesium"). We will mark this date to measure the causal impact (Pre vs. Post).
             </div>
             
             <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Intervention Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Magnesium Glycinate, Morning Run, No Caffeine"
                    value={interventionForm.name}
                    onChange={(e) => setInterventionForm(prev => ({...prev, name: e.target.value}))}
                    className="w-full rounded-lg border-slate-300 border p-3 md:p-4 text-base md:text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description / Protocol</label>
                  <textarea 
                    placeholder="Describe the exact protocol (e.g., 200mg taken 30 mins before bed, or 3 sets of 10 pushups)"
                    value={interventionForm.description}
                    onChange={(e) => setInterventionForm(prev => ({...prev, description: e.target.value}))}
                    className="w-full rounded-lg border-slate-300 border p-3 md:p-4 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm md:text-base"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={interventionForm.startDate}
                    onChange={(e) => setInterventionForm(prev => ({...prev, startDate: e.target.value}))}
                    className="w-full rounded-lg border-slate-300 border p-3 md:p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
             </div>

             <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base">
               <PlusCircle size={20} />
               Start Intervention
             </button>
           </form>
        )}
      </div>
    </div>
  );
};