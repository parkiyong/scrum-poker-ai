# Rust Real-time WebSocket Protocol & State Machine

Type: grilling
Status: open
Blocked by: 01

## Question

What is the exact WebSocket event contract, typed client/server JSON message schema, and state machine transitions (Waiting, PreVoteReview, PrivateVoting, Revealed, OutlierDiscussion, VerticalSlicing, Finalized) in Tokio/Axum that enforces the server-side Reveal Gate and guarantees votes/AI predictions are not leaked to clients pre-reveal?
