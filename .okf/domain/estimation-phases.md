---
type: Domain Model
title: Estimation Phases
description: The estimation round lifecycle states governing UI visibility and server validation.
tags:
  - domain
  - state-machine
  - phases
resource: file:///server/src/domain/models.rs
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:40:00Z"
status: stable
sources:
  - id: domain-models
    resource: /server/src/domain/models.rs
    title: Domain Models
---

# Estimation Phases

The estimation lifecycle flows through well-defined discrete phases:

```
[Idle] ──► [StoryDoctorReview] ──► [Voting] ──► [Revealed] ──► [Discussing / Slicing] ──► [Finalized]
  ▲                                                │
  └─────────────────── [TriggerReVote] ────────────┘
```

## Phase Descriptions

| Phase | Description | Card Visibility | Allowed Actions |
| :--- | :--- | :--- | :--- |
| **`Idle`** | Room is resting between rounds or stories. | Face-down | Facilitator: `StartVoting`, `SelectStory` |
| **`StoryDoctorReview`** | Automated AI audit evaluating acceptance criteria clarity. | Face-down | Review findings, edit AC |
| **`Voting`** | Estimators cast private Fibonacci story points. | Masked (`✓ Voted`) | Estimators: `CastVote`, `RetractVote`; Facilitator: `RevealCards` |
| **`Revealed`** | Votes are exposed; 3D card flips triggered. | Unmasked face-up | Facilitator: `TriggerReVote`, `FinalizeStory` |
| **`Discussing`** | Outlier participants explain rationale. | Unmasked face-up | AI Divergence analyzer suggestions |
| **`Slicing`** | High-complexity stories undergo SPIDR decomposition. | Unmasked face-up | AI Story slicing suggestions |
| **`Finalized`** | Agreed estimate recorded and locked. | Unmasked face-up | Export estimate to clipboard/Jira |
