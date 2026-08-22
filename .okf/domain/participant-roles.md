---
type: Domain Model
title: Participant Roles & Permissions
description: Role taxonomy separating room management authority from participation mode.
tags:
  - domain
  - roles
  - permissions
resource: file:///server/src/domain/models.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: domain-models
    resource: /server/src/domain/models.rs
    title: Domain Models
  - id: room-actor
    resource: /server/src/actor/room_actor.rs
    title: Room Actor
---

# Participant Roles & Permissions

Scrum Pokr AI decouples **Room Authority** from **Participation Mode**:

## Role Taxonomy

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Role {
    Estimator,
    Observer,
}
```

* **Room Authority (`facilitator_id`)**: Holds exclusive control over state transition commands (`StartVoting`, `RevealCards`, `TriggerReVote`, `FinalizeStory`, `SelectStory`).
* **Participation Mode (`role`)**: Governs voting deck availability and inclusion in quorum calculations.

## Matrix of Capabilities

| Dimension | Voting Facilitator | Observer Facilitator (Scrum Master) | Peer Estimator | Peer Observer |
| :--- | :--- | :--- | :--- | :--- |
| **Facilitator Controls** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Bottom Card Deck** | ✅ Visible | ❌ Hidden | ✅ Visible | ❌ Hidden |
| **Quorum Inclusion** | ✅ Yes | ❌ Excluded | ✅ Yes | ❌ Excluded |
| **Table Card Label** | "Thinking" / "Voted" | "Observer" | "Thinking" / "Voted" | "Observer" |
| **Crown Badge (👑)** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

## Automatic Failover

If the current Facilitator drops connection, the `RoomActor` automatically inspects connected participants and promotes the senior connected peer to Facilitator authority via `ServerEvent::FacilitatorChanged`.
