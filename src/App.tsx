import React, { useState, useEffect } from 'react';
import {
  LockOpen,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
  AlertTriangle,
  Plus,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Tab, QuarantinedSite } from './types/browser';
import {
  createNewTab,
  parseInputUrl,
  checkDomainSecurity,
  getQuarantinedDomains,
  quarantineDomain,
  unquarantineDomain,
} from './utils/browserUtils';
import { TabBar } from './components/TabBar';
import { Omnibar } from './components/Omnibar';
import { StartPage } from './components/StartPage';
import { YouTubeView } from './components/sites/YouTubeView';
import { ArcadeGames } from './components/ArcadeGames';

export default function App() {
  const [quarantinedDomains, setQuarantinedDomains] = useState<string[]>(() => {
    const list = getQuarantinedDomains();
    return list.filter((d) => d !== 'dementor.ru');
  });

  const [tabYouTubeModes, setTabYouTubeModes] = useState<Record<string, 'turbo' | 'proxy'>>({});

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('robail_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [assistantEnabled, setAssistantEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('robail_assistant_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleToggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('robail_theme', newTheme);
    } catch {}
  };

  const handleToggleAssistant = (enabled: boolean) => {
    setAssistantEnabled(enabled);
    try {
      localStorage.setItem('robail_assistant_enabled', String(enabled));
    } catch {}
  };

  const handleClearBrowsingData = () => {
    try {
      localStorage.removeItem('robail_history');
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? t : createNewTab('robail://start')))
      );
    } catch {}
  };

  const [autoDeleteUnsafe, setAutoDeleteUnsafe] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('robail_auto_delete_unsafe');
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  // Ensure any leftover dementor.ru is wiped from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('robail_quarantined_domains');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.includes('dementor.ru')) {
          const cleaned = parsed.filter((d) => d !== 'dementor.ru');
          localStorage.setItem('robail_quarantined_domains', JSON.stringify(cleaned));
          setQuarantinedDomains(cleaned);
        }
      }
    } catch {}
  }, []);

  const [notification, setNotification] = useState<{
    domain: string;
    reason: string;
    timestamp: number;
  } | null>(null);

  const [showQuarantineModal, setShowQuarantineModal] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');

  const [tabs, setTabs] = useState<Tab[]>(() => [createNewTab('robail://start')]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Auto-dismiss notification after 7 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [notification]);

  // Listen to postMessage from proxy iframes when navigating or clicking links
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'robail-frame') {
        if (event.data.type === 'page-loaded' && event.data.title) {
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId
                ? { ...t, title: event.data.title, isLoading: false }
                : t
            )
          );
        } else if (event.data.type === 'url-changed' && event.data.url) {
          const newUrl = event.data.url;
          const security = checkDomainSecurity(newUrl, quarantinedDomains);
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id !== activeTabId) return t;
              const newHist = [...t.history.slice(0, t.historyIndex + 1), newUrl];
              return {
                ...t,
                url: newUrl,
                history: newHist,
                historyIndex: newHist.length - 1,
                isLoading: false,
                security,
              };
            })
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeTabId, quarantinedDomains]);

  // Keyboard Shortcuts: Ctrl+T, Ctrl+W
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleNewTab();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (tabs.length > 1) {
          handleCloseTab(activeTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTabId]);

  // Delete Site Action: Purges the website, adds it to quarantine, and removes the tab
  const handleDeleteSite = (urlOrDomain?: string, customReason?: string) => {
    const target = urlOrDomain || activeTab.url;
    if (!target || target === 'robail://start') return;

    let domain = target;
    try {
      const parsed = new URL(target.startsWith('http') ? target : `https://${target}`);
      domain = parsed.hostname.replace(/^\.+|\.+$/g, '').toLowerCase();
    } catch {
      domain = target.replace(/^\.+|\.+$/g, '').toLowerCase();
    }

    if (!domain || domain === 'localhost' || domain === '127.0.0.1') return;

    // Permanently quarantine domain
    quarantineDomain(domain);
    const updated = getQuarantinedDomains();
    setQuarantinedDomains(updated);

    const reason =
      customReason ||
      'Пользователь сообщил, что данный сайт небезопасный. Сайт удалён и заблокирован.';

    // Show deletion toast
    setNotification({
      domain,
      reason,
      timestamp: Date.now(),
    });

    // Close the current tab or navigate back to start page
    if (tabs.length > 1) {
      handleCloseTab(activeTabId);
    } else {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: 'robail://start',
                title: 'Новая вкладка',
                mode: 'start',
                isLoading: false,
                history: ['robail://start'],
                historyIndex: 0,
                security: checkDomainSecurity('robail://start', updated),
              }
            : t
        )
      );
    }
  };

  // Automatic scanner & deletion of dangerous sites (viruses, pirated, or quarantined)
  useEffect(() => {
    if (activeTab.mode === 'start' || !activeTab.url || activeTab.url === 'robail://start') {
      return;
    }

    const sec = activeTab.security;
    const isThreat =
      sec.isDangerous ||
      sec.threatType === 'virus' ||
      sec.threatType === 'pirate' ||
      sec.threatType === 'blocked_domain';

    if (autoDeleteUnsafe && isThreat) {
      const threatLabel =
        sec.threatType === 'virus'
          ? 'Обнаружен вирус / вредоносный код'
          : sec.threatType === 'pirate'
          ? 'Обнаружен пиратский нелегальный сайт'
          : 'Сайт в черном списке небезопасных ресурсов';

      // Auto-delete unsafe site immediately
      handleDeleteSite(activeTab.url, `Автоматическая защита Robail: ${threatLabel}`);
    }
  }, [activeTab.url, activeTab.security, autoDeleteUnsafe]);

  // Navigation Handler
  const handleNavigate = (input: string) => {
    const parsed = parseInputUrl(input, quarantinedDomains);
    const security = checkDomainSecurity(parsed.url, quarantinedDomains);

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), parsed.url];
        return {
          ...tab,
          title: parsed.title,
          url: parsed.url,
          mode: parsed.url === 'robail://start' ? 'start' : 'web',
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: parsed.url !== 'robail://start',
          security,
        };
      })
    );
  };

  const handleBack = () => {
    if (activeTab.historyIndex <= 0) return;
    const newIndex = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[newIndex];
    const parsed = parseInputUrl(prevUrl, quarantinedDomains);
    const security = checkDomainSecurity(prevUrl, quarantinedDomains);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: prevUrl,
              title: parsed.title,
              mode: prevUrl === 'robail://start' ? 'start' : 'web',
              historyIndex: newIndex,
              isLoading: prevUrl !== 'robail://start',
              security,
            }
          : t
      )
    );
  };

  const handleForward = () => {
    if (activeTab.historyIndex >= activeTab.history.length - 1) return;
    const newIndex = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[newIndex];
    const parsed = parseInputUrl(nextUrl, quarantinedDomains);
    const security = checkDomainSecurity(nextUrl, quarantinedDomains);

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: nextUrl,
              title: parsed.title,
              mode: nextUrl === 'robail://start' ? 'start' : 'web',
              historyIndex: newIndex,
              isLoading: nextUrl !== 'robail://start',
              security,
            }
          : t
      )
    );
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 400);
  };

  const handleHome = () => {
    handleNavigate('robail://start');
  };

  const handleNewTab = () => {
    const newTab = createNewTab('robail://start');
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (idToClose: string) => {
    if (tabs.length <= 1) {
      handleHome();
      return;
    }
    const index = tabs.findIndex((t) => t.id === idToClose);
    const newTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(newTabs);

    if (activeTabId === idToClose) {
      const nextActive = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  const handleAddCustomQuarantine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    const d = newDomainInput.trim().toLowerCase().replace(/^\.+|\.+$/g, '');
    quarantineDomain(d);
    setQuarantinedDomains(getQuarantinedDomains());
    setNewDomainInput('');
  };

  const handleRemoveQuarantine = (domainToRemove: string) => {
    unquarantineDomain(domainToRemove);
    const updated = quarantinedDomains.filter((d) => d !== domainToRemove);
    setQuarantinedDomains(updated);
  };

  const isCurrentUrlBlocked = quarantinedDomains.some(
    (b) =>
      b &&
      (activeTab.url.toLowerCase().includes(b) ||
        activeTab.security.hostname === b ||
        activeTab.security.hostname.endsWith('.' + b))
  );

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden select-none font-sans relative transition-colors ${
        theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Notification Toast when a site is deleted */}
      {notification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 max-w-xl w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 text-slate-100 ring-4 ring-rose-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-rose-400 tracking-wider">
                    Сайт удалён
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 bg-slate-950 border border-rose-900 rounded text-rose-300">
                    {notification.domain}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                  {notification.reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Tabs Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        theme={theme}
      />

      {/* Omnibar with Site Deletion Control and Corner Lock */}
      <Omnibar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onHome={handleHome}
        onDeleteCurrentSite={() => handleDeleteSite(activeTab.url)}
        onOpenQuarantineList={() => setShowQuarantineModal(true)}
        quarantinedCount={quarantinedDomains.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        assistantEnabled={assistantEnabled}
        onToggleAssistant={handleToggleAssistant}
        onClearData={handleClearBrowsingData}
      />

      {/* Main Browser Canvas */}
      <div
        className={`flex-1 w-full h-full relative overflow-hidden flex flex-col transition-colors ${
          theme === 'light' ? 'bg-slate-100' : 'bg-slate-900'
        }`}
      >
        {activeTab.mode === 'start' ? (
          <StartPage onNavigate={handleNavigate} theme={theme} />
        ) : activeTab.url === 'robail://clan' || activeTab.url === 'robail://arcade' ? (
          <ArcadeGames initialGame="clan" />
        ) : isCurrentUrlBlocked ? (
          /* Quarantine / Deleted Site Alert Screen */
          <div className="w-full h-full flex items-center justify-center bg-slate-950 p-6 select-none">
            <div className="max-w-lg w-full bg-slate-900 border border-rose-900/60 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600" />
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Сайт заблокирован и удалён
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-rose-900/60 rounded-md text-rose-400 font-mono text-xs mb-4">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeTab.security.hostname || activeTab.url}</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {activeTab.security.reason ||
                  'Данный сайт заблокирован и удалён из браузера по вашему запросу.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleHome}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-colors"
                >
                  На главную
                </button>
                <button
                  onClick={() => handleRemoveQuarantine(activeTab.security.hostname)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Разблокировать сайт</span>
                </button>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                ROBAIL_SHIELD_SECURITY / USER_BLOCKED_HOST
              </div>
            </div>
          </div>
        ) : activeTab.url.includes('youtube.com') || activeTab.url.includes('youtu.be') ? (
          (tabYouTubeModes[activeTab.id] ?? 'turbo') === 'turbo' ? (
            <YouTubeView
              url={activeTab.url}
              onNavigate={handleNavigate}
              onSwitchToWebProxy={() =>
                setTabYouTubeModes((prev) => ({ ...prev, [activeTab.id]: 'proxy' }))
              }
            />
          ) : (
            <div className="w-full h-full relative bg-[#0f0f0f] flex flex-col">
              <div className="h-9 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between text-xs text-neutral-300 z-10 flex-shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold text-white">Веб-прокси YouTube</span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {activeTab.url}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setTabYouTubeModes((prev) => ({
                        ...prev,
                        [activeTab.id]: 'turbo',
                      }))
                    }
                    className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg font-bold text-[11px] transition-all shadow-md"
                  >
                    <span>⚡ Включить Turbo YouTube (Мгновенно)</span>
                  </button>
                  <a
                    href={activeTab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-[11px] font-semibold transition-colors border border-neutral-700"
                  >
                    <span>Открыть на youtube.com ↗</span>
                  </a>
                </div>
              </div>
              <iframe
                key={activeTab.url}
                src={`/api/proxy?url=${encodeURIComponent(activeTab.url)}`}
                title={activeTab.title}
                className="w-full flex-1 border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => {
                  setTabs((prev) =>
                    prev.map((t) =>
                      t.id === activeTabId ? { ...t, isLoading: false } : t
                    )
                  );
                }}
              />
            </div>
          )
        ) : (
          <div className="w-full h-full relative bg-slate-900 flex flex-col">
            {activeTab.url.includes('steampowered.com') && (
              <div className="h-9 bg-[#171a21] border-b border-[#2a475e] px-4 flex items-center justify-between text-xs text-neutral-300 z-10 flex-shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="font-bold text-white">Магазин Steam</span>
                  <span className="text-[11px] text-sky-300 font-mono hidden sm:inline">
                    Картинки и трейлеры оптимизированы
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#2a475e] hover:bg-[#66c0f4] hover:text-black text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    <span>GTA 5 в Steam ↗</span>
                  </a>
                </div>
              </div>
            )}
            <iframe
              key={activeTab.url}
              src={`/api/proxy?url=${encodeURIComponent(activeTab.url)}`}
              title={activeTab.title}
              className="w-full flex-1 border-none"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => {
                setTabs((prev) =>
                  prev.map((t) =>
                    t.id === activeTabId ? { ...t, isLoading: false } : t
                  )
                );
              }}
            />
          </div>
        )}
      </div>

      {/* Quarantined Sites & Safety Registry Modal */}
      {showQuarantineModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 max-w-lg w-full rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Реестр защиты и удалённых сайтов
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Управление заблокированными сайтами, антивирусом и защитой от пиратства
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuarantineModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Delete Toggle */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Автоматическое удаление опасных сайтов
                </span>
                <span className="text-[10px] text-slate-400">
                  Мгновенно закрывать вкладку и удалять пиратские сайты и ресурсы с вирусами
                </span>
              </div>
              <button
                onClick={() => {
                  const nextVal = !autoDeleteUnsafe;
                  setAutoDeleteUnsafe(nextVal);
                  localStorage.setItem('robail_auto_delete_unsafe', String(nextVal));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  autoDeleteUnsafe
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-850 text-slate-400'
                }`}
              >
                {autoDeleteUnsafe ? 'Включено' : 'Выключено'}
              </button>
            </div>

            {/* Add Custom Unsafe Domain */}
            <form onSubmit={handleAddCustomQuarantine} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                placeholder="Добавить небезопасный сайт (например, badsite.com)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Удалить</span>
              </button>
            </form>

            {/* List of Blocked / Deleted Domains */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Удалённые и заблокированные адреса ({quarantinedDomains.length}):
              </span>
              {quarantinedDomains.length === 0 ? (
                <div className="py-6 px-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-semibold text-slate-200">Ни одного сайта не заблокировано</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    Список блокировщика пуст. Вы можете удалить и заблокировать любой сайт по своему желанию.
                  </p>
                </div>
              ) : (
                quarantinedDomains.map((dom) => (
                  <div
                    key={dom}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-rose-300">{dom}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveQuarantine(dom)}
                      className="text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-800 rounded flex items-center gap-1 transition-colors text-[11px] font-sans"
                      title="Разблокировать и восстановить сайт"
                    >
                      <RotateCcw className="w-3 h-3 text-emerald-400" />
                      <span>Восстановить</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
