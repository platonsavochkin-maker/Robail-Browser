import React, { useState, useEffect } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  selftext?: string;
  thumbnail?: string;
}

export const RedditView: React.FC = () => {
  const [sub, setSub] = useState('technology');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const subreddits = ['technology', 'science', 'programming', 'space', 'gaming', 'worldnews'];

  const fetchReddit = async (subreddit: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=15`);
      const data = await res.json();
      if (data.data?.children) {
        const fetched = data.data.children.map((c: any) => ({
          id: c.data.id,
          title: c.data.title,
          author: c.data.author,
          subreddit: c.data.subreddit,
          score: c.data.score,
          num_comments: c.data.num_comments,
          created_utc: c.data.created_utc,
          url: c.data.url,
          selftext: c.data.selftext,
          thumbnail: c.data.thumbnail?.startsWith('http') ? c.data.thumbnail : undefined,
        }));
        setPosts(fetched);
      }
    } catch {
      // Fallback sample posts
      setPosts([
        {
          id: 'p1',
          title: 'Quantum computing researchers demonstrate fault-tolerant logical qubits at room temperature',
          author: 'quantum_dev',
          subreddit,
          score: 4120,
          num_comments: 312,
          created_utc: Date.now() / 1000 - 7200,
          url: 'https://reddit.com',
          selftext: 'Breakthrough experimental findings published in Nature show massive coherence improvements.',
        },
        {
          id: 'p2',
          title: 'WebAssembly 3.0 draft adds native multi-threading and direct GPU compute bindings',
          author: 'wasm_core',
          subreddit,
          score: 2890,
          num_comments: 184,
          created_utc: Date.now() / 1000 - 14400,
          url: 'https://reddit.com',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReddit(sub);
  }, [sub]);

  const handleVote = (id: string, delta: number) => {
    setUserVotes((prev) => {
      const curr = prev[id] || 0;
      if (curr === delta) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: delta };
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#030303] text-[#d7dadc] select-none font-sans">
      {/* Reddit Header */}
      <header className="sticky top-0 z-30 bg-[#1a1a1b] border-b border-[#343536] px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ff4500] flex items-center justify-center font-black text-white text-base">
            r/
          </div>
          <span className="font-bold text-white text-base tracking-tight">reddit</span>
        </div>

        {/* Subreddit Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {subreddits.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                sub === s
                  ? 'bg-[#d7dadc] text-black'
                  : 'bg-[#272729] text-[#d7dadc] hover:bg-[#343536]'
              }`}
            >
              r/{s}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchReddit(sub)}
          className="p-1.5 rounded-full hover:bg-[#343536] text-[#818384] hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#ff4500]' : ''}`} />
        </button>
      </header>

      {/* Main Feed */}
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#343536] text-xs text-[#818384]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff4500]" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Hot Posts in r/{sub}
            </span>
          </div>
          <span>Updated Live</span>
        </div>

        {posts.map((post) => {
          const vote = userVotes[post.id] || 0;
          const displayScore = post.score + vote;

          return (
            <div
              key={post.id}
              className="rounded-xl bg-[#1a1a1b] border border-[#343536] hover:border-[#818384] transition-all flex overflow-hidden"
            >
              {/* Upvote Column */}
              <div className="w-12 bg-[#151516] flex flex-col items-center py-3 flex-shrink-0">
                <button
                  onClick={() => handleVote(post.id, 1)}
                  className={`p-1 rounded hover:bg-[#272729] transition-colors ${
                    vote === 1 ? 'text-[#ff4500]' : 'text-[#818384] hover:text-[#ff4500]'
                  }`}
                >
                  <ArrowBigUp className="w-5 h-5" />
                </button>
                <span
                  className={`text-xs font-bold font-mono my-0.5 ${
                    vote === 1
                      ? 'text-[#ff4500]'
                      : vote === -1
                      ? 'text-[#7193ff]'
                      : 'text-[#d7dadc]'
                  }`}
                >
                  {displayScore}
                </span>
                <button
                  onClick={() => handleVote(post.id, -1)}
                  className={`p-1 rounded hover:bg-[#272729] transition-colors ${
                    vote === -1 ? 'text-[#7193ff]' : 'text-[#818384] hover:text-[#7193ff]'
                  }`}
                >
                  <ArrowBigDown className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="p-3.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-[#818384] mb-1.5">
                  <span className="font-bold text-white hover:underline">r/{post.subreddit}</span>
                  <span>•</span>
                  <span>Posted by u/{post.author}</span>
                </div>

                <h2 className="text-sm font-semibold text-[#d7dadc] leading-snug select-text hover:text-white">
                  {post.title}
                </h2>

                {post.selftext && (
                  <p className="text-xs text-[#818384] line-clamp-3 mt-2 leading-relaxed select-text">
                    {post.selftext}
                  </p>
                )}

                {post.thumbnail && (
                  <div className="mt-3 rounded-lg overflow-hidden max-h-60 bg-black">
                    <img src={post.thumbnail} alt="" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#343536]/40 text-xs text-[#818384]">
                  <div className="flex items-center gap-1.5 hover:text-white">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.num_comments} Comments</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </div>
                  {post.url && !post.url.includes('reddit.com') && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[#ff4500] hover:underline ml-auto"
                    >
                      <span className="truncate max-w-[150px] font-mono text-[10px]">{post.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
