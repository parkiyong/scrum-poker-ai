---
type: Architectural Decision Record
title: "ADR-004: Docker Compose for Local pgvector Infrastructure"
description: Standardizing local vector database provisioning and containerized runtime deployment with Docker Compose.
tags:
  - decision
  - adr
  - docker
  - pgvector
  - postgresql
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:55:00Z"
status: stable
sources:
  - id: infrastructure-concept
    resource: /.okf/architecture/local-infrastructure-and-docker.md
    title: Local Infrastructure & Docker Architecture
---

# ADR-004: Docker Compose for Local pgvector Infrastructure

## Context

Phase 4 of the roadmap introduces semantic reference matching using 1536-dimensional OpenAI/Gemini vector embeddings stored in PostgreSQL via the `pgvector` extension. Installing and configuring PostgreSQL with compiled vector extensions across diverse developer host machines (macOS, Linux, Windows WSL) introduces friction and onboarding variance.

## Decision

We standardize local database provisioning and full-stack containerization using Docker Compose:
1. Provide a `docker-compose.yml` service `db` based on the official `pgvector/pgvector:pg16` image with automated healthchecks.
2. Provide a multi-stage `Dockerfile` (Node 20 + Rust 1.80) that builds a single lightweight container serving both the Axum backend and static frontend SPA assets.
3. Allow developers to run either hybrid mode (`docker compose up -d db` + local `cargo`/`npm`) or full container mode (`docker compose --profile full up`).

## Consequences

* **Positive**: Zero-setup local `pgvector` environment, reproducible CI/CD testing, single-command full-stack containerization.
* **Negative**: Requires developers to have Docker/Docker Compose installed locally when working with Phase 4 vector persistence.
