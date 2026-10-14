import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, MessageSquare, ThumbsUp, Clock, Globe } from 'lucide-react';

interface HackerNewsViewProps {
  onNavigate: (url: string) => void;
}

export const HackerNewsView: React.FC<HackerNewsViewProps> = ({ onNavigate }) => {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<'top' | 'new'>('top');

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hn');
      const data = await res.json();
      setStories(data.stories || []);
    } catch {
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [category]);

  const timeAgo = (time: number) => {
    const seconds = Math.floor(Date.now() / 1000 - time);
    const hours = Math.floor(seconds / 3600);
    if (hours < 1) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 select-none">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Hacker News Tech Feed</h2>
              <p className="text-xs text-slate-400">Real-time Hacker News Front Page</p>
            </div>
          </div>

          <button
            onClick={fetchStories}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Stories List */}
        <div className="space-y-2.5">
          {isLoading && stories.length === 0 ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            stories.map((story, idx) => (
              <div
                key={story.id || idx}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all group flex items-start gap-3"
              >
                <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0">
                  <ThumbsUp className="w-3.5 h-3.5 text-orange-400 mb-0.5" />
                  <span className="text-xs font-mono font-bold text-slate-200">{story.score || 0}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => onNavigate(story.url || `https://news.ycombinator.com/item?id=${story.id}`)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-orange-400 group-hover:underline leading-snug line-clamp-2">
                      {story.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span>by {story.by}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {timeAgo(story.time)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      {story.descendants || 0} comments
                    </span>
                    {story.url && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[140px] font-mono text-slate-500">
                          {new URL(story.url).hostname}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {story.url && (
                  <button
                    onClick={() => onNavigate(story.url)}
                    title="Open Article in Tab"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0 mt-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
