import React from 'react';
import { X, Plus, Globe, Compass, Swords, Minus, Square } from 'lucide-react';
import { Tab } from '../types/browser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  theme?: 'dark' | 'light';
  gamingModActive?: boolean;
  gamingColor?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  theme = 'dark',
  gamingModActive = false,
  gamingColor = '#ff003c',
}) => {
  const isLight = theme === 'light' && !gamingModActive;

  return (
    <div
      className="h-10 border-b flex items-center justify-between px-2.5 select-none gap-2 transition-colors relative z-40"
      style={{
        backgroundColor: gamingModActive
          ? '#0c0d14'
          : isLight
          ? '#f1f5f9'
          : '#090d16',
        borderBottomColor: gamingModActive
          ? 'rgba(255, 255, 255, 0.07)'
          : isLight
          ? '#cbd5e1'
          : '#162238',
      }}
    >
      {/* Left: Brand - Robile in Normal Mode, RBL GX in Gaming Mode */}
      <div className="flex items-center gap-2 mr-2 pl-1 shrink-0">
        {gamingModActive ? (
          <>
            <img
              src="/rbl_gx_logo.png"
              alt="RBL GX Logo"
              className="w-5 h-5 object-contain rounded drop-shadow-sm select-none"
            />
            <div className="flex items-center gap-1 font-black tracking-wider text-xs">
              <span className="text-white">RBL</span>
              <span
                className="px-1 py-0.2 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: '#ba152d',
                  color: '#ffffff',
                }}
              >
                GX
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-xs">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white drop-shadow-xs">
              Robile
            </span>
          </div>
        )}
      </div>

      {/* Tabs Container */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 max-w-[210px] min-w-[130px] h-8 px-3 rounded-t-md text-xs cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'text-white font-semibold shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200'
                  : gamingModActive
                  ? 'text-slate-400 hover:text-slate-200 bg-[#141520]/80 hover:bg-[#1a1c2b]'
                  : 'text-slate-400 hover:text-slate-200 bg-[#0d1424]/80 hover:bg-[#131d33]'
              }`}
              style={{
                backgroundColor: isActive
                  ? gamingModActive
                    ? '#ba152d'
                    : isLight
                    ? '#ffffff'
                    : '#151e33'
                  : undefined,
                borderTop: isActive
                  ? gamingModActive
                    ? '2px solid rgba(255,255,255,0.4)'
                    : '2px solid #38bdf8'
                  : '2px solid transparent',
              }}
            >
              <div className="shrink-0">
                {tab.isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : tab.url === 'robail://clan' || tab.url === 'robail://arcade' ? (
                  <Swords className="w-3.5 h-3.5 text-white/90" />
                ) : tab.mode === 'start' ? (
                  <Compass className="w-3.5 h-3.5 text-white/90" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-white/70" />
                )}
              </div>

              <span className="flex-1 truncate font-medium">
                {tab.mode === 'start'
                  ? gamingModActive
                    ? 'GX Corner'
                    : 'Новая вкладка'
                  : tab.title || 'Новая вкладка'}
              </span>

              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="p-0.5 rounded opacity-70 hover:opacity-100 hover:bg-black/20 text-white transition-all cursor-pointer"
                  title="Закрыть вкладку"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          title="Новая вкладка (Ctrl+T)"
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-0.5"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Desktop Window Controls (Minimize, Maximize, Close) */}
      <div className="flex items-center shrink-0 text-slate-400">
        <button
          onClick={() => {}}
          title="Свернуть"
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {}}
          title="Развернуть"
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={() => {}}
          title="Закрыть"
          className="w-8 h-8 flex items-center justify-center hover:bg-[#e81123] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
