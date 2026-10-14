import React from 'react';
import { X, Sliders, Palette, Shield, Search, Layout, Trash2, Check } from 'lucide-react';
import { BrowserSettings, BrowserTheme, SearchEngine } from '../types/browser';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: BrowserSettings) => void;
  onClearBrowsingData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearBrowsingData,
}) => {
  if (!isOpen) return null;

  const themes: Array<{ id: BrowserTheme; name: string; color: string }> = [
    { id: 'midnight', name: 'Midnight Titanium', color: 'bg-slate-900 border-sky-400' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: 'bg-black border-amber-400' },
    { id: 'arctic', name: 'Arctic Light', color: 'bg-slate-200 border-sky-500 text-slate-900' },
    { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-950 border-indigo-400' },
    { id: 'emerald', name: 'Emerald Matrix', color: 'bg-zinc-950 border-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Robail Browser Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-5 text-xs text-slate-300">
          {/* Appearance & Themes */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-100">
              <Palette className="w-4 h-4 text-sky-400" />
              <span>Theme & Appearance</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ ...settings, theme: t.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${t.color} ${
                    settings.theme === t.id ? 'ring-2 ring-sky-400 font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className="block text-xs">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Layout */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-100">
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>Tabs Layout</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, layout: 'horizontal' })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  settings.layout === 'horizontal'
                    ? 'bg-slate-800 border-sky-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-medium text-xs mb-0.5">Horizontal Tabs</div>
                <div className="text-[11px] text-slate-500">Classic Chrome / Safari top strip</div>
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, layout: 'vertical' })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  settings.layout === 'vertical'
                    ? 'bg-slate-800 border-sky-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-medium text-xs mb-0.5">Vertical Sidebar</div>
                <div className="text-[11px] text-slate-500">Arc / Edge sidebar navigation</div>
              </button>
            </div>
          </div>

          {/* Search Engine */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-100">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Default Search Engine</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['robail', 'google', 'duckduckgo', 'wikipedia', 'bing'] as SearchEngine[]).map((engine) => (
                <button
                  key={engine}
                  onClick={() => onUpdateSettings({ ...settings, defaultSearchEngine: engine })}
                  className={`px-3 py-1.5 rounded-lg border text-xs capitalize transition-colors ${
                    settings.defaultSearchEngine === engine
                      ? 'bg-sky-500/10 border-sky-400 text-sky-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {engine === 'robail' ? 'Robail AI' : engine}
                </button>
              ))}
            </div>
          </div>

          {/* Shield & Privacy Toggles */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-100">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Security</span>
            </div>
            <div className="space-y-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Robail AdShield (Block ads & trackers)</span>
                <input
                  type="checkbox"
                  checked={settings.adBlockEnabled}
                  onChange={(e) => onUpdateSettings({ ...settings, adBlockEnabled: e.target.checked })}
                  className="rounded accent-sky-500 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Send Do Not Track (DNT) header</span>
                <input
                  type="checkbox"
                  checked={settings.doNotTrack}
                  onChange={(e) => onUpdateSettings({ ...settings, doNotTrack: e.target.checked })}
                  className="rounded accent-sky-500 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Bookmarks Bar below address bar</span>
                <input
                  type="checkbox"
                  checked={settings.showBookmarksBar}
                  onChange={(e) => onUpdateSettings({ ...settings, showBookmarksBar: e.target.checked })}
                  className="rounded accent-sky-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Clear Data */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Clear cache and browsing history</span>
            <button
              onClick={() => {
                onClearBrowsingData();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Browsing Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
