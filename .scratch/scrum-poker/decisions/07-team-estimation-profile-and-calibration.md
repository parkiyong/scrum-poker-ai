# Team Estimation Profile & Rolling Calibration Model

Type: grilling
Status: resolved
Blocked by: 05

## Question

What algorithms, telemetry schemas, and PostgreSQL views calculate rolling sprint velocity bands, estimation consistency percentages, and category bias (e.g. backend vs frontend underestimation) without violating the boundary against individual scoring surfaces, and how does the rolling calibration model adjust Fibonacci mappings over time?

## Answer

1. **Strict Team-Level Privacy Boundary**:
   - Persistent storage records only anonymized vote frequency histograms (e.g. `{ "3": 1, "5": 3 }`), round counts, and team velocity metrics.
   - Individual participant IDs and nicknames are completely excluded from historical telemetry and database schemas, preventing any individual developer performance tracking or leaderboard surfaces.

2. **Database Schema (`team_estimation_profiles`)**:
   ```sql
   CREATE TABLE team_estimation_profiles (
       team_namespace VARCHAR(64) PRIMARY KEY,
       total_stories_estimated INTEGER NOT NULL DEFAULT 0,
       total_points_estimated INTEGER NOT NULL DEFAULT 0,
       round_one_consensus_rate NUMERIC(5,2) DEFAULT 0.0,
       avg_rounds_per_story NUMERIC(3,2) DEFAULT 1.0,
       slicing_rate NUMERIC(5,2) DEFAULT 0.0,
       velocity_band_avg NUMERIC(5,1) DEFAULT 0.0,
       velocity_band_stddev NUMERIC(5,1) DEFAULT 0.0,
       category_metrics JSONB NOT NULL DEFAULT '{}',
       calibration_curve JSONB NOT NULL DEFAULT '{}',
       updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

3. **4 Core Refinement Health Metrics**:
   - **Velocity Band**: 3-session rolling average points with standard deviation range (e.g. `38 ± 5 pts`).
   - **First-Round Consensus Rate (%)**: Percentage of stories converging on Round 1 without re-votes.
   - **Slicing & Re-Vote Rate (%)**: Percentage of stories triggering SPIDR vertical slicing or multi-round debate.
   - **Category Bias Index**: Breakdown across story tags (e.g. *Database/Infra* vs *Frontend UI*), highlighting categories with high divergence or round count inflation.

4. **Decaying Rolling-Window Calibration Model**:
   - Uses an exponential decay window over the last 50 finalized stories within the `team_namespace`.
   - Empirically calculates the team's custom Fibonacci distribution curve to adjust the Reference Matcher's baseline suggestions to fit the team's unique sizing culture.

5. **UI Surface**:
   - Accessible via `[Team Profile & Calibration]` in the room navigation for sprint planning capacity checks and retro reviews.
