import React from 'react';
import { LayoutDashboard, Activity, BrainCircuit, MessageSquareText, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log', icon: Activity },
    { id: 'causal', label: 'Causal', icon: BrainCircuit },
    { id: 'simulator', label: 'Sim', icon: MessageSquareText },
    { id: 'methodology', label: 'Why?', icon: BookOpen },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <div className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 font-bold text-xl tracking-tight text-teal-400">
          <BrainCircuit size={28} />
          <span>Habit<span className="text-white">Coach</span></span>
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
              <span className="font-medium">{item.label === 'Sim' ? 'Simulator' : item.label === 'Why?' ? 'Methodology' : item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center font-bold text-white">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-slate-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV (Hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 flex-1
                ${currentView === item.id 
                  ? 'text-teal-600' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <div className={`p-1 rounded-full ${currentView === item.id ? 'bg-teal-50' : ''}`}>
                <item.icon size={22} className={currentView === item.id ? 'stroke-2' : 'stroke-[1.5]'} />
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};