# Reference Matcher & Embedding Architecture

Type: grilling
Status: resolved
Blocked by: 02, 10

## Question

How should resolved historical stories from past rooms and seed imports be chunked, embedded, and indexed in PostgreSQL (`pgvector`) from Rust, and how should nearest-neighbor cosine similarity and AI baseline point suggestions be computed and strictly withheld behind the Reveal Gate until card flip?

## Answer

1. **Embedding Pipeline & PostgreSQL `pgvector` Schema**:
   - **Composite Story Representation**: Vectorizes stories by formatting composite text: `"{title}\n{description}\nAcceptance Criteria:\n{ac_items}"`.
   - **Database Schema**:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     CREATE TABLE historical_stories (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         team_namespace VARCHAR(64) NOT NULL,
         title TEXT NOT NULL,
         description TEXT NOT NULL,
         acceptance_criteria JSONB NOT NULL DEFAULT '[]',
         final_points INTEGER NOT NULL,
         consensus_percentage NUMERIC(5,2),
         divergence_note TEXT,
         embedding vector(1536),
         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
     );
     CREATE INDEX idx_historical_stories_embedding 
     ON historical_stories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
     CREATE INDEX idx_historical_stories_namespace ON historical_stories(team_namespace);
     ```

2. **Similarity-Weighted Fibonacci Baseline Calculation**:
   - Computes top 3–5 nearest neighbor stories via cosine similarity `1 - (embedding <=> $query) >= 0.70` filtered by `team_namespace`.
   - AI Baseline point estimate is derived as the similarity-weighted average of historical points, snapped to the nearest Fibonacci card value (e.g. weighted score 4.7 snaps to `5`).

3. **Cold Start Auto-Seeding**:
   - When a new team room namespace is created, the system auto-seeds 6 benchmark stories from the Point Reference Library (1, 2, 3, 5, 8, 13 points) into `historical_stories`, ensuring immediate calibration from the very first story.

4. **Reveal Gate Asynchronous Confinement**:
   - Baseline computation and neighbor lookups run asynchronously in the background as soon as a story enters the `Voting` phase.
   - Results are held strictly in server RAM inside the Tokio room actor and stripped from all client WebSocket payloads (`ai_baseline: None, reference_matches: []`).
   - The server only broadcasts matches and baseline in the `CardsRevealed` event payload, preventing anchoring bias and client-side inspection.
