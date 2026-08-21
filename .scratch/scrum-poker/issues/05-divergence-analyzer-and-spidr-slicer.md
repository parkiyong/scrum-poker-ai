# 05: Divergence Analyzer & SPIDR Vertical Slicer

**What to build:** Real-time advisory intelligence for vote spread debriefs and story decomposition. When votes diverge (e.g. 3 vs 13) upon reveal, the Divergence Analyzer classifies the variance across 5 neutral axes (Architecture/Scale, Integration Points, Domain Unknowns, Edge-Case Handling, Testing Overhead) and surfaces a supportive discussion prompt highlighting technical unknowns without identifying individuals or evaluating developer performance. If points are high (≥8) or consensus cannot be reached, the SPIDR vertical slicer generates 2–4 smaller (1–3 point) vertical child stories with a 1-click injection modal to append child slices directly into the active backlog queue.

**Blocked by:** 01 (Core Real-Time Poker Arena), 03 (Pre-Vote Story Doctor & Point Reference Library)

**Status:** ready-for-agent

## Acceptance criteria

- [ ] Evaluates vote distribution on card reveal and detects vote spread (e.g. non-adjacent Fibonacci values or spread ratio ≥ 2.5x).
- [ ] Divergence Analyzer prompt generates neutral technical hypothesis highlighting what high/low voters might be seeing (e.g., hidden DB migrations or legacy API risks).
- [ ] Arena displays a supportive Outlier Spotlight card emphasizing that divergence uncovers hidden edge cases rather than wrong answers.
- [ ] SPIDR Vertical Slicer button triggers decomposition using Spikes, Paths, Interfaces, Data, or Rules heuristics for complex stories (estimate ≥ 8 or split consensus).
- [ ] Vertical slicing modal displays proposed child slices with titles, descriptions, and acceptance criteria.
- [ ] 1-Click "Add Slices to Queue" injects generated child stories directly after the active story in the room backlog queue.
- [ ] Facilitator can trigger a quick "Re-Vote" round, resetting cards while preserving story context and discussion notes.
- [ ] Unit and prompt regression tests verify neutral tone guardrails, divergence detection math, and SPIDR JSON schema compliance.
