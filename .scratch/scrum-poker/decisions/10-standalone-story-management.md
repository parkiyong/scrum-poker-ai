# Standalone Story Management & Ingestion/Export Formats

Type: grilling
Status: resolved
Blocked by: 01

## Question

How should stories be created, edited, queued, bulk-imported (via Markdown paste, CSV, or JSON), and exported (formatted Markdown summaries, clipboard copy, CSV) in the standalone web UI and Rust backend without any external issue tracker dependency?

## Answer

1. **Multi-Format Smart Ingestion Engine**:
   - **Markdown Paste**: Parses raw markdown notes into stories by recognizing header titles (`#`, `##`, `###`), body descriptions, and checklist items (`- [ ] ...`) as Acceptance Criteria.
   - **CSV / TSV Upload**: Maps columns (`Title`, `Description`, `Acceptance Criteria`, `Tags/Category`) with delimiter auto-detection.
   - **JSON Array**: Validates typed schema `[ { "title": String, "description": String, "acceptance_criteria": Vec<String> } ]`.
   - **Visual Staging Table**: Displays a pre-import preview modal allowing the Facilitator to edit fields, reorder items, and confirm queue injection.

2. **In-Flight Queue Management**:
   - Facilitator has full real-time queue control: inline story creation, mid-session text/AC edits, drag-and-drop reordering, skipping, and direct insertion of SPIDR vertical slices into the next queue position.

3. **Multi-Channel Export Engine**:
   - **One-Click Markdown Summary (Clipboard)**: Formatted table with Story Identifier, Title, Final Points, Consensus %, and Divergence Notes, ready for pasting into Slack, Notion, GitHub, Linear, or Jira.
   - **CSV Spreadsheet**: Downloadable dataset for sprint tracking.
   - **JSON Telemetry Bundle**: Full session telemetry including multi-round votes and AI divergence hypotheses.

4. **Historical PostgreSQL Indexing for Reference Matcher**:
   - On `StoryFinalized`, the agreed story title, description, points, and divergence notes are saved to a `historical_stories` table in PostgreSQL with a computed `pgvector` embedding, isolated per team namespace (`team_namespace`), feeding the AI Reference Matcher for future estimation sessions.
