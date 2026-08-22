import React from 'react';
import { ConsensusSummary, EstimationPhase, Participant } from '../types/room';
import { PokerCard } from './PokerCard';

interface PokerTableArenaProps {
  participants: Participant[];
  currentUserId: string;
  phase: EstimationPhase;
  roundNumber: number;
  consensus?: ConsensusSummary | null;
}

export const PokerTableArena: React.FC<PokerTableArenaProps> = ({
  participants,
  currentUserId,
  phase,
  roundNumber,
  consensus,
}) => {
  const isRevealed = phase === 'Revealed' || phase === 'Finalized' || phase === 'Discussing' || phase === 'Slicing';
  const votedCount = participants.filter((p) => p.voted).length;
  const totalEstimators = participants.filter((p) => p.role !== 'Observer').length;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center py-6">
      {/* FELT POKER TABLE */}
      <div className="relative w-full aspect-[16/9] max-h-[460px] min-h-[340px] rounded-[60px] sm:rounded-[100px] bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-950 border-4 border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex items-center justify-center p-6">
        {/* Inner Table Felt Border & Glow */}
        <div className="absolute inset-4 rounded-[45px] sm:rounded-[80px] border border-emerald-500/10 pointer-events-none shadow-inner" />

        {/* Center Table Status & Results Hub */}
        <div className="z-10 flex flex-col items-center text-center max-w-sm px-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/80 mb-1">
            Round {roundNumber} • {phase}
          </span>

          {phase === 'Idle' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-3 shadow-lg">
              <p className="text-xs text-slate-400 font-medium">
                Waiting for Facilitator to start voting...
              </p>
            </div>
          )}

          {phase === 'Voting' && (
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl px-6 py-3.5 shadow-xl flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-sm font-bold text-slate-200">
                  {votedCount} of {totalEstimators} Voted
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Votes masked by Reveal Gate until facilitator triggers Reveal.
              </p>
            </div>
          )}

          {isRevealed && consensus && (
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {consensus.category === 'Consensus' ? (
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    ✓ Consensus ({Math.round(consensus.consensus_pct)}%)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    ⚡ {consensus.category} ({Math.round(consensus.consensus_pct)}% agree)
                  </span>
                )}
              </div>

              {consensus.suggested_points && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">
                    {consensus.suggested_points}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Story Points</span>
                </div>
              )}

              {consensus.min_vote && consensus.max_vote && consensus.min_vote !== consensus.max_vote && (
                <span className="text-[11px] font-mono text-slate-400">
                  Spread: {consensus.min_vote} ↔ {consensus.max_vote} pts
                </span>
              )}
            </div>
          )}

          {isRevealed && !consensus && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-3 shadow-lg">
              <p className="text-xs text-slate-400 font-medium">Cards revealed! No votes cast.</p>
            </div>
          )}
        </div>

        {/* Participant Seats around the Table */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-wrap items-center justify-around pointer-events-none">
          {participants.map((p) => {
            const isSelf = p.id === currentUserId;
            const isConsensus =
              isRevealed &&
              consensus?.suggested_points !== undefined &&
              p.vote === consensus.suggested_points;
            const isOutlier =
              isRevealed &&
              consensus?.suggested_points !== undefined &&
              p.vote !== undefined &&
              p.vote !== consensus.suggested_points &&
              p.vote !== '?';

            return (
              <div key={p.id} className="pointer-events-auto m-2">
                <PokerCard
                  participant={p}
                  isSelf={isSelf}
                  phase={phase}
                  isConsensus={isConsensus}
                  isOutlier={isOutlier}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
