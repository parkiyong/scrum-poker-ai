# 01: Core Real-Time Poker Arena (Zero-Auth Room & State Machine)

**What to build:** The foundational vertical tracer bullet. A facilitator can create a zero-auth planning poker room (slug e.g. `swift-badger-42` and 6-char code e.g. `SWB-42`), estimators join via URL or short code, select cards from a Fibonacci deck (0, 1, 2, 3, 5, 8, 13, 21, ?), and see real-time voting progress in the central poker table arena. A server-enforced reveal gate masks votes and values during the `Voting` phase until the facilitator triggers `RevealCards`, at which point cards flip with 3D animation, consensus/spread is computed, and reconnecting participants automatically recover their seat and vote via cached `localStorage` UUID.

**Blocked by:** None (can start immediately)

**Status:** resolved

## Acceptance criteria

- [x] Zero-auth room creation generates a human-readable slug (e.g. `swift-badger-42`) and uppercase 6-char short code (`SWB-42`) without authentication or signup.
- [x] Socket that initiates room creation is assigned `Facilitator` role; subsequent joins default to `Estimator` (or `Observer`).
- [x] Participant joining records session identity (UUIDv4, nickname, avatar color, role) in `localStorage` and smoothly reclaims their seat and voting state on disconnect/refresh.
- [x] In-memory Tokio room actor manages the core estimation state transitions (`Idle` → `Voting` → `Revealed` → `Finalized`).
- [x] Server-enforced Reveal Gate: While in `Voting` state, the server JSON serializer emits only `has_voted: bool` for peers; actual card values are strictly withheld until the state transitions to `Revealed`.
- [x] Central poker arena displays participant avatar positions around the table, shows vote readiness indicators during voting, and triggers 3D flip reveal animations upon cards reveal.
- [x] Facilitator controls allow starting voting, revealing cards, resetting the round, or transferring facilitator authority.
- [x] Full automated test coverage verifying state machine transitions, reveal gate masking invariants, and reconnect handshakes.
