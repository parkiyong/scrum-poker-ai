---
type: Domain Model
title: Consensus & Spread Analysis
description: Quorum validation, consensus percentage calculation, and outlier classification rules.
tags:
  - domain
  - math
  - consensus
  - analytics
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

# Consensus & Spread Analysis

Upon card reveal, the backend executes `compute_consensus()` over all valid estimator votes to categorize agreement and spread.

## Quorum Filter

Only participants meeting all of the following criteria are included:
1. `p.role == Role::Estimator` (Observers are strictly excluded).
2. `p.voted == true`.
3. `p.vote != "?"` (Uncertainty votes do not skew numeric spread).

## Consensus Categories

```rust
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ConsensusCategory {
    Consensus,     // >= 75% agreement on a single point value
    HighOutlier,   // Max vote > Min vote * 2
    LowOutlier,    // Slight divergence
    BimodalSplit,  // 2 equal top vote counts with >= 2 votes each
    WideSpread,    // Max vote >= Min vote * 4
}
```

## Summary Payload

```rust
pub struct ConsensusSummary {
    pub category: ConsensusCategory,
    pub consensus_pct: f64,
    pub agreement_count: usize,
    pub total_votes: usize,
    pub suggested_points: Option<String>,
    pub min_vote: Option<String>,
    pub max_vote: Option<String>,
}
```
