# Divergence Analyzer & Vertical Slicer Prompt Contracts

Type: grilling
Status: resolved
Blocked by: 02

## Question

How does the Rust backend mathematically classify vote distribution patterns (consensus vs. bimodal vs. high/low outlier), prompt outlier estimators in-app, synthesize concise disagreement axis hypotheses, and formulate SPIDR-based vertical slicing suggestions when final estimates reach 8+ points?

## Answer

1. **Deterministic Vote Distribution Classification (Rust Engine)**:
   - Evaluates submitted Fibonacci card values across 5 distinct patterns:
     - `Consensus`: Variance ≤ threshold or mode count ≥ 80% on adjacent Fibonacci numbers (e.g. [3, 3, 3, 5]). AI divergence analysis bypassed or displays *"High Consensus"*.
     - `HighOutlier`: Majority cluster low with 1–2 voters ≥ 2 tiers higher (e.g. [2, 3, 3, 13]). Triggers high-outlier spotlight on risk/unknowns.
     - `LowOutlier`: Majority cluster high with 1–2 voters ≥ 2 tiers lower (e.g. [8, 8, 13, 2]). Triggers low-outlier spotlight on shortcuts/reuse.
     - `BimodalSplit`: Two distinct clusters of comparable size (e.g. [2, 2, 8, 8]). Triggers architectural/scope divergence analysis.
     - `WideSpread`: Votes span ≥ 3 Fibonacci tiers without clear cluster (e.g. [1, 3, 8, 13]). Flags foundational requirement ambiguity.

2. **Divergence Analyzer LLM Prompt & Guardrails**:
   - Input: Story Title, Description, Acceptance Criteria, vote distribution histogram, and optional outlier 1-line note.
   - Strict Neutrality Guardrails:
     - The model MUST NOT pick a winner, judge which estimate is correct, or prescribe a final point value.
     - Produces 1–2 neutral sentences naming the exact axis of disagreement (e.g. *"The spread between 3 and 13 suggests divergence on whether this requires a zero-downtime database migration vs in-memory caching"*).

3. **SPIDR Vertical Slicer Breakdown**:
   - Trigger: Advisory button displayed automatically when points ≥ 8 or wide divergence persists, or manually by Facilitator via `[Propose Slices]`.
   - Methodology: Uses SPIDR (Spike, Path, Interface, Data, Rules) to break complex stories into 2–4 independently estimable child stories.
   - Output Schema: Each child slice contains `title`, `description`, and `acceptance_criteria: Vec<String>`.
   - Queue Integration: Facilitator can edit titles/AC in a modal and click `[Enqueue Slices & Replace Original Story]` to add them to the refinement queue.

4. **Outlier Spotlight Interaction**:
   - Non-judgmental in-app spotlight banner (e.g. *"Alice, what risks or edge cases are you factoring in?"*) with an optional 1-line text input to feed the Divergence Analyzer.
