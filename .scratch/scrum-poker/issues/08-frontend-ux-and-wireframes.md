# Frontend UX State Flows & Wireframe Specifications

Type: prototype
Status: resolved
Blocked by: 02, 04, 06

## Question

What are the wireframe structures, responsive layout designs, component state progressions (lobby, story doctor modal, interactive card deck, reveal animations, outlier spotlight cards, SPIDR slice modal), and facilitator controls for the zero-auth web interface?

## Answer

1. **Validated Hybrid Layout Architecture (Command Center + Poker Arena)**:
   - Evaluated via interactive prototype in [prototypes/room-ui-prototype.html](../../prototypes/room-ui-prototype.html).
   - **Left Column (Story & Quality Gate)**:
     - Story title, description, and tags.
     - Story Doctor INVEST scorecard (0–100% readiness gauge).
     - Acceptance Criteria list with verification badges.
     - Interactive 4-category Edge-Case checklist (Error, Empty, Concurrency, Permissions).
   - **Center Column (Planning Poker Arena & Deck)**:
     - Virtual poker table felt with surrounding participant avatars.
     - Server-synchronized 3D card flip reveal animation.
     - Outlier spotlight banner highlighting high/low voters with neutral prompting.
     - Docked bottom Fibonacci card deck (1, 2, 3, 5, 8, 13, 21, ?) with instant tactile selection feedback.
   - **Right Column (AI Advisory & Calibration Reference)**:
     - Divergence Analyzer hypothesis panel (with `[Trigger Re-Vote]` and `[SPIDR Slice]` triggers).
     - Reference Matcher historical story benchmarks unlocked on reveal.
     - Collapsible Point Reference Library sidebar for team calibration.

2. **Responsive Breakpoints**:
   - **Desktop (≥ 1024px)**: 3-column full command center layout.
   - **Tablet (768px – 1023px)**: 2-column layout (Left story & AI collapsible into sliding drawers; Center arena full width).
   - **Mobile (< 768px)**: Single-column vertically stacked view with bottom sheet card drawer and swipeable tabs between Arena, Story Doctor, and AI Insights.

3. **Facilitator Controls UI**:
   - Sticky top bar with short code (`SWB-42`) copy link.
   - Flow triggers: `[Review Story Doctor]`, `[Start Voting]`, `[Reveal Cards]`, `[Trigger Re-Vote]`, `[SPIDR Slice]`, `[Finalize & Next]`.
   - Roster menu with participant role switching (`Estimator` ↔ `Observer`) and facilitator transfer.
