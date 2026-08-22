---
type: Domain Model
title: Room Identifiers & Addressing
description: Unified 6-character uppercase room codes and routing rules.
tags:
  - domain
  - slug
  - routing
  - codes
resource: file:///server/src/domain/slug.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: slug-src
    resource: /server/src/domain/slug.rs
    title: Slug Implementation
  - id: adr-003
    resource: /.okf/decisions/ADR-003-single-6-char-room-code.md
    title: ADR 003 - Single 6-Character Room Code Format
---

# Room Identifiers & Addressing

To eliminate cognitive friction and URL routing mismatch, Scrum Pokr AI standardizes on a single canonical identifier format: **6-character uppercase alphanumeric codes**.

## Code Structure

```
 [PREFIX] - [NUMBER]
   SWB    -    42
```

* **Prefix**: 3 uppercase letters drawn from recognizable short mnemonics (`SWB`, `FOX`, `ZBE`, `LNX`, `BAD`, `OWL`, `CAT`, `DOG`, `ELK`, etc.).
* **Number**: 2 digits (`10..99`).
* **Example Codes**: `SWB-42`, `ZBE-55`, `FOX-19`, `LNX-73`.

## Routing & Resolution Invariants

1. **Case-Insensitive Resolution**: `swb-42`, `SWB-42`, and `Swb-42` resolve to the exact same room handle.
2. **Direct Canonical URLs**: Every room is directly accessible via `http://localhost:3000/r/SWB-42`.
3. **Custom Room Codes**: Facilitators can specify custom alphanumeric codes (e.g. `SPRINT-42`).
