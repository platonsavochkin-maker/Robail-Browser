import React, { useState } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Send,
  Image,
} from 'lucide-react';

interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  verified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked?: boolean;
}

const INITIAL_TWEETS: Tweet[] = [
  {
    id: 't1',
    author: 'Sam Altman',
    handle: '@sama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    verified: true,
    content: 'The compute curve continues to steepen. We are entering an extraordinary era of artificial cognition and agentic reasoning.',
    timestamp: '2h',
    likes: 18400,
    retweets: 2400,
    replies: 890,
  },
  {
    id: 't2',
    author: 'NASA JPL',
    handle: '@NASAJPL',
    avatar: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=100&h=100&fit=crop',
    verified: true,
    content: 'Europa Clipper has executed its primary trajectory correction maneuver on schedule! All systems nominal as we journey to Jupiter’s icy ocean moon. 🚀🌌',
    timestamp: '4h',
    likes: 31200,
    retweets: 4800,
    replies: 420,
  },
  {
    id: 't3',
    author: 'Linus Torvalds',
    handle: '@LinusTorvalds',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    verified: true,
    content: 'Linux 6.14-rc7 released. Clean diffs, no drama, good regression fixes. Keep testing before the official release.',
    timestamp: '8h',
    likes: 14200,
    retweets: 1800,
    replies: 230,
  },
];

export const TwitterXView: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>(INITIAL_TWEETS);
  const [composerText, setComposerText] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    const newTweet: Tweet = {
      id: 'tweet-' + Date.now(),
      author: 'Robail Explorer',
      handle: '@robail_user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      verified: true,
      content: composerText.trim(),
      timestamp: 'Just now',
      likes: 1,
      retweets: 0,
      replies: 0,
    };
    setTweets([newTweet, ...tweets]);
    setComposerText('');
  };

  const handleToggleLike = (id: string) => {
    setTweets(
      tweets.map((t) => {
        if (t.id === id) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            likes: isLiked ? t.likes + 1 : t.likes - 1,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-black text-white select-none font-sans">
      <div className="max-w-2xl mx-auto border-x border-neutral-800 min-h-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">𝕏</span>
            <span className="text-sm font-bold text-neutral-200">Home Feed</span>
          </div>
          <Sparkles className="w-4 h-4 text-sky-400" />
        </header>

        {/* Composer */}
        <form onSubmit={handlePost} className="p-4 border-b border-neutral-800 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
            R
          </div>
          <div className="flex-1">
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="What is happening?!"
              rows={2}
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none resize-none select-text"
            />
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-sky-400">
                <button type="button" className="p-1 hover:bg-sky-500/10 rounded-full">
                  <Image className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!composerText.trim()}
                className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 disabled:opacity-40 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </form>

        {/* Feed */}
        <div className="divide-y divide-neutral-800">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-3">
              <img
                src={tweet.avatar}
                alt={tweet.author}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-neutral-800"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-sm text-white">{tweet.author}</span>
                  {tweet.verified && <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
                  <span className="text-xs text-neutral-500">{tweet.handle}</span>
                  <span className="text-xs text-neutral-500">·</span>
                  <span className="text-xs text-neutral-500">{tweet.timestamp}</span>
                </div>

                <p className="text-sm text-neutral-200 leading-normal select-text whitespace-pre-wrap">
                  {tweet.content}
                </p>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between max-w-md mt-3 text-xs text-neutral-500">
                  <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{tweet.replies}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                    <Repeat2 className="w-4 h-4" />
                    <span>{tweet.retweets}</span>
                  </button>
                  <button
                    onClick={() => handleToggleLike(tweet.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      tweet.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${tweet.isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{tweet.likes.toLocaleString()}</span>
                  </button>
                  <button className="hover:text-sky-400 transition-colors">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
