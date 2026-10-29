import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  AlertTriangle,
  AppWindow,
  Monitor,
  ArrowRight,
  Info,
  FileCode,
  HardDrive,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallComplete: () => void;
  isInstalled: boolean;
  theme?: 'dark' | 'light';
  autoPrompted?: boolean;
  gamingModActive?: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstallComplete,
  isInstalled,
  theme = 'dark',
  autoPrompted = false,
  gamingModActive = false,
}) => {
  const { isInstallable, install, browserType, isIOS } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(true);
  const [showLegacyDownloads, setShowLegacyDownloads] = useState(false);
  const [installedStatus, setInstalledStatus] = useState(isInstalled);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  useEffect(() => {
    setInstalledStatus(isInstalled);
  }, [isInstalled]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  const handleInstallAppClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledStatus(true);
        onInstallComplete();
      }
    } else {
      setShowGuide(true);
    }
  };

  const handleConfirmInstalled = () => {
    setInstalledStatus(true);
    onInstallComplete();
    onClose();
  };

  const triggerExeDownload = () => {
    setDownloadMsg('Загрузка .EXE файла (с предупреждением о Microsoft Store)...');
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
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  const triggerCmdDownload = () => {
    setDownloadMsg('Загрузка лаунчера .CMD (Без проверок Microsoft Store)...');
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
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col my-auto ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-750 text-slate-100 ring-1 ring-amber-500/25'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {gamingModActive ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/60 border border-red-500/40 p-0.5 flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                <img
                  src="/rbl_gx_logo.png"
                  alt="Robail Logo"
                  className="w-full h-full object-contain rounded-lg select-none"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/30 text-white shrink-0">
                <Globe className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base">
                  {gamingModActive ? 'Установка RBL GX Browser' : 'Установка Robile Browser'}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  v18.0
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Омега v8.0
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {autoPrompted
                  ? 'Добро пожаловать! Установите браузер на свой рабочий стол'
                  : 'Официальный мастер установки автономного приложения'}
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
            title="Закрыть окно (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* CRITICAL WARNING BOX: EXE installer has issues */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-sm ${
              isLight
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/50 border-amber-500/40 text-amber-200 ring-1 ring-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs space-y-1.5">
              <div className="font-bold text-amber-300 text-[13px] flex items-center gap-1.5">
                <span>Внимание: с файлом .EXE есть неполадки</span>
              </div>
              <p className={`leading-relaxed text-[11px] ${isLight ? 'text-amber-900' : 'text-slate-300'}`}>
                При попытке запуска обычного установщика <strong>.exe</strong> в Windows могут возникать ошибки: система требует <em>«докачать что-то в Microsoft Store»</em>, SmartScreen или антивирус блокируют файл, либо установщик не запускается.
              </p>
              <div className="pt-0.5 font-medium text-emerald-400 text-[11px]">
                👉 <strong>Решение разработчика:</strong> используйте официальную встроенную функцию браузера — <strong>«Установить как приложение»</strong>. Это работает на 100% стабильно прямо сейчас без Microsoft Store!
              </div>
            </div>
          </div>

          {/* PRIMARY RECOMMENDED ACTION: Install as Browser Application */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col gap-3.5 shadow-md ${
              isLight
                ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 text-indigo-950'
                : 'bg-gradient-to-br from-purple-950/60 via-indigo-950/40 to-slate-900 border-purple-500/50 text-white ring-1 ring-purple-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
                  <AppWindow className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <span>Установить как приложение</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Рекомендуется
                    </span>
                  </div>
                  <div className="text-xs text-purple-200/90 mt-0.5">
                    Встраивается в Windows и ваш браузер: ярлык на Рабочем столе и в Пуске
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleInstallAppClick}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Monitor className="w-4 h-4" />
                <span>⚡ Установить Robail как приложение</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmInstalled}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                title="Отметить установку завершённой и запустить браузер"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Уже установил / Запустить</span>
              </button>
            </div>

            {/* Quick Step-by-step visual instruction */}
            <div className="pt-2 border-t border-purple-500/30 text-xs space-y-2">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center justify-between w-full text-left font-semibold text-purple-200 hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-purple-400" />
                  <span>Инструкция по установке в 1 клик для вашего браузера:</span>
                </span>
                {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showGuide && (
                <div
                  className={`p-3 rounded-xl border text-[11px] leading-relaxed space-y-2 ${
                    isLight
                      ? 'bg-white/80 border-indigo-200 text-slate-700'
                      : 'bg-black/40 border-purple-900/60 text-slate-300'
                  }`}
                >
                  {browserType === 'edge' ? (
                    <div>
                      <span className="font-bold text-white">В Microsoft Edge:</span> Нажмите на значок{' '}
                      <strong>«Доступно приложение» ⊞</strong> в строке адреса справа или нажмите меню <strong>(···) ➔ «Приложения» ➔ «Установить этот сайт как приложение»</strong>.
                    </div>
                  ) : browserType === 'yandex' ? (
                    <div>
                      <span className="font-bold text-white">В Яндекс Браузере:</span> Нажмите на кнопку меню <strong>(≡) ➔ «Дополнительно» ➔ «Установить приложение Robail»</strong>.
                    </div>
                  ) : isIOS ? (
                    <div>
                      <span className="font-bold text-white">На iPhone/iPad (Safari):</span> Нажмите кнопку <strong>«Поделиться»</strong> внизу ➔ выберите <strong>«На экран Домой»</strong>.
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-white">В Google Chrome / Любом браузере:</span>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                        <li>
                          Нажмите иконку <strong>«Установить приложение» 🖥️</strong> в правом углу адресной строки, либо
                        </li>
                        <li>
                          Откройте меню Chrome (три точки ⋮) ➔ <strong>«Сохранить и поделиться» ➔ «Установить Robail Browser...»</strong>.
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="text-[10px] text-amber-400 pt-1 font-medium">
                    ✓ Приложение появится на рабочем столе и будет запускаться как отдельная быстрая программа без Microsoft Store!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-850'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-[11px]">ИИ Омега v8.0</div>
                <div className="text-[10px] text-slate-500">Голос + новейший интеллект</div>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-850'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-[11px]">Robail Browser v18.0</div>
                <div className="text-[10px] text-slate-500">Turbo YouTube + Omegle</div>
              </div>
            </div>
          </div>

          {/* Download message feedback */}
          {downloadMsg && (
            <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>{downloadMsg}</span>
            </div>
          )}

          {/* Collapsible Legacy Files Section (.CMD and .EXE) with clear caveats */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowLegacyDownloads(!showLegacyDownloads)}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Запасные варианты файлов (лабораторные .CMD и .EXE)</span>
              {showLegacyDownloads ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showLegacyDownloads && (
              <div
                className={`mt-2 p-3.5 rounded-xl border space-y-2.5 text-xs animate-in fade-in duration-150 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="text-[11px] text-slate-400">
                  Если вы всё равно хотите скачать файл на диск, воспользуйтесь скриптом <strong>.CMD</strong> (он обходит Microsoft Store) или <strong>.EXE</strong>:
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* CMD */}
                  <button
                    type="button"
                    onClick={triggerCmdDownload}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Скачать Лаунчер .CMD (Без Store)</span>
                  </button>

                  {/* EXE */}
                  <button
                    type="button"
                    onClick={triggerExeDownload}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Внимание: может требовать компоненты Microsoft Store на Windows"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Скачать .EXE (Может сбоить)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3.5 flex items-center justify-between border-t ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="text-[11px] text-slate-500 font-mono">
            {installedStatus ? '✓ Приложение установлено' : 'Robail v18.0 • PWA'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {installedStatus ? 'Закрыть' : 'Напомнить позже'}
            </button>

            <button
              type="button"
              onClick={handleConfirmInstalled}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Продолжить в браузере</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
