import React from 'react';
import { X, Download, FileText, CheckCircle, ArrowDownCircle } from 'lucide-react';
import { DownloadItem } from '../types/browser';

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadItem[];
  onDownloadPageSource: () => void;
}

export const DownloadsModal: React.FC<DownloadsModalProps> = ({
  isOpen,
  onClose,
  downloads,
  onDownloadPageSource,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Downloads Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action: Save Page Source */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">Save active page as HTML</span>
          <button
            onClick={onDownloadPageSource}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Download Page</span>
          </button>
        </div>

        {/* Downloads List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {downloads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <Download className="w-8 h-8 mb-2 opacity-30" />
              <span>No active downloads</span>
            </div>
          ) : (
            downloads.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-200 truncate">{item.filename}</div>
                    <div className="text-[10px] text-slate-500">{item.size} · Completed</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
