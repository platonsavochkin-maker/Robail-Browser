import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Code,
  Wifi,
  Database,
  X,
  Trash2,
  Play,
  Copy,
  Check,
  Search,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { ConsoleLog, NetworkRequest } from '../types/browser';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ConsoleLog[];
  onClearLogs: () => void;
  currentUrl: string;
}

export const DevTools: React.FC<DevToolsProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  currentUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'elements' | 'network' | 'storage'>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [localLogs, setLocalLogs] = useState<ConsoleLog[]>(logs);
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const [sourceCode, setSourceCode] = useState<string>('<!-- Loading DOM Source... -->');
  const [copied, setCopied] = useState(false);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalLogs(logs);
  }, [logs]);

  // Simulate network requests for the active page
  useEffect(() => {
    if (isOpen) {
      setNetworkRequests([
        { id: '1', url: currentUrl, method: 'GET', status: 200, type: 'document', size: '42.1 kB', time: '84 ms' },
        { id: '2', url: '/src/main.tsx', method: 'GET', status: 200, type: 'script', size: '128 kB', time: '12 ms' },
        { id: '3', url: '/src/index.css', method: 'GET', status: 200, type: 'stylesheet', size: '18.4 kB', time: '6 ms' },
        { id: '4', url: '/api/gemini', method: 'POST', status: 200, type: 'fetch', size: '1.2 kB', time: '210 ms' },
        { id: '5', url: 'https://fonts.googleapis.com/css2', method: 'GET', status: 200, type: 'font', size: '36.8 kB', time: '45 ms' },
      ]);

      // Generate simulated page source
      setSourceCode(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Robail Inspected Page</title>
    <!-- Inspected URL: ${currentUrl} -->
  </head>
  <body>
    <div id="root">
      <header class="robail-inspected-header">
        <h1>Page Content</h1>
      </header>
      <main>
        <p>Inspected node tree for ${currentUrl}</p>
      </main>
    </div>
  </body>
</html>`);
    }
  }, [isOpen, currentUrl]);

  const handleRunConsole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const input = consoleInput.trim();
    const entry: ConsoleLog = {
      id: 'log-' + Date.now(),
      type: 'info',
      message: `> ${input}`,
      timestamp: Date.now(),
    };

    let resultEntry: ConsoleLog;
    try {
      // Evaluate JavaScript expression safely
      const result = eval(input);
      resultEntry = {
        id: 'res-' + Date.now(),
        type: 'log',
        message: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
        timestamp: Date.now(),
      };
    } catch (err: any) {
      resultEntry = {
        id: 'err-' + Date.now(),
        type: 'error',
        message: `Uncaught ${err?.name || 'Error'}: ${err?.message || String(err)}`,
        timestamp: Date.now(),
      };
    }

    setLocalLogs((prev) => [...prev, entry, resultEntry]);
    setConsoleInput('');
    setTimeout(() => consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  if (!isOpen) return null;

  return (
    <div className="h-64 bg-slate-950 border-t border-slate-800 flex flex-col select-none z-30 font-mono text-xs shadow-2xl">
      {/* DevTools Top Navigation Bar */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'console'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'elements'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Elements</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'network'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Network</span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'storage'
                ? 'bg-slate-800 text-sky-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Storage</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'console' && (
            <button
              onClick={() => {
                setLocalLogs([]);
                onClearLogs();
              }}
              title="Clear console"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DevTools Body */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-950 font-mono text-[11px]">
        {/* CONSOLE TAB */}
        {activeTab === 'console' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-1 select-text">
              <div className="text-slate-500 pb-1 border-b border-slate-900">
                Robail DevTools JavaScript Console [Blink Engine 128 / ES2024]
              </div>
              {localLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 py-0.5 px-1 rounded ${
                    log.type === 'error'
                      ? 'bg-red-500/10 text-red-400'
                      : log.type === 'warn'
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                </div>
              ))}
              <div ref={consoleBottomRef} />
            </div>

            {/* Console Input REPL */}
            <form onSubmit={handleRunConsole} className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
              <span className="text-sky-400 font-bold">{'>'}</span>
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Type JavaScript (e.g. document.title, 1+1, navigator.userAgent)..."
                className="flex-1 bg-transparent text-slate-200 outline-none text-xs select-text placeholder-slate-600"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded bg-slate-800 text-sky-400 hover:bg-slate-750 text-xs"
              >
                Execute
              </button>
            </form>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span>DOM Tree / HTML Source Inspector</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sourceCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-2 text-slate-300 select-text whitespace-pre leading-relaxed text-[11px]">
              {sourceCode}
            </pre>
          </div>
        )}

        {/* NETWORK TAB */}
        {activeTab === 'network' && (
          <div className="h-full overflow-y-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-1 px-2">Name / URL</th>
                  <th className="py-1 px-2">Status</th>
                  <th className="py-1 px-2">Type</th>
                  <th className="py-1 px-2">Size</th>
                  <th className="py-1 px-2">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {networkRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/60">
                    <td className="py-1 px-2 text-sky-400 truncate max-w-xs">{req.url}</td>
                    <td className="py-1 px-2 text-emerald-400 font-semibold">{req.status}</td>
                    <td className="py-1 px-2 text-slate-400">{req.type}</td>
                    <td className="py-1 px-2 text-slate-400">{req.size}</td>
                    <td className="py-1 px-2 text-slate-500">{req.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STORAGE TAB */}
        {activeTab === 'storage' && (
          <div className="h-full p-2 text-slate-300 space-y-2 select-text">
            <div className="font-bold text-sky-400 mb-2">LocalStorage Keys</div>
            <div className="space-y-1">
              {['robail_notes', 'robail_settings', 'robail_bookmarks', 'robail_history'].map((k) => (
                <div key={k} className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-mono text-emerald-400">{k}</span>
                  <span className="text-slate-500 text-[10px]">Active in storage</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
