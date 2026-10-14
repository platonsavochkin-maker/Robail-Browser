import React from 'react';
import { Bookmark as BookmarkType } from '../types/browser';
import {
  Sparkles,
  Terminal,
  Gamepad2,
  BookOpen,
  Newspaper,
  FileText,
  Globe,
  Plus,
  Play,
  Github,
  MapPin,
  ShoppingBag,
} from 'lucide-react';

interface BookmarksBarProps {
  bookmarks: BookmarkType[];
  onNavigate: (url: string) => void;
  onAddBookmark: () => void;
}

export const BookmarksBar: React.FC<BookmarksBarProps> = ({
  bookmarks,
  onNavigate,
  onAddBookmark,
}) => {
  const getBookmarkIcon = (url: string) => {
    const l = url.toLowerCase();
    if (l.includes('youtube')) return <Play className="w-3 h-3 text-red-500 fill-red-500" />;
    if (l.includes('github')) return <Github className="w-3 h-3 text-white" />;
    if (l.includes('reddit')) return <span className="text-[10px] font-black text-[#ff4500]">r/</span>;
    if (l.includes('x.com') || l.includes('twitter')) return <span className="text-[10px] font-black text-white">𝕏</span>;
    if (l.includes('maps')) return <MapPin className="w-3 h-3 text-emerald-400" />;
    if (l.includes('amazon') || l.includes('store')) return <ShoppingBag className="w-3 h-3 text-amber-400" />;
    if (l.includes('wikipedia')) return <BookOpen className="w-3 h-3 text-indigo-400" />;
    if (l.includes('hn')) return <Newspaper className="w-3 h-3 text-orange-400" />;
    if (l.includes('devlab')) return <Terminal className="w-3 h-3 text-emerald-400" />;
    if (l.includes('arcade')) return <Gamepad2 className="w-3 h-3 text-purple-400" />;
    if (l.includes('notes')) return <FileText className="w-3 h-3 text-pink-400" />;
    return <Globe className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div className="h-7 bg-slate-950/90 border-b border-slate-800/60 px-3 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs select-none">
      {bookmarks.map((bm) => (
        <button
          key={bm.id}
          onClick={() => onNavigate(bm.url)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors flex-shrink-0"
        >
          {getBookmarkIcon(bm.url)}
          <span className="truncate max-w-[120px]">{bm.title}</span>
        </button>
      ))}

      <button
        onClick={onAddBookmark}
        title="Add current tab to bookmarks"
        className="p-1 rounded text-slate-500 hover:text-sky-400 hover:bg-slate-800/60 transition-colors ml-1"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
