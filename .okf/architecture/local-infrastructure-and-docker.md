---
type: Architecture Component
title: Local Infrastructure & Docker Architecture
description: Containerized local development environment utilizing Docker Compose with PostgreSQL and the pgvector extension.
tags:
  - docker
  - compose
  - postgresql
  - pgvector
  - devops
resource: file:///docker-compose.yml
generated:
  by: antigravity/2.0
  at: "2026-08-22T02:55:00Z"
status: stable
sources:
  - id: compose-file
    resource: /docker-compose.yml
    title: Docker Compose Configuration
  - id: dockerfile
    resource: /Dockerfile
    title: Multi-Stage Dockerfile
  - id: adr-004
    resource: /.okf/decisions/ADR-004-docker-compose-pgvector-infrastructure.md
    title: ADR 004 - Docker Compose & pgvector Infrastructure
---

# Local Infrastructure & Docker Architecture

Scrum Poker AI standardizes its local development infrastructure and deployment artifact through Docker and Docker Compose.

## Container Topology

```
┌──────────────────────────────────────────────────────────────────┐
│                      Docker Compose Stack                        │
│                                                                  │
│  ┌─────────────────────────┐          ┌───────────────────────┐  │
│  │   app (Container)       │          │   db (Container)      │  │
│  │   - Axum Rust Backend   ├─────────►│   - PostgreSQL 16     │  │
│  │   - Prebuilt React SPA  │  TCP     │   - pgvector Ext.     │  │
│  │   - Port 3000:3000      │  :5432   │   - Port 5432:5432    │  │
│  └─────────────────────────┘          └───────────┬───────────┘  │
│                                                   │ Volume       │
│                                       ┌───────────▼───────────┐  │
│                                       │   postgres_data       │  │
│                                       └───────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Services

### 1. Database (`db`)
* **Base Image**: `pgvector/pgvector:pg16`
* **Purpose**: Hosts PostgreSQL 16 with pre-compiled `pgvector` for 1536-dimensional historical story embeddings (`historical_stories`) and longitudinal team calibration metrics (`team_estimation_profiles`).
* **Healthcheck**: Uses `pg_isready -U postgres -d scrum_poker` with 5-second interval and retries.
* **Volume**: Persistent named volume `postgres_data` mapping to `/var/lib/postgresql/data`.

### 2. Application (`app`)
* **Multi-Stage Build (`Dockerfile`)**:
  * **Stage 1 (Node 20 Alpine)**: Builds the Vite React SPA bundle to `/app/client/dist`.
  * **Stage 2 (Rust 1.80 Slim)**: Compiles the release binary `server`.
  * **Stage 3 (Debian Bookworm Slim)**: Lean runtime image copying the binary and client static files.
* **Profile**: Activated under `--profile full` for end-to-end containerized execution.

## Developer Workflows

```bash
# Start database for local cargo/vite dev:
docker compose up -d db

# Run full containerized stack:
docker compose --profile full up --build
```
