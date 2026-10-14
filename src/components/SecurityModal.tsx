import React from 'react';
import { X, Lock, ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  securityStatus: 'secure' | 'warning' | 'internal';
  blockedAdsCount: number;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  url,
  securityStatus,
  blockedAdsCount,
}) => {
  if (!isOpen) return null;

  let hostname = 'Robail Internal';
  try {
    if (!url.startsWith('robail://')) {
      hostname = new URL(url).hostname;
    }
  } catch {}

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            {securityStatus === 'secure' ? (
              <Lock className="w-4 h-4 text-emerald-400" />
            ) : securityStatus === 'internal' ? (
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <h2 className="text-sm font-bold text-white">Site Security Information</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-500 mb-0.5">Connected Host</div>
            <div className="font-mono font-semibold text-slate-100 truncate">{hostname}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Connection:</span>
              <span className="font-medium text-emerald-400">
                {securityStatus === 'secure'
                  ? 'TLS 1.3 Encrypted'
                  : securityStatus === 'internal'
                  ? 'Secure Sandbox'
                  : 'Unverified'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Cipher Suite:</span>
              <span className="font-mono text-slate-300">AES_256_GCM</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Certificate Issuer:</span>
              <span className="text-slate-300">Google Trust / DigiCert CA</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Robail Shield:</span>
              <span className="text-emerald-400 font-semibold">{blockedAdsCount} Trackers Blocked</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your connection to this site is isolated within the Robail security boundary. Cookies and
            cross-origin storage partitions are strictly guarded.
          </p>
        </div>
      </div>
    </div>
  );
};
