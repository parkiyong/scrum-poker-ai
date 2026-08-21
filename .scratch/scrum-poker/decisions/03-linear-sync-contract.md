# Linear Integration & API Key Handling in No-Auth Mode

Type: research
Status: closed
Blocked by: 01

## Question

How should Linear GraphQL queries (pulling cycle/project backlog stories, descriptions, acceptance criteria, comments, linked PRs) and mutation writebacks (story points field, summary discussion comments) execute in Rust without user OAuth accounts, and how should personal API tokens / workspace webhooks be safely provided and held in ephemeral room state?

## Status Note

Closed as Out of Scope: The application is designed to be completely standalone without dependency on Linear or third-party issue trackers. Story ingestion and export are handled natively via in-app creation and Markdown/CSV/JSON formats (see ticket 10).
