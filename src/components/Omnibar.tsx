import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  LockOpen,
  ArrowRightCircle,
  ShieldAlert,
  ShieldCheck,
  X,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Tab } from '../types/browser';
import { formatUrlForDisplay } from '../utils/browserUtils';
import { OmegaAssistant } from './OmegaAssistant';

interface OmnibarProps {
  activeTab: Tab;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onDeleteCurrentSite?: () => void;
  onOpenQuarantineList?: () => void;
  quarantinedCount?: number;
}

export const Omnibar: React.FC<OmnibarProps> = ({
  activeTab,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onDeleteCurrentSite,
  onOpenQuarantineList,
  quarantinedCount = 0,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with current tab URL
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatUrlForDisplay(activeTab.url));
    }
  }, [activeTab.url, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsFocused(false);
    onNavigate(inputValue);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      setInputValue(formatUrlForDisplay(activeTab.url));
      inputRef.current?.blur();
    }
  };

  const isSecure = activeTab.security.isSecure;
  const isDangerous = activeTab.security.isDangerous || Boolean(activeTab.security.threatType);
  const isWebPage = Boolean(activeTab.url && activeTab.url !== 'robail://start' && !activeTab.url.startsWith('robail://'));

  return (
    <div className="h-10 bg-slate-900 border-b border-slate-800/80 px-3 flex items-center justify-between gap-2 select-none z-40 relative">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={activeTab.historyIndex <= 0}
          title="Назад"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onForward}
          disabled={activeTab.historyIndex >= activeTab.history.length - 1}
          title="Вперёд"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          title="Обновить страницу"
          className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
            activeTab.isLoading ? 'animate-spin text-amber-400' : ''
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={onHome}
          title="Главная"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar with Dynamic Lock in the Corner */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-4xl relative">
        <div
          className={`h-8 w-full rounded-lg bg-slate-950 border transition-all flex items-center px-3 gap-2 ${
            isFocused
              ? 'border-amber-400 ring-2 ring-amber-400/20'
              : isDangerous
              ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/40'
              : isSecure
              ? 'border-slate-800 hover:border-slate-700'
              : 'border-rose-500/80 hover:border-rose-400'
          }`}
        >
          {/* Dynamic Corner Lock Indicator (Closed = Secure / Open = Insecure) */}
          <button
            type="button"
            onClick={() => setIsSecurityOpen(!isSecurityOpen)}
            title={activeTab.security.statusText}
            className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded-md transition-colors flex-shrink-0 ${
              isSecure
                ? 'text-emerald-400 hover:bg-emerald-500/10'
                : 'text-rose-500 hover:bg-rose-500/10 bg-rose-500/10'
            }`}
          >
            {isSecure ? (
              /* ЗАКРЫТЫЙ ЗАМОЧЕК для безопасного домена */
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              /* ОТКРЫТЫЙ ЗАМОЧЕК для небезопасного домена */
              <>
                <LockOpen className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tight">
                  {isDangerous ? 'УГРОЗА' : 'Небезопасно'}
                </span>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              inputRef.current?.select();
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Введите веб-адрес или поисковый запрос (например, wikipedia.org или youtube.com)..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none select-text"
          />

          {inputValue.trim() && isFocused && (
            <button type="submit" className="text-amber-400 hover:text-amber-300">
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          )}

          {activeTab.url && activeTab.url !== 'robail://start' && (
            <a
              href={activeTab.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Запустить официальную ссылку сайта"
              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors flex items-center flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Security Details Dropdown Modal */}
        {isSecurityOpen && (
          <div className="absolute top-full left-0 mt-2 w-88 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl p-4 text-xs z-50 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isSecure ? (
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                    <LockOpen className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className={`font-bold text-xs ${isSecure ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {activeTab.security.statusText}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[170px] block">
                    {activeTab.security.hostname}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed mb-3 text-[11px]">
              {activeTab.security.reason}
            </p>

            {/* Antivirus & Anti-Piracy Check Report */}
            <div className="mb-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Антивирусная проверка:
                </span>
                <span className={`font-bold ${activeTab.security.threatType === 'virus' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeTab.security.threatType === 'virus' ? 'ОБНАРУЖЕН ВИРУС' : 'Угроз не обнаружено'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Фильтр пиратских сайтов:
                </span>
                <span className={`font-bold ${activeTab.security.threatType === 'pirate' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeTab.security.threatType === 'pirate' ? 'ПИРАТСКИЙ РЕСУРС' : 'Лицензионный источник'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 text-[10px] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Протокол:</span>
                <span className={`font-mono font-bold uppercase ${isSecure ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeTab.security.protocol}
                </span>
              </div>
              {activeTab.security.certificateIssuer && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Сертификат:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">
                    {activeTab.security.certificateIssuer}
                  </span>
                </div>
              )}
              {activeTab.security.encryption && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Шифрование:</span>
                  <span className="text-slate-300 font-mono">
                    {activeTab.security.encryption}
                  </span>
                </div>
              )}
            </div>

            {/* User action: Declare unsafe and delete site */}
            {isWebPage && onDeleteCurrentSite && (
              <button
                type="button"
                onClick={() => {
                  setIsSecurityOpen(false);
                  onDeleteCurrentSite();
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mb-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Удалить этот сайт (Небезопасный)</span>
              </button>
            )}

            <div className="text-center">
              <span className={`text-[10px] font-semibold ${isSecure ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isSecure ? '✓ Защищенный безопасный домен' : '⚠ Небезопасный ресурс — замок открыт'}
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Right Controls: Assistant + Security Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Discreet AI Assistant Button: "чтобы кнопка не обращала так внимание, но она была" */}
        <button
          type="button"
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          title="Голосовой и текстовый ассистент (шутки, погода, открыть YouTube и сайты)"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
            isAssistantOpen
              ? 'bg-purple-950/70 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/30'
              : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-purple-500/30 text-slate-400 hover:text-purple-300'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" />
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium text-[11px] text-slate-300 hover:text-white hidden sm:inline">
            Ассистент
          </span>
        </button>

        {isWebPage && onDeleteCurrentSite && (
          <button
            onClick={onDeleteCurrentSite}
            title="Говорю то, что этот сайт небезопасный — удалить сайт и заблокировать!"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/40'
                : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
            <span className="hidden sm:inline">
              {isDangerous ? 'Удалить опасный сайт' : 'Сайт небезопасный: Удалить'}
            </span>
          </button>
        )}

        {/* Quarantined sites registry button */}
        {onOpenQuarantineList && (
          <button
            onClick={onOpenQuarantineList}
            title="Список удалённых небезопасных сайтов (Вирусы и пиратство)"
            className="flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            {quarantinedCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/40">
                {quarantinedCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Omega AI Assistant Popover */}
      <OmegaAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeTab={activeTab}
        onNavigate={onNavigate}
      />
    </div>
  );
};
