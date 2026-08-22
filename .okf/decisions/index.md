# Architectural Decision Records (ADRs)

This section records significant architectural decisions, trade-offs, and design rationales for Scrum Poker AI.

## Decisions

* [ADR-001: In-Memory Tokio Actor State](/decisions/ADR-001-in-memory-tokio-actor-state.md) — Why active poker room states live entirely in memory.
* [ADR-002: Server-Enforced Reveal Gate](/decisions/ADR-002-server-enforced-reveal-gate.md) — Why vote masking is enforced at the JSON serialization layer.
* [ADR-003: Single 6-Character Room Code Format](/decisions/ADR-003-single-6-char-room-code.md) — Why the system standardizes on a single unified code format (`SWB-42`).
