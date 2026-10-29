import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Gamepad2,
  Shield,
  ShoppingBag,
  Settings,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface GxSidebarProps {
  onNavigate: (url: string) => void;
  onOpenOmega: () => void;
  isOmegaOpen?: boolean;
  onOpenStore: () => void;
  onOpenSettings: () => void;
  onOpenArcade: () => void;
  onToggleShield: () => void;
  isShieldActive?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  accentColor?: string;
  onQuickClean?: () => void;
  onOpenGxControl?: () => void;
  activeUrl?: string;
}

export const GxSidebar: React.FC<GxSidebarProps> = ({
  onNavigate,
  onOpenOmega,
  isOmegaOpen = false,
  onOpenStore,
  onOpenSettings,
  onOpenArcade,
  onToggleShield,
  isShieldActive = true,
  soundEnabled,
  onToggleSound,
  accentColor = '#ff003c',
  onQuickClean,
  onOpenGxControl,
  activeUrl = '',
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const playClickSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {}
  };

  return (
    <aside
      className="w-12 h-full flex flex-col items-center justify-between py-2 select-none z-30 shrink-0 border-r transition-all"
      style={{
        backgroundColor: '#090a0f',
        borderColor: `${accentColor}25`,
        boxShadow: `inset -1px 0 0 ${accentColor}15`,
      }}
    >
      {/* Top Section: RBLGX Logo + Main GX Features */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* Top Button: User Custom RBLGX Logo in Glowing Crimson Square */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('robail://start');
          }}
          title="RBL GX — Главное меню"
          className="relative group p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: `${accentColor}25`,
            border: `1px solid ${accentColor}80`,
            boxShadow: `0 0 12px ${accentColor}40`,
          }}
          onMouseEnter={() => setHoveredItem('rbl_home')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <img
            src="/rbl_gx_logo.png"
            alt="RBL GX Logo"
            className="w-5 h-5 object-contain rounded drop-shadow-sm group-hover:scale-110 transition-transform"
          />
          {/* Tooltip */}
          {hoveredItem === 'rbl_home' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-red-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              RBL GX Главная
            </div>
          )}
        </button>

        <div className="w-6 h-[1px] bg-white/10 my-0.5" />

        {/* GX Control (Limiter & Performance) */}
        <button
          onClick={() => {
            playClickSound();
            if (onOpenGxControl) onOpenGxControl();
          }}
          onMouseEnter={() => setHoveredItem('gx_control')}
          onMouseLeave={() => setHoveredItem(null)}
          title="GX Control — Ограничитель и Скорость"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
        >
          <Gauge className="w-4 h-4 text-rose-500 hover:scale-110 transition-transform" />
          {hoveredItem === 'gx_control' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-rose-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              GX Control
            </div>
          )}
        </button>

        {/* GX Cleaner (Clean cache & junk) */}
        <button
          onClick={() => {
            playClickSound();
            if (onQuickClean) onQuickClean();
          }}
          onMouseEnter={() => setHoveredItem('gx_cleaner')}
          onMouseLeave={() => setHoveredItem(null)}
          title="GX Cleaner — Быстрая очистка"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
        >
          <Sparkles className="w-4 h-4 text-amber-400 hover:scale-110 transition-transform" />
          {hoveredItem === 'gx_cleaner' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-amber-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              GX Cleaner
            </div>
          )}
        </button>

        {/* Twitch Shortcut */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('https://www.twitch.tv');
          }}
          onMouseEnter={() => setHoveredItem('twitch')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Twitch — Стримы игр"
          className="relative p-2 rounded-lg text-slate-400 hover:text-purple-400 transition-all cursor-pointer hover:bg-purple-950/20"
        >
          {/* Twitch Icon SVG */}
          <svg className="w-4 h-4 fill-current text-[#9146ff] hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          {hoveredItem === 'twitch' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-purple-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Twitch
            </div>
          )}
        </button>

        {/* Discord Shortcut */}
        <button
          onClick={() => {
            playClickSound();
            onNavigate('https://discord.com/app');
          }}
          onMouseEnter={() => setHoveredItem('discord')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Discord — Чаты и каналы"
          className="relative p-2 rounded-lg text-slate-400 hover:text-indigo-400 transition-all cursor-pointer hover:bg-indigo-950/20"
        >
          {/* Discord Icon SVG */}
          <svg className="w-4 h-4 fill-current text-[#5865f2] hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          {hoveredItem === 'discord' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-indigo-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Discord
            </div>
          )}
        </button>

        {/* Omega AI Assistant with pulsing red gamer ring */}
        <button
          onClick={() => {
            playClickSound();
            onOpenOmega();
          }}
          onMouseEnter={() => setHoveredItem('omega')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Омега — Голосовой и текстовый ИИ помощник"
          className={`relative p-2 rounded-lg transition-all cursor-pointer ${
            isOmegaOpen
              ? 'bg-rose-950/70 text-rose-300 ring-2 ring-rose-500/60 shadow-[0_0_12px_rgba(255,0,60,0.5)]'
              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/20'
          }`}
        >
          <div className="relative">
            <Radio className="w-4 h-4 text-rose-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
          </div>
          {hoveredItem === 'omega' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-rose-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Омега AI (Голос & Текст)
            </div>
          )}
        </button>

        {/* Arcade Games / Clan Wars */}
        <button
          onClick={() => {
            playClickSound();
            onOpenArcade();
          }}
          onMouseEnter={() => setHoveredItem('arcade')}
          onMouseLeave={() => setHoveredItem(null)}
          title="RBL Arcade & Игры"
          className="relative p-2 rounded-lg text-slate-400 hover:text-emerald-400 transition-all cursor-pointer hover:bg-emerald-950/20"
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400 hover:scale-110 transition-transform" />
          {hoveredItem === 'arcade' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-emerald-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Игры & gx.games
            </div>
          )}
        </button>

        {/* RBL Shield (AdBlock) */}
        <button
          onClick={() => {
            playClickSound();
            onToggleShield();
          }}
          onMouseEnter={() => setHoveredItem('shield')}
          onMouseLeave={() => setHoveredItem(null)}
          title="RBL Shield — Блокировщик рекламы"
          className="relative p-2 rounded-lg text-slate-400 hover:text-rose-400 transition-all cursor-pointer hover:bg-rose-950/20"
        >
          <Shield
            className={`w-4 h-4 transition-transform hover:scale-110 ${
              isShieldActive ? 'text-rose-500 fill-rose-500/20' : 'text-slate-600'
            }`}
          />
          {hoveredItem === 'shield' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-rose-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              RBL Shield {isShieldActive ? '(Включён)' : '(Выключен)'}
            </div>
          )}
        </button>
      </div>

      {/* Bottom Section: Sound Toggle + Settings */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Cyber Sounds Toggle */}
        <button
          onClick={() => {
            onToggleSound();
            playClickSound();
          }}
          onMouseEnter={() => setHoveredItem('sound')}
          onMouseLeave={() => setHoveredItem(null)}
          title={soundEnabled ? 'Игровые звуки включены' : 'Игровые звуки выключены'}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-rose-400 hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-600 hover:scale-110 transition-transform" />
          )}
          {hoveredItem === 'sound' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-white/20 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Звуки {soundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
            </div>
          )}
        </button>

        {/* Store / Catalog */}
        <button
          onClick={() => {
            playClickSound();
            onOpenStore();
          }}
          onMouseEnter={() => setHoveredItem('store')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Магазин расширений и модов"
          className="relative p-2 rounded-lg text-slate-400 hover:text-amber-400 transition-all cursor-pointer hover:bg-amber-950/20"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400 hover:scale-110 transition-transform" />
          {hoveredItem === 'store' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-amber-500/50 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Магазин модов
            </div>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            playClickSound();
            onOpenSettings();
          }}
          onMouseEnter={() => setHoveredItem('settings')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Настройки RBL GX"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
        >
          <Settings className="w-4 h-4 text-slate-400 hover:text-white hover:rotate-90 transition-all" />
          {hoveredItem === 'settings' && (
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#13141f] border border-white/20 text-white text-[11px] font-bold whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Настройки
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
