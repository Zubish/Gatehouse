import React, { useState } from 'react';
import { Bot, Send, X, ShieldCheck, Key } from 'lucide-react';
import { useGatehouse } from '../../context/GatehouseContext';

interface Message {
  id: string;
  sender: 'user' | 'musa';
  text: string;
  timestamp: string;
}

export const MusaAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeEvent } = useGatehouse();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'musa',
      text: `Hello! I am Musa, your Gatehouse AI Security & Access Assistant for ${activeEvent.name}. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Musa AI Response Logic based on Gatehouse Blueprints
    setTimeout(() => {
      let responseText = '';
      const q = query.toLowerCase();

      if (q.includes('pass') || q.includes('recover') || q.includes('code') || q.includes('lost')) {
        responseText = `To recover your pass, visit the "My Passes" section or type your email in the search bar. Every pass is secured with an HMAC-SHA256 token signed by the Gatehouse server.`;
      } else if (q.includes('gate') || q.includes('scan') || q.includes('turnstile') || q.includes('entry')) {
        responseText = `Gate access is operating in real-time mode. Simply present your digital QR code at Turnstile 01. Anti-passback prevents duplicate pass re-use.`;
      } else if (q.includes('venue') || q.includes('location') || q.includes('address') || q.includes('directions')) {
        responseText = `The event "${activeEvent.name}" is scheduled at Eko Convention Center, Victoria Island, Lagos. Gates open at ${activeEvent.startTime}.`;
      } else if (q.includes('admin') || q.includes('security') || q.includes('role')) {
        responseText = `Gatehouse enforces strict RBAC (Role-Based Access Control) with immutable audit logs for all check-in transactions.`;
      } else {
        responseText = `I have logged your request. For immediate gate access or pass verification, present your QR pass at the entrance or contact event support.`;
      }

      const musaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'musa',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, musaMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col font-sans text-white">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white">Musa AI Assistant</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Gatehouse Event & Security Operations</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
        <button
          onClick={() => handleSend('How do I scan my pass at the gate?')}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 whitespace-nowrap transition-all flex items-center space-x-1"
        >
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          <span>Gate Scan Info</span>
        </button>
        <button
          onClick={() => handleSend('How do I recover my lost pass?')}
          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 whitespace-nowrap transition-all flex items-center space-x-1"
        >
          <Key className="w-3 h-3 text-emerald-400" />
          <span>Pass Recovery</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {msg.text}
              <div
                className={`text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask Musa about gate access, passes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
