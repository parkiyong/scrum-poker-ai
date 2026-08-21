# Rust Real-time WebSocket Protocol & State Machine

Type: grilling
Status: resolved
Blocked by: 01

## Question

What is the exact WebSocket event contract, typed client/server JSON message schema, and state machine transitions (Waiting, PreVoteReview, PrivateVoting, Revealed, OutlierDiscussion, VerticalSlicing, Finalized) in Tokio/Axum that enforces the server-side Reveal Gate and guarantees votes/AI predictions are not leaked to clients pre-reveal?

## Answer

1. **7-Phase Estimation State Machine**:
   - `Idle`: No active story selected; facilitator manages backlog queue.
   - `StoryDoctorReview`: Story loaded; pre-vote INVEST audit, edge-case checklist, and technical complexity summary displayed. Facilitator triggers `StartVoting`.
   - `Voting`: Private voting active. Server collects votes in-memory but projects them to clients strictly as `has_voted: bool`. AI baseline is pre-computed silently in background.
   - `Revealed`: Facilitator triggers `RevealCards`. Server unlocks all vote values, calculates distribution metrics (consensus %, outlier spread), and broadcasts Reference Matcher stories and AI baseline.
   - `Discussing`: Outlier spotlight and Divergence Analyzer axis hypothesis active. Facilitator can accept points or trigger `TriggerReVote`.
   - `Slicing`: Advisory SPIDR vertical slice breakdown displayed (prompted when points >= 8 or split); approved slices are enqueued.
   - `Finalized`: Final estimate locked, round telemetry saved, story marked estimated; room reverts to `Idle` or advances queue.

2. **Server-Enforced Reveal Gate Architecture**:
   - State-dependent serialization projection in Rust: during `Voting`, the room actor broadcasts `RoomStatePublicVoting` where `votes` maps to booleans and `ai_baseline` / `reference_matches` are omitted (`None`).
   - Only on transition to `Revealed` does `RoomStatePublicRevealed` construct and broadcast the unmasked payload, guaranteeing zero possibility of client-side inspection or network packet leakage.

3. **Multi-Round Archival**:
   - On re-vote, active votes and divergence analysis are pushed to a `rounds: Vec<RoundHistory>` log, resetting all active votes to unvoted for a clean round.

4. **WebSocket Message Schema (Tagged JSON Enums)**:
   - **Client Commands (`ClientCommand`)**:
     - `JoinRoom { participant_id, nickname, avatar, role }`
     - `SelectStory { story_id }`
     - `StartVoting`
     - `CastVote { value }`
     - `RetractVote`
     - `RevealCards`
     - `TriggerReVote`
     - `TriggerSlice`
     - `ApplySlices { slices }`
     - `FinalizeStory { points }`
     - `SkipStory`
     - `UpdateRole { target_id, new_role }`
     - `Ping`
   - **Server Events (`ServerEvent`)**:
     - `RoomSnapshot { state }`
     - `ParticipantJoined { participant }`
     - `ParticipantLeft { participant_id }`
     - `ParticipantRoleChanged { participant_id, new_role }`
     - `FacilitatorChanged { new_facilitator_id }`
     - `VoteCast { participant_id }` (masked)
     - `VoteRetracted { participant_id }`
     - `CardsRevealed { votes, distribution, ai_baseline, reference_matches }`
     - `DivergenceHypothesisGenerated { hypothesis, outlier_prompt }`
     - `VerticalSlicesProposed { slices }`
     - `RoundReset { round_number, previous_round }`
     - `StoryFinalized { story_id, points, telemetry }`
     - `Error { code, message }`
     - `Pong`
