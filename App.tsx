import React, { useState, useEffect } from 'react';
import { DailyLog } from './types';
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

  // Initialize with mock data to show immediate value
  useEffect(() => {
    const existing = localStorage.getItem('habit_logs');
    if (existing) {
      setLogs(JSON.parse(existing));
    } else {
      const initialData = generateMockData();
      setLogs(initialData);
      localStorage.setItem('habit_logs', JSON.stringify(initialData));
    }
  }, []);

  const handleAddLog = (newLog: DailyLog) => {
    const updated = [...logs, newLog];
    setLogs(updated);
    localStorage.setItem('habit_logs', JSON.stringify(updated));
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard logs={logs} />;
      case 'log': return <DailyLogView onAddLog={handleAddLog} />;
      case 'causal': return <CausalEngine logs={logs} />;
      case 'simulator': return <Simulator logs={logs} />;
      case 'methodology': return <Methodology />;
      default: return <Dashboard logs={logs} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 transition-all">
        {/* Mobile Header Spacer */}
        <div className="md:hidden h-16"></div> 
        
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;