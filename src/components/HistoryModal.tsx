import React, { useState } from 'react';
import { X, History, Trash2, Search, ExternalLink, Clock } from 'lucide-react';
import { HistoryItem } from '../types/browser';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
  onNavigate: (url: string) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onNavigate,
  onClearHistory,
  onDeleteItem,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Browsing History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
          <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="bg-transparent outline-none flex-1 text-xs select-text placeholder-slate-600"
            />
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <History className="w-8 h-8 mb-2 opacity-30" />
              <span>No history entries found</span>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.url);
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="truncate flex-1 pr-3">
                  <div className="text-xs font-medium text-slate-200 group-hover:text-sky-300 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                    {item.url}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-600">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
