import React from 'react';
import { LayoutDashboard, Activity, BrainCircuit, MessageSquareText, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Daily Log', icon: Activity },
    { id: 'causal', label: 'Causal Engine', icon: BrainCircuit },
    { id: 'simulator', label: 'Simulator', icon: MessageSquareText },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 font-bold text-xl tracking-tight text-teal-400">
        <BrainCircuit size={28} />
        <span className="hidden md:block">Habit<span className="text-white">Coach</span></span>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} />
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center font-bold text-white">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
        {/* Mobile profile fallback */}
        <div className="md:hidden flex justify-center">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
            JD
          </div>
        </div>
      </div>
    </div>
  );
};