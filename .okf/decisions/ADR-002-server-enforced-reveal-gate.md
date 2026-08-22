---
type: Architectural Decision Record
title: "ADR-002: Server-Enforced Reveal Gate"
description: Rationale for protocol-level vote masking vs client-side masking.
tags:
  - decision
  - adr
  - security
  - anti-anchoring
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: reveal-gate-concept
    resource: /.okf/security/server-enforced-reveal-gate.md
    title: Server-Enforced Reveal Gate
---

# ADR-002: Server-Enforced Reveal Gate

## Context

Planning poker relies on independent estimates to prevent anchoring bias (where junior engineers unconsciously match the estimates of tech leads or managers). Many open-source poker apps broadcast complete vote data to all connected clients and rely on CSS or React conditional rendering (`display: none` or `***`) to conceal values. In engineering teams, participants routinely inspect WebSocket network frames to preview votes.

## Decision

We enforce vote concealment strictly at the Rust serialization projection layer (`reveal_gate.rs`):
1. During `Voting`, JSON serialization explicitly emits `vote: None` for all peer sockets.
2. The card value is physically omitted from the network frame until the phase explicitly transitions to `Revealed`.
3. AI estimation advisory baselines are similarly withheld until human votes have been revealed.

## Consequences

* **Positive**: Absolute anti-anchoring guarantee. DevTools inspection reveals only `voted: true`, making cheating impossible.
* **Negative**: Requires personalized state projection per WebSocket connection rather than broadcasting a single raw snapshot byte array to all connections simultaneously.
