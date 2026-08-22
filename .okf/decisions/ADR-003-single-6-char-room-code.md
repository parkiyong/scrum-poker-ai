---
type: Architectural Decision Record
title: "ADR-003: Single 6-Character Room Code Format"
description: Rationale for unifying long slugs and short codes into a single canonical uppercase 6-character identifier.
tags:
  - decision
  - adr
  - routing
  - ux
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: slug-concept
    resource: /.okf/domain/room-identifiers.md
    title: Room Identifiers Concept
---

# ADR-003: Single 6-Character Room Code Format

## Context

The initial prototype maintained two distinct room representations:
1. A 3-word slug for browser URLs (e.g. `zen-bear-55`).
2. An uppercase 6-character code for mobile joiners (e.g. `ZBE-55`).

This dual-identity approach created user confusion: entering `ZBE-55` on the home page resolved to a different URL path than `zen-bear-55`, clipboard share links displayed inconsistent formats, and session storage keys collided.

## Decision

We eliminate the dual representation and standardize on a single canonical identifier: **uppercase 6-character alphanumeric codes** (`SWB-42`, `ZBE-55`, `FOX-19`):
1. Both the URL (`/r/SWB-42`), share links, header badges, and registry storage use the exact same format.
2. Routing is case-insensitive (e.g. `swb-42` maps directly to `SWB-42`).

## Consequences

* **Positive**: Zero ambiguity, concise URLs, 100% consistent clipboard sharing, and cleaner registry lookups.
* **Negative**: Slightly less whimsical than full 3-word slugs, though easily mitigated by memorable 3-letter mnemonic prefixes.
