import { describe, it, expect, beforeEach } from 'vitest';
import { getOrCreateParticipantId, getStoredProfile, saveStoredProfile } from '../utils/session';
import { LocalSessionProfile } from '../types/room';

describe('session utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates and persists a unique global participant id', () => {
    const id1 = getOrCreateParticipantId();
    expect(id1).toBeTruthy();
    const id2 = getOrCreateParticipantId();
    expect(id2).toBe(id1);
  });

  it('saves and retrieves per-room session profile', () => {
    const profile: LocalSessionProfile = {
      participant_id: 'test-uuid-1',
      nickname: 'Alex',
      avatar: 'indigo',
      role: 'Facilitator',
    };

    saveStoredProfile('swift-badger-42', profile);
    const loaded = getStoredProfile('swift-badger-42');
    expect(loaded).toEqual(profile);

    expect(getStoredProfile('other-room')).toBeNull();
  });
});
