import React, { useState } from 'react';

interface LobbyViewProps {
  onJoinRoom: (slugOrCode: string) => void;
  onCreateRoom: (customSlug?: string) => Promise<void>;
  loading: boolean;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onJoinRoom,
  onCreateRoom,
  loading,
}) => {
  const [joinInput, setJoinInput] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinInput.trim()) {
      onJoinRoom(joinInput.trim());
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(customSlug.trim() || undefined);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Brand Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/30 text-3xl font-black mb-2 animate-bounce-slow">
            🃏
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Scrum Poker <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Zero-auth, real-time Planning Poker with server-enforced reveal gates and AI estimation advisory.
          </p>
        </div>

        {/* Action Cards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left">
          {/* Quick Create Room */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Create New Room
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Instantly spin up an ephemeral room with an auto-generated slug and 6-char mobile code.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              {showCustom ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="custom-room-name"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowCustom(false)}
                      className="text-xs text-slate-500 hover:text-slate-400"
                    >
                      ← Back to Auto Slug
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  + Custom room slug override
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Room...' : '⚡ Create Room Instantly'}
              </button>
            </form>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 absolute">
              or
            </span>
          </div>

          {/* Join Existing Room */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Join Existing Room
            </h2>
            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                placeholder="Enter room slug or code (e.g. SWB-42)"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none font-mono uppercase"
              />
              <button
                type="submit"
                disabled={!joinInput.trim()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-sm transition active:scale-98 disabled:opacity-50"
              >
                Enter Room →
              </button>
            </form>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Zero-Auth
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Server Reveal Gate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            3D Card Reveal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Tokio Real-Time
          </span>
        </div>
      </div>
    </div>
  );
};
