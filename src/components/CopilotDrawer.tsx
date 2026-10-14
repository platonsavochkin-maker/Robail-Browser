import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  Bot,
  User,
  ExternalLink,
  BookOpen,
  Languages,
  ListChecks,
} from 'lucide-react';
import { Tab } from '../types/browser';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am Robail Copilot, your intelligent browser assistant. I can summarize pages, translate content, explain concepts, or research any topic on the web for you. How can I assist you right now?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptToSend.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend.trim(),
          pageTitle: activeTab.title,
          pageUrl: activeTab.url,
          pageContent: activeTab.readerData?.rawSnippet || '',
        }),
      });

      const data = await res.json();
      const replyText = data.text || data.fallbackText || 'I am ready to help with your browser queries.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: replyText,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: 'Unable to connect to Robail AI service. Please verify your connection.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you next?',
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-30 shadow-2xl select-none">
      {/* Copilot Header */}
      <div className="h-11 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
            <Sparkles className="w-4 h-4 animate-pulse-subtle" />
          </div>
          <span className="font-bold text-xs text-white">Robail Copilot</span>
          <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded font-mono">
            Gemini 3.8
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Reset Chat"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Page Context Chip */}
      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[200px]">Tab: {activeTab.title}</span>
        <span className="text-slate-500 font-mono text-[10px]">{activeTab.mode}</span>
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSend(`Summarize this page: "${activeTab.title}" at ${activeTab.url}`)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-sky-300 font-medium whitespace-nowrap transition-colors"
        >
          <BookOpen className="w-3 h-3 text-sky-400" />
          <span>Summarize Page</span>
        </button>
        <button
          onClick={() => handleSend(`Explain the key concepts of "${activeTab.title}" simply`)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-purple-300 font-medium whitespace-nowrap transition-colors"
        >
          <ListChecks className="w-3 h-3 text-purple-400" />
          <span>Key Points</span>
        </button>
        <button
          onClick={() => handleSend(`Переведи суть этой страницы на русский язык: ${activeTab.title}`)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-emerald-300 font-medium whitespace-nowrap transition-colors"
        >
          <Languages className="w-3 h-3 text-emerald-400" />
          <span>На русский</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed select-text ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-[10px] text-slate-500">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            <span>Robail AI is formulating answer...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/60"
      >
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-sky-400">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Robail AI anything..."
            className="flex-1 bg-transparent px-2 text-xs text-slate-100 placeholder-slate-500 outline-none select-text"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-sky-500 text-white disabled:opacity-40 hover:bg-sky-400 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
