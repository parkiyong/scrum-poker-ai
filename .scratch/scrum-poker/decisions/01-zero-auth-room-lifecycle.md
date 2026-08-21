# Zero-Auth Session & Room State Lifecycle

Type: grilling
Status: resolved
Blocked by:

## Question

How does a facilitator initiate, share, persist, and close an estimation room without user accounts, and how are reconnects, ephemeral estimator identities, room secret tokens, and facilitator permissions securely managed across browser refreshes and mobile devices?

## Answer

1. **Room Identifiers & Addressing**:
   - Rooms are addressed via memorable human-readable slugs (e.g. `scrum.app/r/swift-badger-42`) with an equivalent 6-character alphanumeric join code (e.g. `SWB-42`) for mobile entry.
   - Facilitators can optionally provide a custom slug at room creation if available.

2. **Facilitator Ownership & Promotion**:
   - First-connection / socket-bound ownership: The client that creates the room becomes the initial Facilitator.
   - If the Facilitator disconnects, ownership automatically promotes to the next oldest connected Estimator in the room roster to prevent stalled sessions.
   - The Facilitator can also explicitly transfer facilitator authority to any connected Estimator via the room roster.

3. **Participant Identity & Seamless Reconnects**:
   - On joining, the user enters a Nickname, avatar/color, and role (`Estimator` or `Observer`).
   - A unique client `participant_id` (UUIDv4) is generated and cached in the browser's `localStorage` scoped to `scrum_poker:room:<slug>`.
   - On WebSocket reconnection (page refresh, network switch, mobile sleep), the client sends `(room_slug, participant_id)` during handshake to immediately reclaim their seat and preserve existing submitted votes without re-prompting.

4. **In-Memory Ephemeral State Architecture**:
   - Active room state (roster, socket connections, current story, private votes, reveal gate) is held purely in server RAM via Tokio actors / concurrent memory structures in Rust.
   - Zero active database overhead: rooms exist while participants are connected and clean up when closed or empty.

5. **Role Management**:
   - Participants choose `[Estimator]` (default) or `[Observer]` upon joining.
   - The Facilitator can toggle participant roles between Estimator and Observer directly from the roster UI.
