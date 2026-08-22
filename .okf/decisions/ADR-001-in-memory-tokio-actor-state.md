---
type: Architectural Decision Record
title: "ADR-001: In-Memory Tokio Actor State Machine"
description: Rationale for hosting active room state in RAM actors rather than database rows.
tags:
  - decision
  - adr
  - rust
  - tokio
  - performance
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: actor-concept
    resource: /.okf/architecture/tokio-in-memory-actor-model.md
    title: Tokio In-Memory Actor Model
---

# ADR-001: In-Memory Tokio Actor State Machine

## Context

Planning poker sessions are high-frequency, ephemeral collaborative events. A typical session involves 4–15 engineers submitting votes, updating roles, and triggering card reveals over a 30–60 minute window. Writing every keystroke, heartbeat, and vote transaction to an external database creates connection bottleneck risks and latency spikes.

## Decision

We manage active room sessions purely in RAM as isolated Tokio asynchronous tasks (`RoomActor`).
1. Room state lives in a single-threaded actor loop receiving messages from an `mpsc` queue.
2. Changes are broadcast via `broadcast::channel` to attached WebSocket streams.
3. Long-term persistence (backlogs, story point history, pgvector reference matching) is performed asynchronously without blocking the in-memory room loop.

## Consequences

* **Positive**: Sub-millisecond state updates, zero database connection exhaustion during live meetings, clean concurrency isolation without distributed locking.
* **Negative**: Server restarts clear active in-memory room actors; participants reconnect to freshly initialized room states.
