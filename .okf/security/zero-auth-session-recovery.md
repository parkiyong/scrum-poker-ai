---
type: Security Gate
title: Zero-Auth Session Recovery
description: Frictionless session caching and identity reclamation across browser refreshes and socket reconnections.
tags:
  - security
  - identity
  - session
  - localstorage
resource: file:///client/src/utils/session.ts
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: session-src
    resource: /client/src/utils/session.ts
    title: Session Storage Utilities
---

# Zero-Auth Session Recovery

Scrum Poker AI requires zero passwords, emails, or OAuth redirects. Instead, it combines client-side UUID generation with ephemeral room actor state.

## Mechanism

1. **Global Participant UUID**: On initial load, the browser generates and persists a UUIDv4 in `localStorage` under `scrum_poker:global_participant_id`.
2. **Per-Room Profile**: When joining a specific room, the browser caches `{ participant_id, nickname, avatar, role }` under `scrum_poker:room:<slug>`.
3. **Handshake Re-attachment**:
   * When opening or refreshing `/r/<slug>`, the client extracts its cached profile and dispatches `ClientCommand::JoinRoom` with its existing `participant_id`.
   * The `RoomActor` identifies the participant, marks `connected = true`, preserves any previously cast vote, and resumes the exact session state without displaying the onboarding join modal again.
