import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Globe,
  Share2,
} from 'lucide-react';

interface WikipediaViewProps {
  initialTopic?: string;
  onNavigate: (url: string) => void;
}

export const WikipediaView: React.FC<WikipediaViewProps> = ({
  initialTopic = 'Web browser',
  onNavigate,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [searchInput, setSearchInput] = useState(initialTopic);
  const [article, setArticle] = useState<{
    title: string;
    extract: string;
    thumbnail?: { source: string };
    content_urls?: { desktop: { page: string } };
    description?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async (articleTitle: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sanitized = encodeURIComponent(articleTitle.trim().replace(/ /g, '_'));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${sanitized}`);
      if (!res.ok) throw new Error('Article not found');
      const data = await res.json();
      setArticle(data);
      setTopic(data.title || articleTitle);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch Wikipedia article');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle(initialTopic);
  }, [initialTopic]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchArticle(searchInput.trim());
    }
  };

  const sampleTopics = [
    'Web browser',
    'Artificial intelligence',
    'World Wide Web',
    'Quantum computing',
    'Linux',
    'Alan Turing',
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 select-none">
      <div className="max-w-3xl mx-auto">
        {/* Header & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Wikipedia Explorer</h2>
              <p className="text-xs text-slate-400">Free Open Encyclopedia Reader</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 focus-within:border-indigo-400">
            <div className="pl-3 pr-1 text-slate-400">
              <Search className="w-4 h-4 text-indigo-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Wikipedia articles..."
              className="flex-1 bg-transparent py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none select-text"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center gap-1"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Explore</span>}
            </button>
          </div>

          {/* Quick topic buttons */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-slate-500 mr-1 flex-shrink-0">Popular:</span>
            {sampleTopics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSearchInput(t);
                  fetchArticle(t);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors flex-shrink-0"
              >
                {t}
              </button>
            ))}
          </div>
        </form>

        {/* Content Area */}
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="h-8 bg-slate-800 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
            <div className="h-40 bg-slate-800/60 rounded-xl animate-pulse w-full" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-slate-900 border border-red-500/20 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={() => fetchArticle('Web browser')}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
            >
              Load Default Article
            </button>
          </div>
        ) : article ? (
          <article className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1 select-text">
                  {article.title}
                </h1>
                {article.description && (
                  <p className="text-xs text-indigo-400 font-medium">{article.description}</p>
                )}
              </div>
              {article.content_urls?.desktop?.page && (
                <button
                  onClick={() => onNavigate(article.content_urls!.desktop.page)}
                  title="Open in full browser tab"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>

            {article.thumbnail?.source && (
              <div className="mb-6 rounded-xl overflow-hidden max-h-72 bg-slate-950 flex items-center justify-center border border-slate-800">
                <img
                  src={article.thumbnail.source}
                  alt={article.title}
                  className="max-h-72 w-auto object-contain"
                />
              </div>
            )}

            <div className="text-sm md:text-base text-slate-300 leading-relaxed font-sans space-y-4 select-text">
              <p>{article.extract}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Source: Wikipedia, The Free Encyclopedia</span>
              {article.content_urls?.desktop?.page && (
                <button
                  onClick={() => onNavigate(article.content_urls!.desktop.page)}
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Read full Wikipedia page</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};
