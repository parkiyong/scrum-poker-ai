# 06: Team Estimation Profile & Calibration Telemetry

**What to build:** Team-level estimation profile and calibration telemetry without individual developer tracking. When stories are finalized, session metadata (anonymized vote spreads, round count, final estimate, timestamp) is persisted to `historical_stories` and aggregated into `team_estimation_profiles`. A rolling 50-story calibration window computes team velocity bands, consensus rates, vertical slicing rates, and domain category bias. Facilitators can open an in-room Calibration Analytics modal displaying the team's historical estimation accuracy, alignment trends, and Fibonacci spread calibration curves.

**Blocked by:** 02 (Backlog Ingestion, Story Queue & Clipboard Export), 04 (PostgreSQL pgvector Storage & Semantic Reference Matcher)

**Status:** ready-for-agent

## Acceptance criteria

- [ ] PostgreSQL migration creates `team_estimation_profiles` table with JSONB velocity bands and calibration weights.
- [ ] Finalizing a story asynchronously appends session metrics to `historical_stories` and recalculates team rolling statistics.
- [ ] Calibration algorithm weights the last 50 finalized stories with exponential decay to reflect recent team composition and domain familiarity.
- [ ] Strict privacy boundary: Telemetry records strictly anonymized room aggregates; zero individual developer accuracy, scoring, or velocity leaderboards are stored or displayed.
- [ ] In-room Analytics modal visualizes team velocity bands, average rounds-to-consensus, and slicing frequency.
- [ ] Displays team-wide calibration insights (e.g. "Team tends to underestimate stories touching Data/Schema by +1.4x").
- [ ] Facilitator can export the longitudinal calibration profile as JSON telemetry bundle or reset team calibration baseline.
- [ ] Automated tests verify exponential decay weighting, telemetry anonymization invariants, and database upsert logic.
