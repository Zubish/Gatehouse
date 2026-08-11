import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, ShieldCheck, Key, RefreshCw, Sparkles, FileSpreadsheet, QrCode, Trash2 } from 'lucide-react';
import { useGatehouse } from '../../context/GatehouseContext';
import { askMusaAI } from '../../lib/musaAiEngine';

interface Message {
  id: string;
  sender: 'user' | 'musa';
  text: string;
  timestamp: string;
}

export const MusaAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeEvent, currentUser, guests } = useGatehouse();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkedInCount = guests ? guests.filter((g) => g.status === 'in').length : 0;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'musa',
      text: `Hello ${currentUser?.name || 'there'}! 👋 I am **Musa**, your AI Assistant powered by **Gemini AI** for **${
        activeEvent?.name || 'Gatehouse Event'
      }**.\n\nAsk me any question — about gate security, pass recovery, logistics, or general event operations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
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
    setIsTyping(true);

    try {
      const responseText = await askMusaAI(query, {
        activeEvent,
        currentUser,
        guestsCount: guests?.length || 0,
        checkedInCount,
      });

      const musaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'musa',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, musaMsg]);
    } catch (err) {
      console.error('Musa chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'musa',
        text: `Chat cleared! How can I assist you with **${activeEvent?.name || 'Gatehouse'}** today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to format response text with bolding and bullet points cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Process bold syntax **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <React.Fragment key={idx}>
          {formattedLine}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950/98 backdrop-blur-2xl border-l border-slate-800/80 shadow-2xl flex flex-col font-sans text-white transition-all animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                Musa AI Assistant <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="truncate max-w-[180px] font-mono text-[10px] text-emerald-400 font-semibold">
                {activeEvent?.name || 'Active Session'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-3 border-b border-slate-800/60 bg-slate-950/60 flex items-center space-x-2 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() => handleSend('How many guests checked in?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 whitespace-nowrap transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          <span>Live Check-In Stats</span>
        </button>
        <button
          onClick={() => handleSend('How to recover lost pass?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 whitespace-nowrap transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <Key className="w-3 h-3 text-emerald-400" />
          <span>Pass Recovery</span>
        </button>
        <button
          onClick={() => handleSend('How do I import Excel guest lists?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 whitespace-nowrap transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <FileSpreadsheet className="w-3 h-3 text-blue-400" />
          <span>Excel Import</span>
        </button>
        <button
          onClick={() => handleSend('How does gate scanning work?')}
          className="px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-purple-500/50 hover:text-purple-300 whitespace-nowrap transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <QrCode className="w-3 h-3 text-purple-400" />
          <span>Gate Scanner</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20 font-sans'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {renderFormattedText(msg.text)}
              <div
                className={`text-[9px] mt-2 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/90 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Musa AI is reasoning...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask Musa anything about Gatehouse..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
