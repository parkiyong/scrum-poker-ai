---
type: Architecture Component
title: Multi-Room Registry
description: Thread-safe in-memory routing and registry mapping room codes to Tokio actor channel handles.
tags:
  - rust
  - registry
  - routing
  - concurrency
resource: file:///server/src/actor/registry.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: registry-src
    resource: /server/src/actor/registry.rs
    title: RoomRegistry Implementation
  - id: slug-domain
    resource: /.okf/domain/room-identifiers.md
    title: Room Identifiers Concept
---

# Multi-Room Registry

The `RoomRegistry` provides global multi-tenant routing between incoming HTTP/WebSocket connections and active `RoomActor` state machine handles.

## Structure & Thread Safety

The registry wraps a hash map protected by an asynchronous `tokio::sync::RwLock`:

```rust
#[derive(Clone, Default)]
pub struct RoomRegistry {
    rooms: Arc<RwLock<HashMap<String, RoomHandle>>>,
}

#[derive(Clone)]
pub struct RoomHandle {
    pub slug: String,
    pub short_code: String,
    pub tx: mpsc::Sender<RoomCommand>,
    pub event_tx: broadcast::Sender<ServerEvent>,
}
```

## Key Invariants

1. **Normalized Key Storage**: All room codes are keyed in uppercase form (e.g. `SWB-42`).
2. **Case-Insensitive Resolution**: Lookups normalize incoming inputs (e.g. `swb-42`, `SWB-42`, `Swb-42`) to match the canonical handle.
3. **On-Demand Actor Spawning**: If a requested room code does not exist upon connection, `get_or_create` atomically initializes a new `RoomActor`, spawns its background Tokio task, registers its channel handle, and returns it.
