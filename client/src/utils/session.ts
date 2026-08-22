import { LocalSessionProfile } from '../types/room';

export function getOrCreateParticipantId(): string {
  const globalKey = 'scrum_poker:global_participant_id';
  let id = localStorage.getItem(globalKey);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : 'p-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(globalKey, id);
  }
  return id;
}

export function getStoredProfile(slug: string): LocalSessionProfile | null {
  const key = `scrum_poker:room:${slug}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveStoredProfile(slug: string, profile: LocalSessionProfile): void {
  const key = `scrum_poker:room:${slug}`;
  localStorage.setItem(key, JSON.stringify(profile));
}
