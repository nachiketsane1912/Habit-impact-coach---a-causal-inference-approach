import React from 'react';
import { DailyLog } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, AreaChart, Area, ReferenceLine, ComposedChart
} from 'recharts';
import { TrendingUp, Moon, Battery, Coffee, ArrowUpRight, ArrowDownRight, Activity, Users } from 'lucide-react';

interface DashboardProps {
  logs: DailyLog[];
}

// Synthetic data for the "Intervention Analysis" chart
const generateInterventionData = () => {
  const data = [];
  // 10 days pre-intervention
  for(let i=1; i<=10; i++) {
    data.push({ day: `Day ${i}`, phase: 'Pre-Intervention', actual: 6.5 + Math.random(), counterfactual: null });
  }
  // 10 days post-intervention (Start Magnesium)
  for(let i=11; i<=20; i++) {
    // Counterfactual: What would happen if they didn't take it? (Remains flat)
    const cf = 6.5 + Math.random(); 
    // Actual: It goes up
    const act = 8.0 + Math.random(); 
    data.push({ day: `Day ${i}`, phase: 'Post-Intervention', actual: act, counterfactual: cf });
  }
  return data;
};

// Synthetic data for the "Population Distribution" chart (Bell Curve)
const generateDistributionData = () => {
  const data = [];
  for (let i = -3; i <= 3; i += 0.1) {
    // Normal distribution formula
    const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * i * i);
    data.push({ x: i, y: y, label: (i).toFixed(1) });
  }
  return data;
};

export const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentLogs = sortedLogs.slice(-14); 

  const avgSleep = (recentLogs.reduce((acc, curr) => acc + curr.sleepQuality, 0) / recentLogs.length).toFixed(1);
  const avgEnergy = (recentLogs.reduce((acc, curr) => acc + curr.energyLevel, 0) / recentLogs.length).toFixed(1);

  const interventionData = generateInterventionData();
  const distributionData = generateDistributionData();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Health Impact</h2>
          <p className="text-slate-500 mt-1">Daily correlations and causal drivers.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wide">Beta Access</span>
          <span className="text-sm text-slate-400 self-center">Last updated today</span>
        </div>
      </div>

      {/* 2. Top Level Drivers (The "Output" of Causal Engine) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-200 mb-2 text-sm font-semibold uppercase tracking-wider">
              <Activity size={16} /> Top Driver #1
            </div>
            <h3 className="text-2xl font-bold mb-1">Caffeine Timing</h3>
            <div className="flex items-center gap-2 mt-4">
               <div className="bg-white/20 p-2 rounded-lg">
                 <ArrowDownRight size={24} className="text-red-300" />
               </div>
               <div>
                 <p className="text-sm text-indigo-100">Negative Impact on</p>
                 <p className="font-bold">Sleep Quality</p>
               </div>
            </div>
            <p className="text-xs text-indigo-300 mt-4 border-t border-white/10 pt-3">
              Stopping caffeine 8hrs before bed adds +1.2 hrs deep sleep.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg shadow-teal-900/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10">
            <div className="flex items-center gap-2 text-teal-200 mb-2 text-sm font-semibold uppercase tracking-wider">
              <Activity size={16} /> Top Driver #2
            </div>
            <h3 className="text-2xl font-bold mb-1">Morning Cardio</h3>
            <div className="flex items-center gap-2 mt-4">
               <div className="bg-white/20 p-2 rounded-lg">
                 <ArrowUpRight size={24} className="text-green-300" />
               </div>
               <div>
                 <p className="text-sm text-teal-100">Positive Impact on</p>
                 <p className="font-bold">Energy Level</p>
               </div>
            </div>
             <p className="text-xs text-teal-300 mt-4 border-t border-white/10 pt-3">
              30 mins of cardio before 9 AM boosts daily focus by 22%.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
             <Activity size={24} />
           </div>
           <p className="text-slate-500 font-medium">Looking for more drivers...</p>
           <p className="text-xs text-slate-400 mt-1">Log 5 more days to unlock Driver #3</p>
        </div>
      </div>

      {/* 3. The "Doctor Analogy": Population Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="mb-6">
             <div className="flex items-center gap-2 text-teal-600 font-bold uppercase text-xs tracking-wider mb-2">
               <Users size={14} /> Population Analysis
             </div>
             <h3 className="text-xl font-bold text-slate-800">Your "Response Profile"</h3>
             <p className="text-sm text-slate-500 mt-1">
               Like a doctor placing a patient on a clinical distribution, we analyze how <i>you</i> respond to habits compared to the global population.
             </p>
           </div>
           
           <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={distributionData}>
                 <defs>
                   <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip />
                 <Area type="monotone" dataKey="y" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPop)" />
                 {/* The User's Position - High Responder */}
                 <ReferenceLine x={1.8} stroke="#0d9488" strokeWidth={2} label={{ value: 'YOU', position: 'top', fill: '#0d9488', fontSize: 12, fontWeight: 'bold' }} />
               </AreaChart>
             </ResponsiveContainer>
             <div className="absolute bottom-4 left-0 w-full text-center text-xs font-bold text-slate-400">
                LOW RESPONDER &larr;  SENSITIVITY TO CAFFEINE  &rarr; HIGH RESPONDER
             </div>
           </div>
           <div className="bg-teal-50 border border-teal-100 p-3 rounded-lg mt-2">
             <p className="text-xs text-teal-800">
               <strong>Insight:</strong> You are in the <strong>92nd percentile</strong> for caffeine sensitivity. Unlike the average person, even 20mg after 4 PM disrupts your REM cycles.
             </p>
           </div>
        </div>

        {/* 4. Intervention Analysis (Causal Counterfactual) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
             <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-wider mb-2">
               <TrendingUp size={14} /> Causal Intervention
             </div>
             <h3 className="text-xl font-bold text-slate-800">Magnesium Supplement Impact</h3>
             <p className="text-sm text-slate-500 mt-1">
               Comparing your actual sleep (solid) vs. the counterfactual "what if" (dashed) if you hadn't started.
             </p>
           </div>
           
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={interventionData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="day" hide />
                 <YAxis domain={[5, 10]} hide />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                 
                 {/* The Intervention Line */}
                 <ReferenceLine x="Day 10" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Started Habit', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10 }} />
                 
                 <Line type="monotone" dataKey="actual" name="Actual Sleep Quality" stroke="#4f46e5" strokeWidth={3} dot={false} />
                 <Line type="monotone" dataKey="counterfactual" name="Counterfactual (What If)" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
               </ComposedChart>
             </ResponsiveContainer>
           </div>
           <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg mt-2">
             <p className="text-xs text-indigo-800">
               <strong>Causal Finding:</strong> The gap between the lines represents the true causal effect. Magnesium caused a <strong>+1.5 point</strong> lift in sleep quality.
             </p>
           </div>
        </div>
      </div>

      {/* 5. Traditional Correlations (Legacy View) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Raw Correlations (Last 14 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => val.split('-')[2]} 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} domain={[0, 10]} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" stroke="#94a3b8" fontSize={12} orientation="right" domain={[10, 22]} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="sleepQuality" name="Sleep Quality" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 6}} />
              <Line yAxisId="right" type="monotone" dataKey="caffeineCutoffHour" name="Caffeine Cutoff (Hr)" stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};