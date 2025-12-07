import React, { useState, useRef, useEffect } from 'react';
import { DailyLog, SimulationMessage } from '../types';
import { runCounterfactualSimulation } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface SimulatorProps {
  logs: DailyLog[];
}

export const Simulator: React.FC<SimulatorProps> = ({ logs }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<SimulationMessage[]>([
    { role: 'model', text: "I'm your Counterfactual Simulator. Ask me 'What if' questions based on your history. e.g., 'What if I stopped drinking coffee after 2 PM?'" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg: SimulationMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await runCounterfactualSimulation(logs, userMsg.text, history);
      
      const botMsg: SimulationMessage = { role: 'model', text: responseText || "I couldn't simulate that scenario." };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to the simulation engine. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "What if I cut caffeine after 2 PM?",
    "Does working out in the morning improve my sleep?",
    "What if I increase screen time by 1 hour?",
  ];

  // Helper to parse Markdown bold syntax
  const formatMessageText = (text: string) => {
    // 1. Split by lines to handle paragraphs (basic)
    const paragraphs = text.split('\n').filter(line => line.trim() !== '');
    
    return paragraphs.map((paragraph, pIdx) => {
      // 2. Parse bold (**text**)
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={pIdx} className="mb-2 last:mb-0">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    // Height calculation optimized for mobile (100dvh - header/nav space)
    <div className="flex flex-col h-[calc(100dvh-11rem)] md:h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-3 md:p-5 flex justify-between items-center z-10 shadow-sm shrink-0">
        <div>
          <h2 className="text-base md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-purple-500" size={18} />
            Simulator
          </h2>
          <p className="text-[10px] md:text-sm text-slate-500">Simulate outcomes based on your causal model.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-purple-100 text-purple-600'}`}>
              {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              {formatMessageText(msg.text)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-200 p-3 md:p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-100 shrink-0">
        {messages.length < 3 && (
           <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
             {suggestions.map((s, i) => (
               <button 
                key={i} 
                onClick={() => setQuery(s)}
                className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors flex-shrink-0 border border-slate-200"
               >
                 {s}
               </button>
             ))}
           </div>
        )}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a 'What If' question..."
            className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl py-3 md:py-4 pl-4 md:pl-6 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border border-slate-200"
          />
          <button 
            type="submit" 
            disabled={!query.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};