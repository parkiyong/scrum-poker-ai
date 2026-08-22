import React from 'react';
import { Participant } from '../types/room';

interface PokerCardProps {
  participant: Participant;
  isSelf: boolean;
  isFacilitator: boolean;
  phase: string;
  isConsensus?: boolean;
  isOutlier?: boolean;
}

export const PokerCard: React.FC<PokerCardProps> = ({
  participant,
  isSelf,
  isFacilitator,
  phase,
  isConsensus,
  isOutlier,
}) => {
  const isRevealed = phase === 'Revealed' || phase === 'Finalized' || phase === 'Discussing' || phase === 'Slicing';
  const hasVote = participant.vote !== undefined && participant.vote !== null;
  const isFlipped = isRevealed && hasVote;

  const avatarColors: Record<string, string> = {
    indigo: 'from-indigo-600 to-indigo-700 ring-indigo-500/50',
    emerald: 'from-emerald-600 to-emerald-700 ring-emerald-500/50',
    amber: 'from-amber-600 to-amber-700 ring-amber-500/50',
    rose: 'from-rose-600 to-rose-700 ring-rose-500/50',
    cyan: 'from-cyan-600 to-cyan-700 ring-cyan-500/50',
    violet: 'from-violet-600 to-violet-700 ring-violet-500/50',
    slate: 'from-slate-600 to-slate-700 ring-slate-500/50',
  };

  const bgGrad = avatarColors[participant.avatar] || avatarColors.indigo;

  return (
    <div className="flex flex-col items-center gap-2 group transition-all duration-300">
      {/* 3D Flip Card Container */}
      <div className="w-16 h-24 sm:w-20 sm:h-28 perspective-1000">
        <div
          className={`relative w-full h-full transform-style-3d card-flip rounded-xl shadow-lg ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* CARD FRONT (Face-down / Hidden state) */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rounded-xl border flex flex-col items-center justify-center p-2 select-none transition-colors ${
              participant.voted
                ? 'bg-slate-900 border-indigo-500/60 shadow-indigo-500/20 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-950/80 border-slate-800 text-slate-500'
            }`}
          >
            {participant.voted ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm animate-pulse">
                  ✓
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  {isSelf && participant.vote ? participant.vote : 'Voted'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-600">
                  ⋯
                </div>
                <span className="text-[9px] uppercase font-semibold text-slate-500">
                  {participant.role === 'Observer' ? 'Observer' : 'Thinking'}
                </span>
              </div>
            )}
          </div>

          {/* CARD BACK (Revealed face-up state) */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl border flex flex-col items-center justify-between p-2 select-none ${
              isConsensus
                ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-emerald-500/30 shadow-lg text-emerald-300'
                : isOutlier
                ? 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500/80 ring-2 ring-rose-500/40 shadow-rose-500/30 shadow-lg text-rose-300'
                : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-700 text-slate-100 shadow-md'
            }`}
          >
            <span className="text-[10px] font-mono font-bold self-start opacity-70">
              {participant.vote}
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tighter">
              {participant.vote}
            </span>
            <span className="text-[10px] font-mono font-bold self-end opacity-70">
              {participant.vote}
            </span>
          </div>
        </div>
      </div>

      {/* Participant Avatar & Name Label */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800 max-w-[140px] shadow-sm">
        <div
          className={`w-4 h-4 rounded-full bg-gradient-to-tr ${bgGrad} ring-1 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white uppercase`}
        >
          {participant.nickname.charAt(0)}
        </div>
        <span className="text-xs font-medium text-slate-300 truncate">
          {participant.nickname} {isSelf && '(You)'}
        </span>
        {isFacilitator && (
          <span title="Facilitator" className="text-[10px] text-amber-400">
            👑
          </span>
        )}
      </div>
    </div>
  );
};
