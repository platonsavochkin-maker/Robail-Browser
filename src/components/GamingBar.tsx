import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Sliders,
  Flame,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface GamingBarProps {
  onNavigate: (url: string) => void;
  accentColor?: string;
  theme?: 'dark' | 'light';
}

export const GamingBar: React.FC<GamingBarProps> = ({
  onNavigate,
  accentColor = '#ff003c',
  theme = 'dark',
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const playCyberSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {}
  };

  const gamingLinks = [
    { title: 'Steam', url: 'https://store.steampowered.com', color: '#66c0f4', icon: '🎮' },
    { title: 'Roblox', url: 'https://www.roblox.com', color: '#ff3344', icon: '🧱' },
    { title: 'Twitch', url: 'https://www.twitch.tv', color: '#a970ff', icon: '🟣' },
    { title: 'Discord', url: 'https://discord.com/app', color: '#5865f2', icon: '💬' },
    { title: 'Clan Wars', url: 'robail://clan', color: '#f59e0b', icon: '⚔️' },
  ];

  return (
    <div
      className={`h-9 border-b flex items-center justify-between px-3 select-none text-xs transition-all z-20 ${
        isCollapsed ? 'py-1' : ''
      }`}
      style={{
        backgroundColor: '#07080d',
        borderColor: `${accentColor}35`,
      }}
    >
      {/* Left: Gaming Branding (RBL GX) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {/* RBL GX Gaming Badge with uploaded Logo */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono font-black text-[11px] tracking-wider uppercase shadow-xs shrink-0"
          style={{
            backgroundColor: `${accentColor}25`,
            color: accentColor,
            border: `1px solid ${accentColor}50`,
          }}
        >
          <img
            src="/rbl_gx_logo.png"
            alt="RBL GX Logo"
            className="w-4 h-4 object-contain rounded-xs"
          />
          <span>RBL GX</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
          Игровой режим Robail
        </span>
      </div>

      {/* Right: Gaming Hotbar Shortcuts & Sound Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-1">
          {gamingLinks.map((g) => (
            <button
              key={g.url}
              onClick={() => {
                playCyberSound();
                onNavigate(g.url);
              }}
              className="px-2 py-0.5 rounded-md bg-black/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer hover:border-slate-700"
              title={`Открыть ${g.title}`}
            >
              <span>{g.icon}</span>
              <span>{g.title}</span>
            </button>
          ))}
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playCyberSound();
          }}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={soundEnabled ? 'Игровые звуки включены' : 'Игровые звуки выключены'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>
      </div>
    </div>
  );
};
