import React, { useState, useEffect } from 'react';
import { DailyLog, HabitIntervention } from './types';
import { generateMockData } from './utils/mockData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { DailyLogView } from './views/DailyLogView';
import { CausalEngine } from './views/CausalEngine';
import { Simulator } from './views/Simulator';
import { Methodology } from './views/Methodology';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [interventions, setInterventions] = useState<HabitIntervention[]>([]);

  // Initialize with mock data to show immediate value
  useEffect(() => {
    const existingLogs = localStorage.getItem('habit_logs');
    if (existingLogs) {
      setLogs(JSON.parse(existingLogs));
    } else {
      const initialData = generateMockData();
      setLogs(initialData);
      localStorage.setItem('habit_logs', JSON.stringify(initialData));
    }

    const existingInterventions = localStorage.getItem('habit_interventions');
    if (existingInterventions) {
      setInterventions(JSON.parse(existingInterventions));
    }
  }, []);

  const handleAddLog = (newLog: DailyLog) => {
    const updated = [...logs, newLog];
    setLogs(updated);
    localStorage.setItem('habit_logs', JSON.stringify(updated));
  };

  const handleAddIntervention = (newIntervention: HabitIntervention) => {
    const updated = [...interventions, newIntervention];
    setInterventions(updated);
    localStorage.setItem('habit_interventions', JSON.stringify(updated));
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard logs={logs} />;
      case 'log': return <DailyLogView onAddLog={handleAddLog} onAddIntervention={handleAddIntervention} />;
      case 'causal': return <CausalEngine logs={logs} />;
      case 'simulator': return <Simulator logs={logs} />;
      case 'methodology': return <Methodology setView={setCurrentView} />;
      default: return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      {/* Main Content Wrapper 
          - Mobile: No left margin, padding bottom for nav bar
          - Desktop: Left margin 64 (sidebar width), normal padding
      */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 transition-all pb-24 md:pb-8">
        {/* Mobile Header: Logo/Branding for mobile since sidebar is hidden */}
        <div className="md:hidden flex items-center gap-2 mb-6 pt-2">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-teal-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.465"/><path d="M19.97 14.535A4 4 0 0 1 18 18"/></svg>
           </div>
           <span className="font-bold text-lg text-slate-900 tracking-tight">Habit Impact Coach</span>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;