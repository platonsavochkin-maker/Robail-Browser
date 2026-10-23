import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  HardDrive,
  Sparkles,
  Shield,
  Zap,
  RotateCcw,
  Laptop,
  FileCode,
  Play,
  AlertCircle,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallComplete: () => void;
  isInstalled: boolean;
  theme?: 'dark' | 'light';
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstallComplete,
  isInstalled,
  theme = 'dark',
}) => {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'installing' | 'completed'>(
    isInstalled ? 'completed' : 'idle'
  );
  const [progress, setProgress] = useState(isInstalled ? 100 : 0);
  const [statusText, setStatusText] = useState('Готов к запуску и установке Омеги v8.0');

  useEffect(() => {
    if (isInstalled) {
      setStatus('completed');
      setProgress(100);
      setStatusText('Браузер Robail v18.0 и Омега v8.0 готовы к работе');
    } else {
      setStatus('idle');
      setProgress(0);
      setStatusText('Готов к запуску и установке Омеги v8.0');
    }
  }, [isInstalled, isOpen]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  // Instant in-browser direct launch of Omega v8.0
  const handleLaunchOmegaDirectly = () => {
    onInstallComplete();
    onClose();
    // Dispatch custom event to immediately open Omega Assistant
    window.dispatchEvent(new CustomEvent('robail-open-omega'));
  };

  const triggerExeDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/api/download/robail-setup.exe';
      link.download = 'RobailBrowser-v18.0-Setup.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = '/api/download/robail-setup.exe';
    }
  };

  const triggerCmdDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/api/download/robail-setup.cmd';
      link.download = 'RobailBrowser-v18.0-Setup.cmd';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.location.href = '/api/download/robail-setup.cmd';
    }
  };

  const handleStartInstallation = (type: 'exe' | 'cmd' = 'cmd') => {
    setStatus('downloading');
    setProgress(25);
    setStatusText(
      type === 'exe'
        ? 'Загрузка RobailBrowser-v18.0-Setup.exe...'
        : 'Загрузка лаунчера RobailBrowser-v18.0-Setup.cmd (Без Microsoft Store)...'
    );

    if (type === 'exe') {
      triggerExeDownload();
    } else {
      triggerCmdDownload();
    }

    setTimeout(() => {
      setProgress(55);
      setStatusText('Настройка прямого запуска Омеги v8.0 в обход Microsoft Store...');
    }, 500);

    setTimeout(() => {
      setStatus('installing');
      setProgress(85);
      setStatusText('Подготовка ярлыка и новейшего ИИ-помощника Омега v8.0...');
    }, 1100);

    setTimeout(() => {
      setProgress(100);
      setStatus('completed');
      setStatusText('Готово! Запустите скачанный файл или нажмите «Запустить Омегу»!');
      onInstallComplete();
    }, 1700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-750 text-slate-100 ring-1 ring-amber-500/20'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black font-black text-sm shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Установка Robail & Омега</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Омега v8.0
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Браузер v18.0
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Прямой запуск без требований и ошибок Microsoft Store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Direct One-Click Launch Hero Button */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-3 ${
              isLight
                ? 'bg-purple-50 border-purple-200 text-purple-950'
                : 'bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border-purple-500/40 text-purple-100 ring-1 ring-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">Быстрый запуск Омеги v8.0</div>
                <div className="text-[11px] text-purple-300">
                  Работает прямо здесь — без скачивания и без Microsoft Store!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchOmegaDirectly}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Запустить Омегу v8.0 прямо сейчас ⚡</span>
            </button>
          </div>

          {/* Microsoft Store Bypass Notice Box */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
            }`}
          >
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-400">100% запуск БЕЗ Microsoft Store</div>
              <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Если Windows пишет «нужно что-то докачать в Microsoft Store», скачайте <strong>Лаунчер .CMD</strong> ниже. Он запускается на любом ПК без проверок магазина и сразу открывает Омегу v8.0!
              </p>
            </div>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-850'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-[11px]">ИИ Омега v8.0</div>
                <div className="text-[10px] text-slate-500">Самая новая версия</div>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-850'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-[11px]">Браузер v18.0</div>
                <div className="text-[10px] text-slate-500">Turbo YouTube + Shield</div>
              </div>
            </div>
          </div>

          {/* Installation Progress Area */}
          {(status === 'downloading' || status === 'installing' || status === 'completed') && (
            <div
              className={`p-4 rounded-xl border space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-2">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{statusText}</span>
                </span>
                <span className="font-mono text-purple-400 font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-purple-500 to-amber-400'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {status === 'completed' && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] text-emerald-400 font-medium">
                    ✓ Установщик успешно загружен! Запустите файл на компьютере — он откроет браузер и Омегу v8.0.
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartInstallation('cmd')}
                      className="text-[10px] text-sky-400 hover:text-sky-300 underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Скачать .CMD снова</span>
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => handleStartInstallation('exe')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
                    >
                      <HardDrive className="w-3 h-3" />
                      <span>Скачать .EXE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-t ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
          }`}
        >
          <div className="text-[11px] text-slate-500 font-mono">
            Омега v8.0 • Браузер v18.0
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Закрыть
            </button>

            {/* Direct CMD Launcher - recommended because it bypasses Microsoft Store */}
            <button
              type="button"
              disabled={status === 'downloading' || status === 'installing'}
              onClick={() => handleStartInstallation('cmd')}
              title="Скачать установщик-скрипт Windows (.CMD), который запускается без Microsoft Store"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" />
              <span>Скачать .CMD (Без Store)</span>
            </button>

            {/* EXE */}
            <button
              type="button"
              disabled={status === 'downloading' || status === 'installing'}
              onClick={() => handleStartInstallation('exe')}
              title="Скачать исполняемый файл .EXE"
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.EXE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
