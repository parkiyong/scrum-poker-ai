---
type: Architecture Component
title: Tokio In-Memory Actor Model
description: Single-threaded message-driven Tokio actor executing room lifecycle transitions in memory.
tags:
  - rust
  - tokio
  - actor
  - state-machine
  - concurrency
resource: file:///server/src/actor/room_actor.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: room-actor-src
    resource: /server/src/actor/room_actor.rs
    title: RoomActor Implementation
  - id: adr-001
    resource: /.okf/decisions/ADR-001-in-memory-tokio-actor-state.md
    title: ADR 001 - In-Memory State
---

# Tokio In-Memory Actor Model

The `RoomActor` is the authoritative state machine for a single Planning Poker session. Every active room runs on an isolated Tokio asynchronous task communicating exclusively via bounded channels.

## Key Properties

| Property | Implementation | Rationale |
| :--- | :--- | :--- |
| **Concurrency Safety** | `tokio::sync::mpsc` (Inbox) | Prevents race conditions and eliminates complex mutex locking on state mutations. |
| **Event Broadcasting** | `tokio::sync::broadcast` | Dispatches real-time event updates to all connected client WebSocket tasks. |
| **Synchronous Queries** | `tokio::sync::oneshot` | Enables query-response handshakes (e.g. initial snapshot requests, facilitator queries). |
| **Zero DB Contention** | Pure RAM resident state | Delivers sub-millisecond round trips and zero database connection pressure during live voting. |

## Channel Topology

```
 WebSocket Task A ───(mpsc::Sender)───┐
                                      ▼
 WebSocket Task B ───(mpsc::Sender)──► [RoomActor Task] ──► (broadcast::Sender) ──► All WebSockets
                                      ▲
 REST API Route   ───(mpsc::Sender)───┘
```

## State Transitions

The actor coordinates transitions across [Estimation Phases](/domain/estimation-phases.md):

1. `JoinRoom`: Inserts or reconnects participant; assigns Facilitator authority if room is empty.
2. `StartVoting`: Resets round votes, transitions phase to `Voting`, broadcasts personalized snapshot projections.
3. `CastVote`: Records vote if participant is an Estimator (rejects if Observer); dispatches `VoteCast` indicator without leaking value.
4. `RevealCards`: Transitions phase to `Revealed`, computes [Consensus and Spread](/domain/consensus-and-spread.md), and unmasks cards.
5. `TriggerReVote`: Increments `round_number`, resets votes, transitions back to `Voting`.
6. `FinalizeStory`: Sets phase to `Finalized` and broadcasts agreed story points.

## Failover Promotion

When the Facilitator's socket disconnects, the actor automatically identifies the next senior connected participant and promotes them to Facilitator authority via `FacilitatorChanged`.
