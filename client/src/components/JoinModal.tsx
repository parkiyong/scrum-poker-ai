import React, { useState } from 'react';
import { Role } from '../types/room';

interface JoinModalProps {
  initialNickname?: string;
  initialAvatar?: string;
  initialRole?: Role;
  isOpen: boolean;
  onJoin: (nickname: string, avatar: string, role: Role) => void;
  onClose?: () => void;
}

const AVATAR_COLORS = [
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-500' },
  { id: 'slate', label: 'Slate', bg: 'bg-slate-500' },
];

export const JoinModal: React.FC<JoinModalProps> = ({
  initialNickname = '',
  initialAvatar = 'indigo',
  initialRole = 'Estimator',
  isOpen,
  onJoin,
}) => {
  const [nickname, setNickname] = useState(initialNickname || '');
  const [avatar, setAvatar] = useState(initialAvatar || 'indigo');
  const [role, setRole] = useState<Role>(initialRole || 'Estimator');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onJoin(nickname.trim(), avatar, role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xl font-bold">
            🃏
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Join Poker Room</h2>
            <p className="text-xs text-slate-400">Zero-auth session • Reconnect anytime</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Your Nickname
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex, Sarah, Devon"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Avatar Color
            </label>
            <div className="flex items-center gap-2.5">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAvatar(c.id)}
                  className={`w-8 h-8 rounded-full ${c.bg} transition-all duration-150 flex items-center justify-center ${
                    avatar === c.id
                      ? 'ring-4 ring-indigo-500/40 scale-110 shadow-lg'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {avatar === c.id && <span className="text-white text-xs font-black">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Participation Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Estimator')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col ${
                  role === 'Estimator'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Estimator</span>
                <span className="text-[10px] opacity-70 font-normal">Votes on story points</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('Observer')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col ${
                  role === 'Observer'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Observer</span>
                <span className="text-[10px] opacity-70 font-normal">Watches without voting</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-98"
          >
            Enter Room
          </button>
        </form>
      </div>
    </div>
  );
};
