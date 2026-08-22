---
type: Concept
title: Getting Started with Scrum Pokr AI
description: Overview and navigational entrypoint for the Scrum Pokr AI platform knowledge base.
tags:
  - getting-started
  - overview
  - introduction
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: readme
    resource: /README.md
    title: Scrum Pokr AI Readme
  - id: spec
    resource: /.scratch/scrum-poker/spec.md
    title: Scrum Pokr AI System Specification
---

# Getting Started with Scrum Pokr AI

**Scrum Pokr AI** is a real-time, zero-auth Planning Poker platform crafted for high-velocity software engineering teams. It eliminates cognitive friction, signup overhead, and peer anchoring bias while delivering sub-millisecond real-time state synchronization.

## Core Architectural Highlights

1. **In-Memory Actor State Machine**: Built with [Rust and Tokio](/architecture/tokio-in-memory-actor-model.md), each active estimation room runs as an isolated asynchronous actor receiving tagged JSON RPC commands and broadcasting snapshots over WebSockets.
2. **Server-Enforced Reveal Gate**: The [Reveal Gate](/security/server-enforced-reveal-gate.md) enforces an anti-anchoring privacy boundary at the serialization tier, making it impossible for client devtools to inspect peer votes prior to formal card reveal.
3. **Unified 6-Character Room Codes**: Rooms are addressed with clean, memorable codes like `SWB-42` or `ZBE-55` ([Room Identifiers](/domain/room-identifiers.md)), eliminating complex auth flows and URL mismatch confusion.
4. **Flexible Roles & Observer Facilitator**: Scrum Masters can orchestrate room rounds as non-voting [Facilitator Observers](/domain/participant-roles.md) without altering team quorum.
5. **Zero-Auth Session Recovery**: Reconnecting participants seamlessly resume their seats via [localStorage session caching](/security/zero-auth-session-recovery.md).

## Knowledge Graph Navigation

* **System Design**: Read [/architecture/tokio-in-memory-actor-model.md](/architecture/tokio-in-memory-actor-model.md) to understand room execution.
* **Security & Invariants**: Read [/security/server-enforced-reveal-gate.md](/security/server-enforced-reveal-gate.md) to understand protocol privacy guarantees.
* **Wire Protocol**: Read [/protocol/tagged-json-rpc-events.md](/protocol/tagged-json-rpc-events.md) for full message payloads.
* **Design Rationale**: Read [/decisions/index.md](/decisions/index.md) for historical ADRs.
