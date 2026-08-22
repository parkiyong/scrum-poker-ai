import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ClientCommand,
  LocalSessionProfile,
  Role,
  RoomSnapshotData,
  ServerEvent,
  Story,
} from '../types/room';
import { getOrCreateParticipantId, getStoredProfile, saveStoredProfile } from '../utils/session';

export interface UseRoomSocketReturn {
  roomState: RoomSnapshotData | null;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  currentParticipantId: string;
  myProfile: LocalSessionProfile | null;
  isFacilitator: boolean;
  joinRoom: (nickname: string, avatar: string, role?: Role) => void;
  startVoting: () => void;
  castVote: (value: string) => void;
  retractVote: () => void;
  revealCards: () => void;
  triggerReVote: () => void;
  finalizeStory: (points?: string) => void;
  selectStory: (story: Story | null) => void;
  updateRole: (targetId: string, newRole: Role) => void;
  transferFacilitator: (targetId: string) => void;
}

export function useRoomSocket(slug: string): UseRoomSocketReturn {
  const [roomState, setRoomState] = useState<RoomSnapshotData | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [myProfile, setMyProfile] = useState<LocalSessionProfile | null>(() => getStoredProfile(slug));
  const wsRef = useRef<WebSocket | null>(null);
  const participantIdRef = useRef<string>(myProfile?.participant_id || getOrCreateParticipantId());

  const sendCommand = useCallback((cmd: ClientCommand) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    }
  }, []);

  const joinRoom = useCallback((nickname: string, avatar: string, role?: Role) => {
    const profile: LocalSessionProfile = {
      participant_id: participantIdRef.current,
      nickname,
      avatar,
      role,
    };
    saveStoredProfile(slug, profile);
    setMyProfile(profile);

    sendCommand({
      type: 'JoinRoom',
      payload: {
        participant_id: profile.participant_id,
        nickname: profile.nickname,
        avatar: profile.avatar,
        role: profile.role,
      },
    });
  }, [slug, sendCommand]);

  useEffect(() => {
    if (!slug) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/rooms/${slug}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      // Auto rejoin if profile is cached
      const stored = getStoredProfile(slug);
      if (stored) {
        sendCommand({
          type: 'JoinRoom',
          payload: {
            participant_id: stored.participant_id,
            nickname: stored.nickname,
            avatar: stored.avatar,
            role: stored.role,
          },
        });
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ServerEvent;
        if (msg.type === 'RoomSnapshot') {
          setRoomState(msg.payload.state);
        } else if (msg.type === 'VoteCast') {
          setRoomState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              participants: prev.participants.map((p) =>
                p.id === msg.payload.participant_id ? { ...p, voted: true } : p
              ),
            };
          });
        } else if (msg.type === 'VoteRetracted') {
          setRoomState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              participants: prev.participants.map((p) =>
                p.id === msg.payload.participant_id ? { ...p, voted: false, vote: undefined } : p
              ),
            };
          });
        }
      } catch (err) {
        console.error('Failed to parse server message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setStatus('error');
    };

    ws.onclose = () => {
      setStatus('disconnected');
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [slug, sendCommand]);

  const startVoting = useCallback(() => {
    sendCommand({ type: 'StartVoting' });
  }, [sendCommand]);

  const castVote = useCallback((value: string) => {
    sendCommand({ type: 'CastVote', payload: { value } });
  }, [sendCommand]);

  const retractVote = useCallback(() => {
    sendCommand({ type: 'RetractVote' });
  }, [sendCommand]);

  const revealCards = useCallback(() => {
    sendCommand({ type: 'RevealCards' });
  }, [sendCommand]);

  const triggerReVote = useCallback(() => {
    sendCommand({ type: 'TriggerReVote' });
  }, [sendCommand]);

  const finalizeStory = useCallback((points?: string) => {
    sendCommand({ type: 'FinalizeStory', payload: { points } });
  }, [sendCommand]);

  const selectStory = useCallback((story: Story | null) => {
    sendCommand({ type: 'SelectStory', payload: { story } });
  }, [sendCommand]);

  const updateRole = useCallback((targetId: string, newRole: Role) => {
    sendCommand({ type: 'UpdateRole', payload: { target_id: targetId, new_role: newRole } });
  }, [sendCommand]);

  const transferFacilitator = useCallback((targetId: string) => {
    sendCommand({ type: 'TransferFacilitator', payload: { target_id: targetId } });
  }, [sendCommand]);

  const isFacilitator = roomState?.facilitator_id === participantIdRef.current;

  return {
    roomState,
    status,
    currentParticipantId: participantIdRef.current,
    myProfile,
    isFacilitator,
    joinRoom,
    startVoting,
    castVote,
    retractVote,
    revealCards,
    triggerReVote,
    finalizeStory,
    selectStory,
    updateRole,
    transferFacilitator,
  };
}
