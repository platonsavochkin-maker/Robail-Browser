import React, { useState } from 'react';
import { Search, ArrowRight, Globe } from 'lucide-react';

interface StartPageProps {
  onNavigate: (url: string) => void;
  theme?: 'dark' | 'light';
}

export const StartPage: React.FC<StartPageProps> = ({ onNavigate, theme = 'dark' }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onNavigate(query.trim());
  };

  const quickSites = [
    { title: 'YouTube', url: 'https://www.youtube.com' },
    { title: 'Steam', url: 'https://store.steampowered.com' },
    { title: 'Википедия', url: 'https://ru.wikipedia.org' },
    { title: 'DuckDuckGo', url: 'https://duckduckgo.com' },
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'Reddit', url: 'https://www.reddit.com' },
  ];

  const isLight = theme === 'light';

  return (
    <div
      className={`flex-1 h-full flex flex-col items-center justify-center p-6 select-none transition-colors ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
      }`}
    >
      <div className="w-full max-w-xl flex flex-col items-center -mt-16">
        {/* Large Browser Name */}
        <h1
          className={`text-5xl md:text-6xl font-black tracking-widest mb-8 transition-colors ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          ROBAIL
        </h1>

        {/* Pure Central Search & Address Box */}
        <form onSubmit={handleSearchSubmit} className="w-full mb-6">
          <div
            className={`flex items-center rounded-2xl border shadow-xl transition-all p-1.5 ${
              isLight
                ? 'bg-white border-slate-300 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20'
                : 'bg-slate-900 border-slate-750 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20'
            }`}
          >
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-4 h-4 text-amber-500" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите веб-адрес или поисковый запрос (например, wikipedia.org)..."
              className={`flex-1 bg-transparent py-2 text-sm outline-none select-text ${
                isLight ? 'text-slate-900 placeholder-slate-400' : 'text-slate-100 placeholder-slate-500'
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <span>Перейти</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Clean Quick Shortcuts (Just real sites, no clutter) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {quickSites.map((site) => (
            <button
              key={site.url}
              onClick={() => onNavigate(site.url)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3 text-amber-500" />
              <span>{site.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
