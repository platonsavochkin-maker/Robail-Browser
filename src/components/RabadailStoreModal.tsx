import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Shield,
  Gamepad2,
  Check,
  Star,
  Download,
  Sparkles,
  Zap,
  Volume2,
  Palette,
  CheckCircle2,
  FastForward,
} from 'lucide-react';

interface RabadailStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  uBlockInstalled: boolean;
  onToggleUBlockInstall: (installed: boolean) => void;
  sponsorBlockInstalled?: boolean;
  onToggleSponsorBlockInstall?: (installed: boolean) => void;
  gamingModActive: boolean;
  onToggleGamingMod: (active: boolean) => void;
  gamingColor: string;
  onChangeGamingColor: (color: string) => void;
  theme?: 'dark' | 'light';
}

export const RabadailStoreModal: React.FC<RabadailStoreModalProps> = ({
  isOpen,
  onClose,
  uBlockInstalled,
  onToggleUBlockInstall,
  sponsorBlockInstalled = false,
  onToggleSponsorBlockInstall,
  gamingModActive,
  onToggleGamingMod,
  gamingColor,
  onChangeGamingColor,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'extensions' | 'mods'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isLight = theme === 'light' && !gamingModActive;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col my-auto max-h-[90vh] ${
          gamingModActive
            ? 'bg-[#090a0f] border-red-500/40 text-white ring-1 ring-red-500/30'
            : isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-750 text-slate-100 ring-1 ring-purple-500/20'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            gamingModActive
              ? 'bg-[#0d0e15] border-red-950/60'
              : isLight
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                gamingModActive
                  ? 'bg-gradient-to-tr from-red-600 to-rose-400 text-white shadow-red-600/30'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Магазин Rabadail</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Store v18.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Официальные расширения и моды для браузера Robail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Закрыть магазин (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar Filters */}
        <div
          className={`px-6 py-3 border-b flex items-center justify-between gap-2 overflow-x-auto ${
            gamingModActive
              ? 'bg-[#0c0d12] border-red-950/50'
              : isLight
              ? 'bg-slate-100/60 border-slate-200'
              : 'bg-slate-950/40 border-slate-850'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? gamingModActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Все товары
            </button>
            <button
              onClick={() => setActiveTab('extensions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'extensions'
                  ? gamingModActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Расширения (Shield & SponsorBlock)</span>
            </button>
            <button
              onClick={() => setActiveTab('mods')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'mods'
                  ? gamingModActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Моды (RBL GX)</span>
            </button>
          </div>

          {notification && (
            <div className="text-xs px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse font-semibold">
              ✓ {notification}
            </div>
          )}
        </div>

        {/* Catalog Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. EXTENSION: Robail Shield AdBlock */}
          {(activeTab === 'all' || activeTab === 'extensions') && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                gamingModActive
                  ? 'bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-950 border-red-500/30'
                  : isLight
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-950 border-rose-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-rose-600/30 shrink-0">
                    RS
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-white">Robail Shield</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        Фирменный AdBlock для Robail
                      </span>
                      <span className="flex items-center text-amber-400 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 inline mr-0.5" /> 4.9 (1.4M+)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      Фирменный блокировщик рекламы Robail Shield! <strong>Реально блокирует баннеры</strong>, всплывающие окна, рекламные трекеры и видео-вставки на посещаемых сайтах через встроенный прокси-движок.
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Реальное удаление рекламы</span>
                      </span>
                      <span>•</span>
                      <span>Фильтры: Robail Engine, RU AdList</span>
                      <span>•</span>
                      <span>Счётчик заблокированных элементов</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !uBlockInstalled;
                      onToggleUBlockInstall(next);
                      showToast(next ? 'Robail Shield установлен и активирован!' : 'Robail Shield удалён');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      uBlockInstalled
                        ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40'
                        : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-rose-600/30'
                    }`}
                  >
                    {uBlockInstalled ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Установлено (Активно)</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Скачать Robail Shield</span>
                      </>
                    )}
                  </button>

                  {uBlockInstalled && (
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Значок RS активен в верхней панели
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. EXTENSION: Robail SponsorBlock */}
          {(activeTab === 'all' || activeTab === 'extensions') && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                gamingModActive
                  ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 border-emerald-500/30'
                  : isLight
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 border-emerald-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30 shrink-0">
                    SB
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-white">Robail SponsorBlock</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Пропуск спонсорских вставок
                      </span>
                      <span className="flex items-center text-amber-400 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 inline mr-0.5" /> 4.9 (820K+)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      Умное расширение для пропуска <strong>спонсорских интеграций</strong>, саморекламы каналов, долгих приветствий и просьб подписаться в видеороликах на YouTube!
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Автопропуск интеграций в YouTube</span>
                      </span>
                      <span>•</span>
                      <span>Сегменты: Интеграции, интро, аутро</span>
                      <span>•</span>
                      <span>Экономит до 15% времени просмотра</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !sponsorBlockInstalled;
                      if (onToggleSponsorBlockInstall) {
                        onToggleSponsorBlockInstall(next);
                      }
                      showToast(next ? 'Robail SponsorBlock установлен и активирован!' : 'Robail SponsorBlock удалён');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      sponsorBlockInstalled
                        ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30'
                    }`}
                  >
                    {sponsorBlockInstalled ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Установлено (Активно)</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Скачать SponsorBlock</span>
                      </>
                    )}
                  </button>

                  {sponsorBlockInstalled && (
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Активен в YouTube Turbo и плеере
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. MOD: RBL GX («Для геймеров») */}
          {(activeTab === 'all' || activeTab === 'mods') && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                gamingModActive
                  ? 'bg-gradient-to-r from-red-950/40 via-red-900/20 to-black border-red-500 ring-2 ring-red-500/40'
                  : isLight
                  ? 'bg-indigo-50/50 border-indigo-200'
                  : 'bg-gradient-to-r from-indigo-950/20 via-slate-900 to-slate-950 border-indigo-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-red-500/50 p-1 bg-black/60 flex items-center justify-center">
                    <img
                      src="/rbl_gx_logo.png"
                      alt="RBL GX Logo"
                      className="w-full h-full object-contain rounded-xl select-none drop-shadow-md"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-white">RBL GX</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                        Мод для геймеров
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        RBL GX
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                      Специальный мод, созданный <strong>для геймеров</strong>: трансформирует весь интерфейс браузера в брутальный чистый кибер-дизайн <strong>RBL GX</strong> (стильный минимализм, компактные плитки игр и неоновая подсветка).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px] text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-red-400" />
                        <span>Компактный игровой Hotbar (Twitch, Steam, Roblox)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Неоновая подсветка и скошенные вкладки RBL GX</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FastForward className="w-3.5 h-3.5 text-amber-400" />
                        <span>Очищенный быстрый Speed Dial без мусора</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Игровые кибер-звуки интерфейса</span>
                      </div>
                    </div>

                    {/* Color Accent Picker */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Цвет неоновой подсветки:</span>
                      <div className="flex items-center gap-1.5">
                        {[
                          { id: '#ff003c', name: 'Cyber Red' },
                          { id: '#a855f7', name: 'Neon Purple' },
                          { id: '#00f0ff', name: 'Cyber Cyan' },
                          { id: '#10b981', name: 'Toxic Green' },
                          { id: '#f59e0b', name: 'Gold Flame' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              onChangeGamingColor(c.id);
                              if (!gamingModActive) onToggleGamingMod(true);
                              showToast(`Выбран цвет подсветки: ${c.name}`);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                              gamingColor === c.id ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                            }`}
                            style={{ backgroundColor: c.id }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !gamingModActive;
                      onToggleGamingMod(next);
                      showToast(next ? 'Мод RBL GX активирован!' : 'Мод RBL GX выключен');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      gamingModActive
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40'
                        : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-600/30'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>{gamingModActive ? '✓ Мод RBL GX включен' : 'Включить RBL GX'}</span>
                  </button>

                  <span className="text-[10px] text-slate-400">
                    {gamingModActive ? 'Стиль: RBL GX Cyber Stealth' : 'Переключение в 1 клик'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Bonus Extension: Dark Mode Pro */}
          {(activeTab === 'all' || activeTab === 'extensions') && (
            <div
              className={`p-4 rounded-2xl border ${
                gamingModActive
                  ? 'bg-slate-950/60 border-slate-800'
                  : isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-950/60 border-slate-855'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">Dark Mode Pro</div>
                    <div className="text-[11px] text-slate-400">
                      Интеллектуальное включение тёмной темы для всех открываемых сайтов
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                  Встроено в Robail
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-t ${
            gamingModActive
              ? 'bg-[#0d0e15] border-red-950/60'
              : isLight
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="text-xs text-slate-400">
            {uBlockInstalled && sponsorBlockInstalled && gamingModActive
              ? '✓ Robail Shield, SponsorBlock и RBL GX активны'
              : uBlockInstalled && gamingModActive
              ? '✓ Robail Shield и RBL GX активны'
              : uBlockInstalled
              ? '✓ Robail Shield активен'
              : gamingModActive
              ? '✓ RBL GX активен'
              : 'Магазин Rabadail • Безопасные расширения'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gamingModActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
            }`}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
