import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Globe,
  Search,
  Sparkles,
  ChevronDown,
  Check,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';

interface StartPageProps {
  onNavigate: (url: string) => void;
  theme?: 'dark' | 'light';
  onOpenInstall?: () => void;
  isInstalled?: boolean;
  gamingModActive?: boolean;
  gamingColor?: string;
}

interface SpeedDialItem {
  id: string;
  title: string;
  url: string;
  type: 'twitch' | 'youtube' | 'gxgames' | 'reddit' | 'discord' | 'custom';
  customColor?: string;
}

type SearchEngineChoice = 'duckduckgo' | 'google' | 'yandex' | 'robail';

export const StartPage: React.FC<StartPageProps> = ({
  onNavigate,
  theme = 'dark',
  gamingModActive = false,
  gamingColor = '#ff003c',
}) => {
  const [query, setQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);

  // Search Engine state: Defaults to DuckDuckGo / preserved selection
  const [selectedEngine, setSelectedEngine] = useState<SearchEngineChoice>(() => {
    try {
      const saved = localStorage.getItem('robail_startpage_engine');
      if (saved === 'google' || saved === 'duckduckgo' || saved === 'yandex' || saved === 'robail') {
        return saved;
      }
    } catch {}
    return 'duckduckgo';
  });

  const handleSelectEngine = (engine: SearchEngineChoice) => {
    setSelectedEngine(engine);
    setIsEngineDropdownOpen(false);
    try {
      localStorage.setItem('robail_startpage_engine', engine);
    } catch {}
  };

  // Speed Dial items
  const [speedDialItems, setSpeedDialItems] = useState<SpeedDialItem[]>(() => {
    try {
      const saved = localStorage.getItem('rbl_gx_speed_dial_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'twitch', title: 'Twitch', url: 'https://www.twitch.tv', type: 'twitch' },
      { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com', type: 'youtube' },
      { id: 'gxgames', title: 'Игры / Arcade', url: 'robail://arcade', type: 'gxgames' },
      { id: 'reddit', title: 'Reddit', url: 'https://www.reddit.com', type: 'reddit' },
      { id: 'discord', title: 'Discord', url: 'https://discord.com/app', type: 'discord' },
    ];
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check if directly a URL or internal robail protocol
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('robail://') ||
      (trimmed.includes('.') && !trimmed.includes(' '))
    ) {
      onNavigate(trimmed);
      return;
    }

    // Otherwise navigate via selected search engine
    if (selectedEngine === 'duckduckgo') {
      onNavigate(`https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`);
    } else if (selectedEngine === 'google') {
      onNavigate(`https://www.google.com/search?q=${encodeURIComponent(trimmed)}`);
    } else if (selectedEngine === 'yandex') {
      onNavigate(`https://yandex.ru/search/?text=${encodeURIComponent(trimmed)}`);
    } else {
      // Robail AI Search
      onNavigate(`robail://search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleAddCustomShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    let finalUrl = newUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('robail://')) {
      finalUrl = 'https://' + finalUrl;
    }
    const newItem: SpeedDialItem = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      url: finalUrl,
      type: 'custom',
      customColor: '#2563eb',
    };
    const updated = [...speedDialItems, newItem];
    setSpeedDialItems(updated);
    try {
      localStorage.setItem('rbl_gx_speed_dial_v2', JSON.stringify(updated));
    } catch {}
    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  const handleRemoveShortcut = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = speedDialItems.filter((i) => i.id !== id);
    setSpeedDialItems(updated);
    try {
      localStorage.setItem('rbl_gx_speed_dial_v2', JSON.stringify(updated));
    } catch {}
  };

  const enginesInfo: Record<SearchEngineChoice, { name: string; placeholder: string }> = {
    duckduckgo: { name: 'DuckDuckGo', placeholder: 'Поиск в DuckDuckGo или ввод адреса...' },
    google: { name: 'Google', placeholder: 'Поиск в Google или ввод адреса...' },
    yandex: { name: 'Яндекс', placeholder: 'Поиск в Яндексе или ввод адреса...' },
    robail: { name: 'Robail AI', placeholder: 'Умный поиск с Robail AI...' },
  };

  return (
    <div
      className={`flex-1 h-full w-full relative overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start select-none transition-colors ${
        gamingModActive ? 'bg-[#07080c] text-white' : 'bg-[#080c16] text-slate-100'
      }`}
    >
      {/* Dynamic Background */}
      {gamingModActive ? (
        /* Gaming Mode: Cyber Red Ribbons Wallpaper */
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090e] via-[#06070a] to-[#020305]" />
          <div
            className="absolute -bottom-24 left-1/4 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-50"
            style={{ backgroundColor: gamingColor || '#ff003c' }}
          />
          <svg
            className="absolute bottom-0 left-0 w-full h-[65%] pointer-events-none opacity-85"
            viewBox="0 0 1440 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 480 C 350 460, 650 360, 1050 430 C 1250 460, 1400 480, 1500 520 L 1500 620 L -50 620 Z"
              fill="#090a0f"
            />
            <path
              d="M-50 520 C 380 490, 720 330, 1180 390 C 1340 420, 1440 470, 1500 510"
              stroke={gamingColor || '#ff003c'}
              strokeWidth="9"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_15px_#ff003c]"
            />
          </svg>
        </div>
      ) : (
        /* Normal Mode: Original Signature СИНЕ-ЧЁРНЫЙ (Deep Blue-Black Cyber Gradient & Ambient Glows) */
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Deep Navy-Black Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c16] via-[#0a1122] to-[#060911]" />

          {/* Cyber Blue & Cyan Ambient Radial Light Pools */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-sky-500/12 blur-[150px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/4 w-[500px] h-[300px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-[550px] h-[320px] rounded-full bg-indigo-600/12 blur-[130px] pointer-events-none" />

          {/* Elegant Subtle Tech Horizon Arc */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[50%] pointer-events-none opacity-40"
            viewBox="0 0 1440 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 350 C 400 320, 800 240, 1500 290 L 1500 400 L -50 400 Z"
              fill="#0d1527"
              fillOpacity="0.5"
            />
            <path
              d="M-50 350 C 400 320, 800 240, 1500 290"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <path
              d="M-50 380 C 450 350, 950 280, 1500 330"
              stroke="#2563eb"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-4xl flex flex-col items-center pt-16 sm:pt-24 px-4 z-10">
        {/* Branding: Robile in Normal Mode, RBL GX in Gaming Mode */}
        {gamingModActive ? (
          <div className="flex flex-col items-center mb-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/rbl_gx_logo.png"
                alt="RBL GX Logo"
                className="w-12 h-12 object-contain rounded-2xl drop-shadow-lg p-1 bg-black/60 border border-red-500/40"
              />
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black tracking-wider text-white">RBL</span>
                <span
                  className="px-2.5 py-0.5 rounded-lg text-lg font-mono font-black"
                  style={{
                    backgroundColor: gamingColor || '#ba152d',
                    color: '#ffffff',
                  }}
                >
                  GX
                </span>
              </div>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Игровой кибер-режим активен
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/25 border border-sky-400/30">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                  Robile
                </h1>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Browser
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Быстрый, приватный и безопасный веб-браузер
            </p>
          </div>
        )}

        {/* Search Bar with Search Engine Selector */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-[540px] mb-10 relative">
          <div
            className={`relative flex items-center h-12 px-3 rounded-2xl transition-all duration-200 shadow-xl ${
              gamingModActive
                ? 'bg-[#141622]/90 hover:bg-[#1a1d2e] border border-red-500/30 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
                : 'bg-[#0f172a]/90 hover:bg-[#131d33] backdrop-blur-xl border border-sky-500/30 hover:border-sky-400/50 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20'
            }`}
          >
            {/* Search Engine Switcher Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEngineDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all mr-2 cursor-pointer ${
                  gamingModActive
                    ? 'hover:bg-white/10 text-slate-200'
                    : 'hover:bg-sky-500/10 text-sky-300'
                }`}
                title={`Поисковая система: ${enginesInfo[selectedEngine].name}. Нажмите, чтобы изменить.`}
              >
                {/* Engine Icon */}
                {selectedEngine === 'duckduckgo' && (
                  <div className="w-5 h-5 rounded-md bg-[#de5833] flex items-center justify-center font-bold text-[10px] text-white shadow-xs">
                    🦆
                  </div>
                )}
                {selectedEngine === 'google' && (
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center p-0.5 shadow-xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                )}
                {selectedEngine === 'yandex' && (
                  <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center font-black text-xs text-white shadow-xs">
                    Я
                  </div>
                )}
                {selectedEngine === 'robail' && (
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-xs font-semibold hidden sm:inline">
                  {enginesInfo[selectedEngine].name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Engine Switcher Dropdown Menu */}
              {isEngineDropdownOpen && (
                <div
                  className={`absolute top-10 left-0 z-30 w-52 rounded-xl shadow-2xl border p-1.5 animate-in fade-in zoom-in-95 backdrop-blur-xl ${
                    gamingModActive
                      ? 'bg-[#12131d] border-red-500/40 text-slate-100'
                      : 'bg-[#0f172a] border-sky-500/30 text-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 mb-1">
                    Выберите поисковую систему
                  </div>

                  {(['duckduckgo', 'google', 'yandex', 'robail'] as SearchEngineChoice[]).map((eng) => (
                    <button
                      key={eng}
                      type="button"
                      onClick={() => handleSelectEngine(eng)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedEngine === eng
                          ? 'bg-sky-500/20 text-sky-300 font-bold'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {eng === 'duckduckgo' && <span>🦆</span>}
                        {eng === 'google' && <span>🌐</span>}
                        {eng === 'yandex' && <span className="text-red-500 font-bold">Я</span>}
                        {eng === 'robail' && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
                        <span>{enginesInfo[eng].name}</span>
                      </div>
                      {selectedEngine === eng && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={enginesInfo[selectedEngine].placeholder}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 font-medium outline-none"
              autoFocus
            />

            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  gamingModActive
                    ? 'text-red-400 hover:text-white'
                    : 'text-sky-400 hover:text-sky-200 hover:bg-sky-500/10'
                }`}
                title="Поиск"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Speed Dial Shortcuts Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-full">
          {speedDialItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => onNavigate(item.url)}
            >
              {/* Card Container */}
              <div
                className={`relative w-28 sm:w-32 h-16 sm:h-18 rounded-xl flex items-center justify-center p-3 shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden border ${
                  gamingModActive
                    ? item.type === 'twitch'
                      ? 'bg-gradient-to-br from-[#9146ff] to-[#6441a5] border-white/10'
                      : item.type === 'youtube'
                      ? 'bg-gradient-to-br from-[#ff0000] via-[#e50914] to-[#b30000] border-white/10'
                      : item.type === 'gxgames'
                      ? 'bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#1e1b4b] border-white/10'
                      : item.type === 'reddit'
                      ? 'bg-gradient-to-br from-[#ff4500] to-[#cc3700] border-white/10'
                      : item.type === 'discord'
                      ? 'bg-gradient-to-br from-[#5865f2] to-[#404eed] border-white/10'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/10'
                    : 'bg-[#101728]/90 hover:bg-[#16213a] border-slate-700/60 hover:border-sky-400/60 backdrop-blur-md'
                }`}
              >
                {/* Visual Icons / Logos */}
                {item.type === 'twitch' && (
                  <span className="font-black text-2xl tracking-tighter text-white drop-shadow-md italic">
                    twitch
                  </span>
                )}

                {item.type === 'youtube' && (
                  <div className="flex items-center gap-1.5 text-white">
                    <div className="w-7 h-5 rounded-md bg-white flex items-center justify-center">
                      <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-[#ff0000] ml-0.5" />
                    </div>
                    <span className="font-black text-base tracking-tighter drop-shadow-md">
                      YouTube
                    </span>
                  </div>
                )}

                {item.type === 'gxgames' && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-xl">🎮</div>
                    <span className="font-extrabold text-[10px] tracking-wider text-sky-300 uppercase">
                      Игры
                    </span>
                  </div>
                )}

                {item.type === 'reddit' && (
                  <div className="flex items-center gap-1.5 text-white">
                    <svg className="w-6 h-6 fill-current text-orange-500" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm-5.46 3.99a.327.327 0 0 0-.231.095.327.327 0 0 0 0 .462c.983.985 2.548.985 3.53 0a.327.327 0 0 0-.462-.462c-.732.73-1.874.73-2.607 0a.32.32 0 0 0-.23-.095z" />
                    </svg>
                    <span className="font-bold text-sm tracking-tight">reddit</span>
                  </div>
                )}

                {item.type === 'discord' && (
                  <div className="flex items-center gap-1.5 text-white">
                    <svg className="w-6 h-6 fill-current text-indigo-400" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span className="font-bold text-sm tracking-tight">Discord</span>
                  </div>
                )}

                {item.type === 'custom' && (
                  <div className="flex flex-col items-center">
                    <Globe className="w-5 h-5 text-sky-400 mb-1" />
                    <span className="font-bold text-xs truncate max-w-[80px] text-white">
                      {item.title}
                    </span>
                  </div>
                )}

                {/* Remove button for custom shortcuts */}
                {item.type === 'custom' && (
                  <button
                    onClick={(e) => handleRemoveShortcut(e, item.id)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Title Underneath Card */}
              <span className="mt-2 text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                {item.title}
              </span>
            </div>
          ))}

          {/* Add Shortcut Card '+' */}
          <div
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-28 sm:w-32 h-16 sm:h-18 rounded-xl flex items-center justify-center border border-dashed transition-all duration-200 group-hover:scale-105 shadow-md ${
                gamingModActive
                  ? 'bg-[#1a1b26]/50 hover:bg-[#222433]/80 border-white/15 hover:border-white/30'
                  : 'bg-[#101728]/50 hover:bg-[#16213a]/80 border-slate-700/60 hover:border-sky-400/50'
              }`}
            >
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-sky-400 transition-colors" />
            </div>
            <span className="mt-2 text-xs font-medium text-transparent">_</span>
          </div>
        </div>
      </div>

      {/* Add Shortcut Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-750 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-sm text-white">Добавить сайт в закладки</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCustomShortcut} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например, Steam"
                  className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  URL адрес
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://store.steampowered.com"
                  className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
