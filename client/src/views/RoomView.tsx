import React, { useState } from 'react';
import { DeckSelector } from '../components/DeckSelector';
import { FacilitatorBar } from '../components/FacilitatorBar';
import { Header } from '../components/Header';
import { JoinModal } from '../components/JoinModal';
import { PokerTableArena } from '../components/PokerTableArena';
import { useRoomSocket } from '../hooks/useRoomSocket';
import { Role } from '../types/room';

interface RoomViewProps {
  slug: string;
  onLeave: () => void;
}

export const RoomView: React.FC<RoomViewProps> = ({ slug, onLeave: _onLeave }) => {
  const {
    roomState,
    status,
    currentParticipantId,
    myProfile,
    isFacilitator,
    joinRoom,
    startVoting,
    castVote,
    retractVote,
    revealCards,
    triggerReVote,
    finalizeStory,
  } = useRoomSocket(slug);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(!myProfile);

  const myParticipant = roomState?.participants.find((p) => p.id === currentParticipantId);
  const myVote = myParticipant?.vote;

  const handleCardClick = (val: string) => {
    if (myVote === val) {
      retractVote();
    } else {
      castVote(val);
    }
  };

  const handleJoinModalSubmit = (nickname: string, avatar: string, role: Role) => {
    joinRoom(nickname, avatar, role);
    setIsJoinModalOpen(false);
  };

  if (!roomState && status === 'connecting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-2xl font-bold animate-pulse">
          🃏
        </div>
        <p className="text-sm font-medium text-slate-400">Connecting to room {slug}...</p>
      </div>
    );
  }

  const phase = roomState?.phase || 'Idle';
  const roundNumber = roomState?.round_number || 1;
  const participants = roomState?.participants || [];
  const consensus = roomState?.consensus;
  const activeStory = roomState?.active_story;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-28">
      {/* Header */}
      <Header
        slug={roomState?.slug || slug}
        shortCode={roomState?.short_code || '---'}
        myParticipant={myParticipant}
        isFacilitator={isFacilitator}
        status={status}
        onChangeProfile={() => setIsJoinModalOpen(true)}
      />

      {/* Main Room Arena Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col">
        {/* Story Info Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Active Story
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {activeStory?.title || 'General Estimation Round'}
              </h2>
            </div>
            {activeStory?.description && (
              <p className="text-xs text-slate-400 line-clamp-2">{activeStory.description}</p>
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Connected</div>
              <div className="text-sm font-bold text-slate-200">
                {participants.filter((p) => p.connected).length} Estimators
              </div>
            </div>
          </div>
        </div>

        {/* Facilitator Controls Bar */}
        <FacilitatorBar
          phase={phase}
          onStartVoting={startVoting}
          onRevealCards={revealCards}
          onTriggerReVote={triggerReVote}
          onFinalize={() => finalizeStory()}
          isFacilitator={isFacilitator}
        />

        {/* Central Felt Poker Table */}
        <div className="flex-1 flex items-center justify-center">
          <PokerTableArena
            participants={participants}
            currentUserId={currentParticipantId}
            facilitatorId={roomState?.facilitator_id}
            phase={phase}
            roundNumber={roundNumber}
            consensus={consensus}
          />
        </div>
      </main>

      {/* Bottom Fibonacci Card Deck */}
      {myParticipant?.role !== 'Observer' && (
        <DeckSelector
          selectedCard={myVote}
          onSelectCard={handleCardClick}
          disabled={phase !== 'Voting' && phase !== 'Revealed'}
        />
      )}

      {/* Onboarding / Profile Join Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        initialNickname={myProfile?.nickname}
        initialAvatar={myProfile?.avatar}
        initialRole={myProfile?.role}
        onJoin={handleJoinModalSubmit}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};
