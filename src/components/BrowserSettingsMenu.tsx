import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Moon,
  Sun,
  Bot,
  Sparkles,
  Shield,
  Trash2,
  Check,
  Info,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
} from 'lucide-react';

interface BrowserSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (theme: 'dark' | 'light') => void;
  assistantEnabled: boolean;
  onToggleAssistant: (enabled: boolean) => void;
  onOpenQuarantine?: () => void;
  onClearData?: () => void;
}

export const BrowserSettingsMenu: React.FC<BrowserSettingsMenuProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  assistantEnabled,
  onToggleAssistant,
  onOpenQuarantine,
  onClearData,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showStory, setShowStory] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // Check if the click was on the trigger button
        const trigger = (e.target as HTMLElement).closest('[data-settings-trigger="true"]');
        if (!trigger) {
          onClose();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const handleClear = () => {
    if (onClearData) {
      onClearData();
    }
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-11 right-3 z-50 w-84 max-w-[calc(100vw-1.5rem)] rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none ${
        isLight
          ? 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800 ring-1 ring-slate-900/5'
          : 'bg-slate-900/95 backdrop-blur-xl border-slate-750 text-slate-100 ring-1 ring-purple-500/20 shadow-purple-950/20'
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
              isLight ? 'bg-amber-500 text-black' : 'bg-amber-400 text-black'
            }`}
          >
            R
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight">Настройки браузера</h3>
            <span
              className={`text-[10px] font-mono ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Robail Browser v16.0
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/70'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Закрыть настройки (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
        {/* 1. Theme Switch: Dark (Black) vs Light (White) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Тема оформления</span>
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isLight
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isLight ? 'Светлая (Белая)' : 'Тёмная (Чёрная)'}
            </span>
          </div>

          <div
            className={`grid grid-cols-2 p-1 rounded-xl border gap-1 ${
              isLight
                ? 'bg-slate-100 border-slate-200'
                : 'bg-slate-950 border-slate-800'
            }`}
          >
            {/* Dark Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('dark')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                !isLight
                  ? 'bg-slate-850 text-white shadow-md border border-slate-700 ring-1 ring-amber-400/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Тёмная</span>
              {!isLight && <Check className="w-3.5 h-3.5 text-amber-400 ml-auto" />}
            </button>

            {/* Light Theme Button */}
            <button
              type="button"
              onClick={() => onToggleTheme('light')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                isLight
                  ? 'bg-white text-slate-900 shadow-md border border-slate-300 ring-1 ring-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Белая</span>
              {isLight && <Check className="w-3.5 h-3.5 text-amber-600 ml-auto" />}
            </button>
          </div>
        </div>

        {/* 2. Omega Assistant Toggle: Enable / Disable */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            assistantEnabled
              ? isLight
                ? 'bg-purple-50/70 border-purple-200'
                : 'bg-purple-950/20 border-purple-800/40'
              : isLight
              ? 'bg-slate-100/70 border-slate-200 opacity-80'
              : 'bg-slate-950/60 border-slate-800 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  assistantEnabled
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md'
                    : isLight
                    ? 'bg-slate-300 text-slate-600'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">ИИ-ассистент Омега</span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${
                      assistantEnabled
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-slate-700/40 text-slate-400 border-slate-600/30'
                    }`}
                  >
                    v6.0
                  </span>
                </div>
                <p
                  className={`text-[10px] ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {assistantEnabled
                    ? 'Голосовой и текстовый помощник включён'
                    : 'Ассистент полностью выключен'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={assistantEnabled}
              onClick={() => onToggleAssistant(!assistantEnabled)}
              title={assistantEnabled ? 'Выключить Омегу' : 'Включить Омегу'}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                assistantEnabled ? 'bg-purple-600' : isLight ? 'bg-slate-300' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  assistantEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="mt-2 text-[10px] leading-tight">
            {assistantEnabled ? (
              <span className={isLight ? 'text-purple-700 font-medium' : 'text-purple-300 font-medium'}>
                ✓ Кнопка Омеги активна в полоске браузера. Доступны ответы, голос и открытие сайтов.
              </span>
            ) : (
              <span className="text-slate-400">
                Кнопка Омеги скрыта из полоски браузера. Вы можете снова включить ассистента здесь в любой момент.
              </span>
            )}
          </div>
        </div>

        {/* 3. System Versions & Browser Origin Story */}
        <div
          className={`p-3 rounded-xl border ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Информация о версиях:</span>
            </span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-300/40 dark:border-slate-800">
              <span className="text-slate-500 font-sans">Браузер:</span>
              <span className="font-bold text-amber-500 font-mono">Robail v16.0</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-sans">ИИ-ассистент:</span>
              <span className="font-bold text-purple-400 font-mono">Омега v6.0</span>
            </div>
          </div>

          {/* History Collapsible */}
          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowStory(!showStory)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                isLight
                  ? 'bg-amber-100/60 hover:bg-amber-100 text-amber-900'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>История создания браузера</span>
              </div>
              {showStory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showStory && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-[11px] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150 ${
                  isLight
                    ? 'bg-white border border-amber-200 text-slate-700 shadow-xs'
                    : 'bg-slate-900 border border-amber-500/30 text-amber-200/90'
                }`}
              >
                <p className="font-sans">
                  «Когда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. <strong>Браузер Robail!</strong>»
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Quick Actions */}
        <div className="space-y-1.5 pt-1">
          {onOpenQuarantine && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuarantine();
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-750'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Реестр защиты и заблокированных сайтов</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClear}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border ${
              isLight
                ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 border-slate-200'
                : 'bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/50 text-slate-300 border-slate-750'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{clearedNotice ? 'Данные очищены ✓' : 'Очистить историю и кэш'}</span>
            </div>
            {clearedNotice && (
              <span className="text-[10px] text-emerald-500 font-bold">Очищено!</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
