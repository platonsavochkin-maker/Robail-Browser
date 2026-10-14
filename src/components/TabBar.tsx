import React from 'react';
import { X, Plus, Globe, Compass, Swords } from 'lucide-react';
import { Tab } from '../types/browser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  theme?: 'dark' | 'light';
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`h-10 border-b flex items-center px-3 select-none gap-2 transition-colors ${
        isLight
          ? 'bg-slate-200 border-slate-300 text-slate-800'
          : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      {/* Brand: Pure text name (enlarged) */}
      <div className="flex items-center mr-3 pl-1">
        <span
          className={`text-sm font-black tracking-widest ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          ROBAIL
        </span>
      </div>

      {/* Tabs Container */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 max-w-[220px] min-w-[130px] h-8 px-3 rounded-t-lg text-xs cursor-pointer border-t border-x transition-all ${
                isActive
                  ? isLight
                    ? 'bg-white text-amber-600 border-slate-300 font-semibold shadow-xs'
                    : 'bg-slate-900 text-amber-400 border-slate-750 font-semibold shadow-xs'
                  : isLight
                  ? 'bg-slate-200/50 text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                  : 'bg-slate-950/60 text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex-shrink-0">
                {tab.isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : tab.url === 'robail://clan' || tab.url === 'robail://arcade' ? (
                  <Swords className="w-3.5 h-3.5 text-amber-500" />
                ) : tab.mode === 'start' ? (
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <span className="flex-1 truncate">{tab.title || 'Новая вкладка'}</span>

              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`p-0.5 rounded opacity-60 group-hover:opacity-100 transition-all ${
                    isLight
                      ? 'text-slate-500 hover:text-rose-600 hover:bg-slate-200'
                      : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-amber-500" />
              )}
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          title="Новая вкладка (Ctrl+T)"
          className={`p-1.5 rounded-lg transition-colors ml-1 ${
            isLight
              ? 'text-slate-600 hover:text-amber-600 hover:bg-slate-300'
              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
