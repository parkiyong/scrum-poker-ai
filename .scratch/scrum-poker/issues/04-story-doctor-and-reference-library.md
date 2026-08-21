# Story Doctor & Point Reference Library Specs

Type: grilling
Status: resolved
Blocked by: 01

## Question

What are the exact INVEST audit scoring heuristics, LLM prompts for edge-case generation (errors, empty states, limits), 3-bullet technical complexity summaries, and data models/UI interactions for the team-defined Point Reference Library sidebar during pre-vote?

## Answer

1. **INVEST Audit & Readiness Scoring**:
   - Evaluates stories against INVEST criteria with automated heuristics:
     - *Independent*: Detects external team/system blocks mentioned in text.
     - *Negotiable*: Distinguishes outcome goals from overly rigid implementation mandates.
     - *Valuable*: Checks for a distinct user or business value statement.
     - *Estimable*: Scans for vague scope quantifiers ("fast", "simple", "etc.", "TBD").
     - *Small*: Evaluates whether multiple disparate features are bundled together.
     - *Testable*: Verifies presence of explicit Acceptance Criteria (checklists or markdown headers).
   - Computes an advisory Readiness Score (0–100%).
   - UI: Non-blocking warning banner with `[Review Issues]` / `[Vote Anyway]` (never blocks voting progression).

2. **Standard 3-Axis Technical Complexity Summary**:
   - LLM generates a concise, 3-bullet architectural summary:
     - 💾 **Data Models**: Schema changes, persistence mutations, caching needs.
     - 🔌 **Dependencies & APIs**: External services, background queues, 3rd-party libs.
     - 💥 **Blast Radius**: Affected user flows, regressions, backwards compatibility risks.

3. **4-Category Edge-Case Generator**:
   - Produces 2–4 high-leverage edge cases formatted as interactive checkboxes across 4 categories:
     1. *Error/Failure States* (rate limits, timeouts, partial network failures)
     2. *Empty/Boundary States* (zero rows, pagination bounds, max character lengths)
     3. *Concurrency & Race Conditions* (simultaneous writes, stale cache reads)
     4. *Permissions/Access* (forbidden roles, unverified session states)

4. **Point Reference Library Data Model & Sidebar**:
   - Collapsible room sidebar showing benchmark stories for each card value (1, 2, 3, 5, 8, 13).
   - Pre-seeded with standard web development reference examples:
     - `1 Point`: Text/copy update or minor styling tweak in existing component.
     - `2 Points`: New field added to existing form with validation and DB column.
     - `3 Points`: Standard CRUD endpoint and simple list view with basic filtering.
     - `5 Points`: Webhook receiver with signature verification and retry queue.
     - `8 Points`: Multi-provider authentication flow with token refresh and error states.
     - `13 Points`: Live zero-downtime database schema migration across active tables.
   - Facilitator can customize reference descriptions per room to match team domain.
