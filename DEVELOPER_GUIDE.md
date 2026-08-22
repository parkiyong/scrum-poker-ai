# Scrum Poker AI — Developer Guide

> Operational guide for setting up, running, testing, and developing **Scrum Poker AI**.

📖 [User Guide](USER_GUIDE.md) · 🛠️ [Developer Guide](DEVELOPER_GUIDE.md) · 🤝 [Contributing](CONTRIBUTING.md) · 🧠 [OKF Knowledge Bundle](.okf/index.md) · 🌐 [Product Spec](.scratch/scrum-poker/spec.md)

---

## Table of Contents

1. [Prerequisites & Toolchain](#1-prerequisites--toolchain)
2. [Local Environment Setup](#2-local-environment-setup)
3. [Running the Application](#3-running-the-application)
4. [Testing & Quality Verification](#4-testing--quality-verification)
5. [Project Directory Layout](#5-project-directory-layout)
6. [Architecture & System Knowledge (OKF)](#6-architecture--system-knowledge-okf)

---

## 1. Prerequisites & Toolchain

* **Rust**: `1.80+` (`rustup default stable`)
* **Node.js**: `v20+` & `npm`
* **Docker & Docker Compose**: For local PostgreSQL + `pgvector` container management

---

## 2. Local Environment Setup

### 2.1 Clone & Environment Variables

```bash
git clone https://github.com/parkiyong/scrum-poker-ai.git
cd scrum-poke-ai

# Copy environment variable template
cp .env.example .env
```

### 2.2 Start Database via Docker Compose

```bash
docker compose up -d db
```
This launches a PostgreSQL 16 container with `pgvector` pre-configured on port `5432` (`DATABASE_URL=postgres://postgres:postgres@localhost:5432/scrum_poker`).

To check container health:
```bash
docker compose ps
```

### 2.3 Install Client Dependencies

```bash
cd client
npm install
cd ..
```

---

## 3. Running the Application

### Option A: Development Mode (Recommended)

Run the backend and frontend in separate terminals with hot reloading:

```bash
# Terminal 1: Backend Rust server
cargo run --bin server

# Terminal 2: Frontend Vite dev server
cd client && npm run dev
```

* **Vite Web UI**: [http://localhost:5173](http://localhost:5173) (proxies API / WS calls to port 3000)
* **Backend API / WebSocket**: [http://localhost:3000](http://localhost:3000)

### Option B: Standalone Mode (Single Binary)

Build the frontend bundle and serve everything from the Axum binary:

```bash
# 1. Build frontend bundle
cd client && npm run build && cd ..

# 2. Start server
cargo run --bin server
```
* **Unified Web App**: [http://localhost:3000](http://localhost:3000)

### Option C: Full Containerized Stack

```bash
docker compose --profile full up --build
```
* **Unified Web App in Docker**: [http://localhost:3000](http://localhost:3000)

---

## 4. Testing & Quality Verification

### 4.1 Backend Rust Tests

Run all unit, actor state machine, reveal gate, and WebSocket integration test suites:

```bash
cargo test
```

To run a specific test suite:
```bash
# Run room actor tests
cargo test --test room_actor_tests

# Run reveal gate projection tests
cargo test --test reveal_gate_tests

# Run WebSocket integration tests
cargo test --test websocket_integration_tests
```

### 4.2 Frontend React Tests

Run Vitest unit and component tests:

```bash
cd client
npm test

# Run tests in watch mode
npm run test:watch
```

### 4.3 Formatting & Linting

Before submitting code, ensure all linters and formatters pass:

```bash
# Rust formatting & clippy
cargo fmt --check
cargo clippy -- -D warnings

# Frontend TypeScript checking & linting
cd client
npm run lint
```

---

## 5. Project Directory Layout

```
scrum-poke-ai/
├── server/                     # Rust backend crate (Tokio / Axum)
│   ├── src/
│   │   ├── actor/              # RoomActor, RoomRegistry, and state machine transitions
│   │   ├── domain/             # Domain entities, Reveal Gate serializers, Room Codes
│   │   ├── ws/                 # Axum WebSocket handlers & broadcast dispatchers
│   │   ├── routes.rs           # REST route definitions & SPA fallback handler
│   │   ├── lib.rs              # Library exports for unit/integration testing
│   │   └── main.rs             # Application entrypoint
│   └── tests/                  # Integration tests (WebSockets, Reveal Gate, Failover)
│
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Poker Arena, 3D Flip Card, Deck Picker, Facilitator Bar
│   │   ├── hooks/              # useRoomSocket, useSessionStorage
│   │   ├── views/              # LobbyView (Home) and RoomView (Poker Arena)
│   │   ├── types/              # TypeScript types and WebSocket message contracts
│   │   └── utils/              # Session persistence and short code formatting
│   └── src/__tests__/          # Frontend component and integration tests
│
├── .okf/                       # Open Knowledge Format (OKF v0.2) canonical knowledge base
│   ├── architecture/           # Deep architecture concepts (Actors, Client, Docker)
│   ├── domain/                 # Phases, Roles, Room Codes & Consensus math
│   ├── security/               # Server Reveal Gate & Zero-Auth session recovery
│   ├── protocol/               # Tagged JSON RPC WebSocket schemas
│   └── decisions/              # Architectural Decision Records (ADRs)
│
├── .scratch/scrum-poker/       # Local issue tracker & system specifications
│   ├── map.md                  # Project tracer-bullet roadmap
│   ├── spec.md                 # Product & system technical specification
│   ├── issues/                 # Individual feature tickets
│   └── decisions/              # Architectural decision tickets
│
├── docker-compose.yml          # Local PostgreSQL + pgvector & full stack services
├── Dockerfile                  # Multi-stage production container build
├── USER_GUIDE.md               # User & facilitator documentation
├── DEVELOPER_GUIDE.md          # Developer operational guide (this document)
├── CONTRIBUTING.md             # Contribution guidelines & workflow
└── README.md                   # Project overview & quick start
```

---

## 6. Architecture & System Knowledge (OKF)

To eliminate documentation drift, deep system architecture, security invariants, protocol schemas, and decision records are maintained in the [Open Knowledge Format bundle](.okf/index.md):

* 🏛️ **Architecture & Actor Model**:
  * [Tokio In-Memory Actor Model](.okf/architecture/tokio-in-memory-actor-model.md)
  * [Multi-Room Registry](.okf/architecture/multi-room-registry.md)
  * [React Felt Arena Client](.okf/architecture/react-arena-client.md)
  * [Local Infrastructure & Docker](.okf/architecture/local-infrastructure-and-docker.md)
* 🛡️ **Security Invariants**:
  * [Server-Enforced Reveal Gate](.okf/security/server-enforced-reveal-gate.md)
  * [Zero-Auth Session Recovery](.okf/security/zero-auth-session-recovery.md)
* 📡 **WebSocket Protocol Specifications**:
  * [Tagged JSON RPC Client Commands & Server Events](.okf/protocol/tagged-json-rpc-events.md)
* 📋 **Architectural Decision Records**:
  * [ADR Index](.okf/decisions/index.md)
