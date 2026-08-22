---
type: Security Gate
title: Server-Enforced Reveal Gate
description: Protocol-level privacy boundary preventing unrevealed peer votes and AI baselines from leaking to client sockets.
tags:
  - security
  - privacy
  - reveal-gate
  - serialization
resource: file:///server/src/domain/reveal_gate.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: reveal-gate-src
    resource: /server/src/domain/reveal_gate.rs
    title: Reveal Gate Implementation
  - id: adr-002
    resource: /.okf/decisions/ADR-002-server-enforced-reveal-gate.md
    title: ADR 002 - Server-Enforced Reveal Gate
---

# Server-Enforced Reveal Gate

The **Reveal Gate** is a hard security invariant designed to eliminate cognitive anchoring bias during planning poker sessions.

## The Anchoring Problem

If a server transmits all participant vote values to client WebSockets and relies on frontend CSS/React to obscure them, any estimator can open browser DevTools / Network inspection to see senior developers' votes before submitting their own.

## The Reveal Gate Guarantee

The Reveal Gate enforces privacy at the **Rust JSON serialization layer**:

1. **During `Voting` Phase**:
   * For the participant themselves (`is_self == true`): Their chosen vote value is serialized so their local UI reflects their choice.
   * For all other participants (`is_self == false`): The serializer strictly projects `has_voted: bool`, setting `vote: None`.
   * The actual card value **does not exist in the JSON payload transmitted over the wire**.
2. **During `Revealed` / `Finalized` Phases**:
   * The serializer projects unmasked vote values for all participants alongside the consensus summary.

## Projected Structure

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParticipantProjection {
    pub id: String,
    pub nickname: String,
    pub avatar: String,
    pub role: Role,
    pub connected: bool,
    pub voted: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vote: Option<String>,
}
```
