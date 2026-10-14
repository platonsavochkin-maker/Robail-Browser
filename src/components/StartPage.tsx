import React, { useState } from 'react';
import { Search, ArrowRight, Globe } from 'lucide-react';

interface StartPageProps {
  onNavigate: (url: string) => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onNavigate }) => {
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

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-950 p-6 select-none">
      <div className="w-full max-w-xl flex flex-col items-center -mt-16">
        {/* Large Browser Name */}
        <h1 className="text-5xl md:text-6xl font-black tracking-widest text-white mb-8">
          ROBAIL
        </h1>

        {/* Pure Central Search & Address Box */}
        <form onSubmit={handleSearchSubmit} className="w-full mb-6">
          <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-750 shadow-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all p-1.5">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите веб-адрес или поисковый запрос (например, wikipedia.org)..."
              className="flex-1 bg-transparent py-2 text-sm text-slate-100 placeholder-slate-500 outline-none select-text"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 shadow-md transition-all"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{site.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
