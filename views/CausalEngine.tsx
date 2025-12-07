import React, { useState } from 'react';
import { DailyLog, CausalInsight } from '../types';
import { analyzeCausalImpact } from '../services/geminiService';
import { BrainCircuit, Loader2, ArrowRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface CausalEngineProps {
  logs: DailyLog[];
}

export const CausalEngine: React.FC<CausalEngineProps> = ({ logs }) => {
  const [insights, setInsights] = useState<CausalInsight[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await analyzeCausalImpact(logs);
      setInsights(results);
    } catch (err) {
      setError("Failed to run analysis. Ensure you have a valid API Key and connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <BrainCircuit className="text-teal-400 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Drivers Analysis Engine</h1>
          </div>
          <p className="text-slate-300 max-w-2xl text-base md:text-lg mb-8 leading-relaxed">
            Most trackers only show correlations. We use Gemini 3 Pro to run counterfactual simulations on your history 
            to identify what <span className="text-teal-400 font-bold italic">actually causes</span> changes in your sleep and energy.
          </p>

          {!insights && !isLoading && (
            <button 
              onClick={handleRunAnalysis}
              className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 md:py-3 px-8 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25"
            >
              Run Drivers Analysis
              <ArrowRight size={18} />
            </button>
          )}

          {isLoading && (
            <div className="flex flex-col md:flex-row items-center gap-3 text-teal-300">
              <Loader2 className="animate-spin" />
              <span className="text-sm md:text-base text-center md:text-left">Analyzing {logs.length} data points with Counterfactual Logic...</span>
            </div>
          )}
          
          {error && <p className="text-red-400 mt-4 bg-red-900/20 p-3 rounded-lg border border-red-500/30 text-sm">{error}</p>}
        </div>
      </div>

      {/* Results Grid */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in-up">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className={`h-2 w-full ${insight.impactType === 'POSITIVE' ? 'bg-green-500' : insight.impactType === 'NEGATIVE' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
              <div className="p-5 md:p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Driver Identified</span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">{insight.factor}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0
                    ${insight.impactType === 'POSITIVE' ? 'bg-green-100 text-green-700' : insight.impactType === 'NEGATIVE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}
                  `}>
                    {insight.impactType === 'POSITIVE' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {insight.impactType} IMPACT
                  </div>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed flex-1 text-sm md:text-base">
                  {insight.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={14} className="text-teal-600" />
                    <span className="text-xs font-bold text-teal-700 uppercase">Recommendation</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{insight.recommendation}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-xs text-slate-400 font-medium">Causal Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 md:w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800" style={{ width: `${insight.confidenceScore}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{insight.confidenceScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};