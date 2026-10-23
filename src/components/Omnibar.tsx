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
  MoreVertical,
  Download,
} from 'lucide-react';
import { Tab } from '../types/browser';
import { formatUrlForDisplay } from '../utils/browserUtils';
import { OmegaAssistant } from './OmegaAssistant';
import { BrowserSettingsMenu } from './BrowserSettingsMenu';

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
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  assistantEnabled?: boolean;
  onToggleAssistant?: (enabled: boolean) => void;
  onClearData?: () => void;
  isInstalled?: boolean;
  onOpenInstall?: () => void;
  onResetInstall?: () => void;
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
  theme = 'dark',
  onToggleTheme,
  assistantEnabled = true,
  onToggleAssistant,
  onClearData,
  isInstalled = false,
  onOpenInstall,
  onResetInstall,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLight = theme === 'light';

  // If assistant was turned off in settings, make sure open state is reset
  useEffect(() => {
    if (!assistantEnabled && isAssistantOpen) {
      setIsAssistantOpen(false);
    }
  }, [assistantEnabled, isAssistantOpen]);

  // Auto-open Omega if launched with #omega, ?omega, or via installer event
  useEffect(() => {
    if (!assistantEnabled) return;

    const checkHashAndSearch = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('omega') || search.includes('omega') || search.includes('assistant')) {
        setIsAssistantOpen(true);
      }
    };

    checkHashAndSearch();
    window.addEventListener('hashchange', checkHashAndSearch);

    const handleOpenOmegaEvent = () => {
      setIsAssistantOpen(true);
    };
    window.addEventListener('robail-open-omega', handleOpenOmegaEvent);

    return () => {
      window.removeEventListener('hashchange', checkHashAndSearch);
      window.removeEventListener('robail-open-omega', handleOpenOmegaEvent);
    };
  }, [assistantEnabled]);

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
  const isWebPage = Boolean(
    activeTab.url && activeTab.url !== 'robail://start' && !activeTab.url.startsWith('robail://')
  );

  return (
    <div
      className={`h-10 border-b px-3 flex items-center justify-between gap-2 select-none z-40 relative transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-slate-900 border-slate-800/80 text-slate-100'
      }`}
    >
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={activeTab.historyIndex <= 0}
          title="Назад"
          className={`p-1.5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onForward}
          disabled={activeTab.historyIndex >= activeTab.history.length - 1}
          title="Вперёд"
          className={`p-1.5 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          title="Обновить страницу"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab.isLoading ? 'animate-spin text-amber-500' : ''
          } ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={onHome}
          title="Главная"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar with Dynamic Lock in the Corner */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-4xl relative">
        <div
          className={`h-8 w-full rounded-lg border transition-all flex items-center px-3 gap-2 ${
            isLight
              ? isFocused
                ? 'bg-white border-amber-500 ring-2 ring-amber-400/20'
                : isDangerous
                ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400/30'
                : isSecure
                ? 'bg-slate-100 border-slate-200 hover:border-slate-300'
                : 'bg-rose-50/50 border-rose-400/80 hover:border-rose-400'
              : isFocused
              ? 'bg-slate-950 border-amber-400 ring-2 ring-amber-400/20'
              : isDangerous
              ? 'bg-rose-950/20 border-rose-500 ring-1 ring-rose-500/40'
              : isSecure
              ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
              : 'bg-slate-950 border-rose-500/80 hover:border-rose-400'
          }`}
        >
          {/* Dynamic Corner Lock Indicator (Closed = Secure / Open = Insecure) */}
          <button
            type="button"
            onClick={() => setIsSecurityOpen(!isSecurityOpen)}
            title={activeTab.security.statusText}
            className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded-md transition-colors flex-shrink-0 cursor-pointer ${
              isSecure
                ? 'text-emerald-500 hover:bg-emerald-500/10'
                : 'text-rose-500 hover:bg-rose-500/10 bg-rose-500/10'
            }`}
          >
            {isSecure ? (
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <LockOpen className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            )}
            <span className="text-[10px] font-mono font-medium hidden md:inline">
              {isSecure ? 'Замок закрыт' : 'Замок открыт ⚠'}
            </span>
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Введите поисковый запрос или URL..."
            className={`w-full bg-transparent text-xs font-mono outline-none select-text ${
              isLight
                ? 'text-slate-900 placeholder-slate-400'
                : 'text-slate-200 placeholder-slate-500'
            }`}
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isLight
                  ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                  : 'text-slate-500 hover:text-white hover:bg-slate-800'
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="submit"
            className="p-1 rounded-md text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
            title="Перейти"
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security Info Popover */}
        {isSecurityOpen && (
          <div
            className={`absolute top-10 left-0 w-80 rounded-xl p-4 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800 ring-1 ring-slate-900/5'
                : 'bg-slate-900 border-slate-750 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                {isSecure ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                )}
                <span className="font-bold text-xs">
                  {isSecure ? 'Безопасное соединение' : 'Небезопасное подключение'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[11px] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Статус:</span>
                <span className={isSecure ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}>
                  {activeTab.security.statusText}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Хост:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {activeTab.security.hostname || 'start'}
                </span>
              </div>
              {activeTab.security.certificateIssuer && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Сертификат:</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {activeTab.security.certificateIssuer}
                  </span>
                </div>
              )}
              {activeTab.security.encryption && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Шифрование:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono">
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
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mb-2 cursor-pointer"
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

      {/* Right Controls: Install Button + Assistant + Security Actions + Three Dots Settings */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* "Установить" Button: Prominent when not installed, accessible for reinstall when installed */}
        {!isInstalled ? (
          <button
            type="button"
            onClick={onOpenInstall}
            title="Установить Robail Browser v18.0 на компьютер (RobailBrowser-v18.0-Setup.exe)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm border cursor-pointer animate-in fade-in duration-200 ${
              isLight
                ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 ring-1 ring-amber-400/20'
                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Установить</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500 text-black">
              v18.0
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenInstall}
            title="Robail Browser v18.0 (нажмите, чтобы скачать повторно или переустановить)"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors border cursor-pointer ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-700/40 text-emerald-300'
            }`}
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline text-[10px]">v18.0</span>
          </button>
        )}

        {/* Discreet AI Assistant Button: shown ONLY if assistantEnabled is true */}
        {assistantEnabled && (
          <button
            type="button"
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            title="Голосовой и текстовый ассистент Омега v8.0"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border cursor-pointer ${
              isAssistantOpen
                ? isLight
                  ? 'bg-purple-100 border-purple-400 text-purple-900 ring-1 ring-purple-300'
                  : 'bg-purple-950/70 border-purple-500/50 text-purple-200 ring-1 ring-purple-500/30'
                : isLight
                ? 'bg-slate-100 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700'
                : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-purple-500/30 text-slate-400 hover:text-purple-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-medium text-[11px] hidden sm:inline">
              Омега
            </span>
          </button>
        )}

        {isWebPage && onDeleteCurrentSite && (
          <button
            onClick={onDeleteCurrentSite}
            title="Говорю то, что этот сайт небезопасный — удалить сайт и заблокировать!"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/40'
                : isLight
                ? 'bg-slate-100 hover:bg-rose-600 text-slate-700 hover:text-white border border-slate-200 hover:border-rose-500'
                : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500 group-hover:text-white" />
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
            className={`flex items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            {quarantinedCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-500/20 text-rose-500 rounded-full border border-rose-500/40">
                {quarantinedCount}
              </span>
            )}
          </button>
        )}

        {/* Three Dots Browser Settings Button: "три точки в той самой полоске" */}
        <button
          type="button"
          data-settings-trigger="true"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          title="Настройки браузера (тема, ассистент Омега, версии)"
          className={`p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer border ${
            isSettingsOpen
              ? isLight
                ? 'bg-amber-100 border-amber-300 text-amber-900 ring-2 ring-amber-400/30'
                : 'bg-slate-800 border-amber-400/50 text-amber-400 ring-2 ring-amber-400/30'
              : isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700 hover:text-slate-900'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Browser Settings Dropdown Menu (Three Dots) */}
      <BrowserSettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={onToggleTheme || (() => {})}
        assistantEnabled={assistantEnabled}
        onToggleAssistant={(enabled) => {
          if (onToggleAssistant) onToggleAssistant(enabled);
          if (!enabled) setIsAssistantOpen(false);
        }}
        onOpenQuarantine={onOpenQuarantineList}
        onClearData={onClearData}
        isInstalled={isInstalled}
        onOpenInstall={onOpenInstall}
        onResetInstall={onResetInstall}
      />

      {/* Omega AI Assistant Popover */}
      {assistantEnabled && (
        <OmegaAssistant
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
          activeTab={activeTab}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
