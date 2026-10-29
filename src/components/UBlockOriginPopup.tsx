import React, { useState } from 'react';
import {
  Power,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  X,
  ExternalLink,
  Sliders,
} from 'lucide-react';

interface UBlockOriginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  blockedCount: number;
  totalBlockedCount: number;
  currentHost?: string;
  theme?: 'dark' | 'light';
  isGamingTheme?: boolean;
}

export const UBlockOriginPopup: React.FC<UBlockOriginPopupProps> = ({
  isOpen,
  onClose,
  isEnabled,
  onToggleEnabled,
  blockedCount,
  totalBlockedCount,
  currentHost = 'youtube.com',
  theme = 'dark',
  isGamingTheme = false,
}) => {
  const [cosmeticFiltering, setCosmeticFiltering] = useState(true);
  const [popupsBlocked, setPopupsBlocked] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light' && !isGamingTheme;

  return (
    <div className="fixed top-11 right-16 z-50 w-76 rounded-2xl shadow-2xl border overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl bg-slate-950/95 border-slate-800 text-white ring-1 ring-cyan-500/20">
      {/* Robail Shield Header */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-700 to-rose-500 flex items-center justify-center text-white font-black text-[10px] shadow-sm">
            RS
          </div>
          <span className="font-bold text-xs tracking-wide">Robail Shield</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
            AdBlock
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          title="Закрыть"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Big Power Switch Area */}
      <div className="p-4 flex flex-col items-center justify-center border-b border-slate-850 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="text-[11px] font-mono text-slate-400 mb-2 truncate max-w-[240px]">
          {currentHost || 'robail://start'}
        </div>

        {/* Big Circular uBlock Power Button */}
        <button
          type="button"
          onClick={() => onToggleEnabled(!isEnabled)}
          title={isEnabled ? 'Отключить uBlock на этом сайте' : 'Включить uBlock на этом сайте'}
          className={`w-18 h-18 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
            isEnabled
              ? isGamingTheme
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white ring-4 ring-rose-500/30 shadow-rose-600/40 hover:scale-105'
                : 'bg-gradient-to-tr from-sky-600 to-blue-500 text-white ring-4 ring-sky-500/30 shadow-sky-600/40 hover:scale-105'
              : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Power className={`w-8 h-8 ${isEnabled ? 'text-white' : 'text-slate-500'}`} />
        </button>

        <span className={`text-[11px] font-bold mt-2.5 ${isEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
          {isEnabled ? 'Фильтрация рекламы активна' : 'Фильтрация отключена'}
        </span>
      </div>

      {/* Stats Dashboard */}
      <div className="p-3 bg-slate-950 border-b border-slate-850 grid grid-cols-2 gap-2 text-center">
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            На этой странице
          </div>
          <div className="text-xl font-mono font-black text-rose-400 mt-0.5">
            {isEnabled ? blockedCount : 0}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            Всего с момента запуска
          </div>
          <div className="text-xl font-mono font-black text-amber-400 mt-0.5">
            {totalBlockedCount}
          </div>
        </div>
      </div>

      {/* Quick Tools & Switches */}
      <div className="p-3 space-y-1.5 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-850">
          <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <span>Косметические фильтры баннеров</span>
          </span>
          <button
            type="button"
            onClick={() => setCosmeticFiltering(!cosmeticFiltering)}
            className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
              cosmeticFiltering ? 'bg-sky-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                cosmeticFiltering ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-850">
          <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Блокировка всплывающих окон</span>
          </span>
          <button
            type="button"
            onClick={() => setPopupsBlocked(!popupsBlocked)}
            className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
              popupsBlocked ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                popupsBlocked ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3.5 py-2 bg-slate-900 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
        <span>Списки: EasyList, EasyPrivacy, AdGuard RU</span>
        <span className="text-emerald-400 font-semibold">100% защита</span>
      </div>
    </div>
  );
};
