## Destination

A complete, buildable Product & System Specification in `.scratch/scrum-poker/spec.md` covering PRD requirements, UX wireframe states, a Rust real-time backend architecture (Tokio/Axum + WebSockets + PostgreSQL/pgvector), zero-auth room lifecycle, standalone story ingestion/export (Markdown, CSV, JSON), and exact schemas/prompts for all 7 AI advisory capabilities.

## Notes

- Effort: Scrum Poker AI
- Tech Stack: Rust (Axum/Tokio) backend + WebSockets, PostgreSQL + pgvector, React web client.
- Auth Model: Zero-auth (room code / session token based, nickname entry, facilitator token).
- Integration Model: Standalone (no external issue tracker dependencies; manual creation, Markdown/CSV/JSON bulk import, Markdown export).
- AI Policy: Advisory only; AI never votes; suggestions and divergence analyses strictly gated behind the server-enforced Reveal Gate. No individual developer scoring surfaces.
- Issue Tracker: Local markdown under `.scratch/scrum-poker/`.
- Relevant Skills: `domain-modeling`, `grilling`, `prototype`, `research`.

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance, then zoom the link for the detail the ticket holds -->

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

- Real-time offline PWA capabilities & push notifications for async estimators.
- Custom localized embedding model evaluation and private LLM inference endpoints.
- In-room audio/video WebRTC breakout channels for outlier debriefs.

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->

- [Linear Integration & API Key Handling in No-Auth Mode](issues/03-linear-sync-contract.md): Ruled out of scope; the application is designed to be fully standalone with no dependencies on Linear, Jira, or third-party issue trackers.
- Individual developer performance metrics / velocity leaderboards (strictly omitted to preserve team psychological safety).
- Autonomous AI voting (AI casting story points or participating as an estimator).
- Enterprise SSO / centralized user directory accounts (ruled out by zero-auth requirement).
