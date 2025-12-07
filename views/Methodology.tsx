import React from 'react';
import { BookOpen, Scale, GitBranch, Stethoscope, ArrowRight } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 text-teal-700 rounded-full mb-4">
          <BookOpen size={24} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Science of "Why"</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          How Habit Impact Coach moves beyond simple correlation to determine true causality in your life.
        </p>
      </div>

      {/* 1. The Doctor Analogy */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 flex items-start gap-4">
             <div className="p-3 bg-white/10 rounded-xl">
               <Stethoscope size={32} className="text-teal-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold mb-2">The Digital Doctor Analogy</h2>
               <p className="text-slate-300 leading-relaxed">
                 A doctor doesn't just look at your symptoms; they look at **population research**. They know that a treatment works for 80% of people (the distribution) and they try to figure out where *you* sit on that curve.
               </p>
             </div>
           </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
             <h3 className="font-bold text-slate-800 mb-2">Step 1: Reading the Research</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               Our engine ingests thousands of scientific papers and anonymized datasets to understand the "Base Rate." We know that generally, caffeine ruins sleep, but exercise improves it. This creates the "Prior Belief" distribution.
             </p>
           </div>
           <div>
             <h3 className="font-bold text-slate-800 mb-2">Step 2: Placing You on the Curve</h3>
             <p className="text-sm text-slate-600 leading-relaxed">
               As you log data, we update your position. You might be an outlier who *can* drink coffee at 8 PM and sleep fine. The app acts as a doctor diagnosing your specific "phenotype" by comparing your personal data against the global average.
             </p>
           </div>
        </div>
      </div>

      {/* 2. Counterfactuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <GitBranch size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Counterfactuals</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            To know if a habit *caused* a result, we must ask: <strong>"What would have happened if you hadn't done it?"</strong>
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Since we can't relive the past, we use <strong>Synthetic Control Methods</strong>. We build a virtual model of "You" that didn't take that supplement, and compare it to the real "You" that did. The difference is the true causal impact.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Scale size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Correlation vs. Causation</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            <strong>Correlation:</strong> "I sleep better on rainy days." (Maybe you just go to bed earlier?)
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            <strong>Causation:</strong> "The sound of rain *causes* a drop in cortisol, improving sleep."
          </p>
          <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-500">
              Our Goal: Separate the noise from the signal using Gemini 3 Pro's reasoning capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Call to Action */}
      <div className="bg-teal-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to find your drivers?</h2>
        <p className="text-teal-100 mb-6 max-w-xl mx-auto">
          The more data you log, the more precise our "diagnosis" becomes. Start your journey to evidence-based self-improvement.
        </p>
        <button className="bg-white text-teal-700 font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 hover:bg-teal-50 transition-colors">
          Go to Daily Log <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};