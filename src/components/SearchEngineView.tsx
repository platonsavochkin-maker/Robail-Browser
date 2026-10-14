import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Globe,
  Share2,
} from 'lucide-react';

interface SearchEngineViewProps {
  initialQuery: string;
  onNavigate: (url: string) => void;
}

export const SearchEngineView: React.FC<SearchEngineViewProps> = ({
  initialQuery,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'wiki'>('all');
  const [results, setResults] = useState<Array<{ title: string; snippet: string; url: string; source?: string }>>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setIsAiLoading(true);

    try {
      // 1. Fetch structured web results
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([
        {
          title: `${searchQuery} - Live Web Search`,
          snippet: `Browse comprehensive search index results for "${searchQuery}" on the open web.`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
          source: 'Web',
        },
      ]);
    } finally {
      setIsLoading(false);
    }

    // 2. Fetch Robail Gemini AI synthesis
    try {
      const aiRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Provide an intelligent, crisp, and structured overview for the search query: "${searchQuery}".
Include:
1. Direct concise answer / explanation
2. Key points or facts
3. Practical context or next steps
Keep formatting clean and easy to read.`,
        }),
      });
      const aiData = await aiRes.json();
      setAiSummary(aiData.text || 'Overview generated.');
    } catch {
      setAiSummary(`Comprehensive summary for "${searchQuery}": Explore the referenced articles and links below for detailed background.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 shadow-md">
            <div className="pl-3 pr-1 text-sky-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or ask Robail AI..."
              className="flex-1 bg-transparent py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none select-text"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs flex items-center gap-1 transition-all"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
            </button>
          </div>
        </form>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'ai'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>AI Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('wiki')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'wiki'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3 text-indigo-400" />
            <span>Encyclopedia</span>
          </button>
        </div>

        {/* AI Synthesis Card */}
        {(activeTab === 'all' || activeTab === 'ai') && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-900 to-indigo-950/30 border border-sky-500/20 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-sky-300">Robail AI Smart Overview</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
            </div>

            {isAiLoading ? (
              <div className="space-y-2 py-4">
                <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
                <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line select-text font-normal">
                {aiSummary}
              </div>
            )}
          </div>
        )}

        {/* Structured Web Results */}
        {(activeTab === 'all' || activeTab === 'wiki') && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Web Results & Sources
            </h4>

            {results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(item.url)}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                  <Globe className="w-3 h-3 text-sky-400" />
                  <span className="font-mono truncate">{item.url}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-sky-400">{item.source || 'Web'}</span>
                </div>
                <h3 className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 group-hover:underline flex items-center gap-1.5">
                  <span>{item.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2 select-text">
                  {item.snippet}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
