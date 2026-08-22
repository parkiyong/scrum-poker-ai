import React, { useState } from 'react';
import { Participant } from '../types/room';

interface HeaderProps {
  slug: string;
  shortCode: string;
  myParticipant?: Participant;
  isFacilitator: boolean;
  status: string;
  onChangeProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  slug,
  shortCode,
  myParticipant,
  isFacilitator,
  status,
  onChangeProfile,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <a href="/" className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20 hover:scale-105 transition">
          🃏
        </a>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-slate-200">Scrum Poker AI</h1>
            <span className="px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-mono">
              {slug}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Zero-Auth Room • Standalone Mode</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition text-slate-300 flex items-center gap-1.5"
        >
          <span>{copied ? '✓ Copied!' : `🔗 Share (${shortCode})`}</span>
        </button>

        {/* User Badge */}
        {myParticipant ? (
          <button
            onClick={onChangeProfile}
            className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 px-3 py-1.5 rounded-full transition"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="font-medium text-slate-200">
              {myParticipant.nickname} {isFacilitator ? '(Facilitator)' : `(${myParticipant.role})`}
            </span>
          </button>
        ) : (
          <button
            onClick={onChangeProfile}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition font-medium"
          >
            Join Table
          </button>
        )}
      </div>
    </header>
  );
};
