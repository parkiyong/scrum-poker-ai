# 02: Backlog Ingestion, Story Queue & Clipboard Export

**What to build:** Multi-format story backlog ingestion and session results export. Facilitators can bulk-import stories by pasting Markdown with acceptance criteria checkboxes, uploading CSV/TSV, or pasting JSON arrays. An interactive visual staging modal lets the facilitator preview, edit, reorder, or delete stories before importing. During the estimation session, the facilitator queues and activates stories (syncing active story details to all room participants), advances through stories, and exports finalized consensus estimates directly to the clipboard as a GitHub Markdown table or downloadable CSV.

**Blocked by:** 01 (Core Real-Time Poker Arena)

**Status:** ready-for-agent

## Acceptance criteria

- [ ] Ingestion modal supports multi-format backlog input: Markdown headers/lists with checkboxes, CSV/TSV, and raw JSON arrays.
- [ ] Visual staging review table allows editing title, description, and acceptance criteria before committing to the room queue.
- [ ] Facilitator can add, edit, reorder, and remove stories in the live room backlog queue.
- [ ] Selecting a story syncs the active story (title, description, acceptance criteria list) to all connected clients in real time.
- [ ] Story state transitions correctly from queued to actively estimating to finalized with agreed consensus points.
- [ ] 1-Click Clipboard Export formats all finalized stories into a clean Markdown table (`| Story | Estimate | Consensus % | Notes |`) ready for pasting into external documentation.
- [ ] Downloadable CSV export with full round metadata (story title, points, duration, timestamp).
- [ ] Unit and integration tests covering multi-format parser edge cases and queue synchronization events.
