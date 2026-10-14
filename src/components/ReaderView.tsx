import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Clock,
  User,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ReaderArticle } from '../types/browser';

interface ReaderViewProps {
  url: string;
  onExit: () => void;
  onOpenExternal: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ url, onExit, onOpenExternal }) => {
  const [article, setArticle] = useState<ReaderArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/reader?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
      })
      .catch(() => {
        setArticle({
          title: 'Article Reader',
          author: new URL(url).hostname,
          readMinutes: 3,
          wordCount: 450,
          url,
          blocks: [
            {
              type: 'paragraph',
              text: 'Could not automatically parse the full article content. You can continue reading in normal web view mode.',
            },
          ],
        });
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [url]);

  const handleToggleSpeech = () => {
    if (!window.speechSynthesis || !article) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const fullText = article.blocks
      .filter((b: any) => b.type === 'paragraph' || b.type === 'heading')
      .map((b: any) => b.text)
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(article.title + '. ' + fullText);
    utterance.rate = 1.0;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const getContainerStyles = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#433422]';
      case 'light':
        return 'bg-[#fafafa] text-[#1a1a1a]';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-200';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      case 'serif':
      default: return 'font-serif';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'lg': return 'text-lg leading-loose';
      case 'xl': return 'text-xl leading-loose';
      case 'base':
      default: return 'text-base leading-relaxed';
    }
  };

  return (
    <div className={`flex-1 h-full overflow-y-auto select-none transition-colors ${getContainerStyles()}`}>
      {/* Top Reader Controls Bar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-inherit/90 border-b border-black/10 dark:border-white/10 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            ← Exit Reader
          </button>
          <span className="text-xs opacity-60 truncate max-w-xs">{new URL(url).hostname}</span>
        </div>

        {/* Reader Customization */}
        <div className="flex items-center gap-2">
          {/* Text-to-Speech Audio */}
          <button
            onClick={handleToggleSpeech}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-colors"
          >
            {isSpeaking && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Font Family */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5 text-xs">
            {(['serif', 'sans', 'mono'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFontFamily(f)}
                className={`px-2 py-0.5 rounded capitalize ${
                  fontFamily === f ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Font Size */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5 text-xs">
            {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`px-2 py-0.5 rounded uppercase text-[10px] ${
                  fontSize === s ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Theme */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-lg p-0.5 text-xs">
            {(['dark', 'sepia', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2 py-0.5 rounded capitalize ${
                  theme === t ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'opacity-60'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reader Content Area */}
      <div className="max-w-2xl mx-auto py-12 px-6">
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="h-10 bg-black/10 dark:bg-white/10 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse w-1/3" />
            <div className="h-48 bg-black/10 dark:bg-white/10 rounded-xl animate-pulse" />
          </div>
        ) : article ? (
          <article className={getFontFamilyClass()}>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 select-text">
                {article.title}
              </h1>
              <div className="flex items-center gap-3 text-xs opacity-70">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{article.author}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readMinutes} min read</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{article.wordCount} words</span>
              </div>
            </header>

            {article.leadImage && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={article.leadImage}
                  alt={article.title}
                  className="w-full h-auto object-cover max-h-96"
                />
              </div>
            )}

            <div className={`space-y-6 select-text ${getFontSizeClass()}`}>
              {article.blocks.map((block: any, idx: number) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={idx} className="text-xl md:text-2xl font-bold mt-8 mb-3">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'image' && block.src) {
                  return (
                    <div key={idx} className="my-6 rounded-xl overflow-hidden">
                      <img src={block.src} alt={block.alt || ''} className="w-full h-auto" />
                    </div>
                  );
                }
                return <p key={idx}>{block.text}</p>;
              })}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};
