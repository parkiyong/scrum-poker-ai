# 04: PostgreSQL pgvector Storage & Semantic Reference Matcher

**What to build:** Database persistence with PostgreSQL `pgvector` and semantic reference matching. Sets up the schema for `historical_stories` with 1536-dimensional vector embeddings and an IVFFlat cosine similarity index, seeded with standard baseline benchmark stories per team namespace. During live estimation, the AI service embeds the active story in the background while voting occurs; on card reveal, the server executes a cosine similarity search to retrieve the top-3 matching historical stories and computes a similarity-weighted Fibonacci recommendation displayed in the right AI Advisory deck.

**Blocked by:** 01 (Core Real-Time Poker Arena)

**Status:** ready-for-agent

## Acceptance criteria

- [ ] PostgreSQL migration creates `historical_stories` table with `embedding vector(1536)` column, IVFFlat index, and team namespace scoping.
- [ ] Database seed script populates default benchmark stories across 1, 2, 3, 5, 8, and 13 point tiers.
- [ ] Active story embedding is computed asynchronously during the unrevealed phase without blocking the room actor or leaking vector recommendations to clients.
- [ ] Upon transition to `Revealed` state, server queries top-3 nearest-neighbor historical stories using cosine similarity `<=>`.
- [ ] Calculates a similarity-weighted point baseline mapped to standard Fibonacci points (`[0, 1, 2, 3, 5, 8, 13, 21]`).
- [ ] Right-column AI Advisory deck renders the matched reference cards with similarity percentage tags, point values, and rationale snippets.
- [ ] Database queries use connection pooling (e.g. `sqlx`) with robust fallback if pgvector or embedding API is unreachable.
- [ ] Integration tests verify vector migration, similarity query precision, weighted baseline calculation, and reveal gate isolation.
