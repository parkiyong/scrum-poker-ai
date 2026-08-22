# 🃏 Scrum Poker AI

A real-time, zero-auth Planning Poker estimation platform featuring a high-performance **Rust (Tokio / Axum)** backend, **React 18 + TypeScript + Tailwind CSS** frontend, and a **server-enforced reveal gate** that eliminates cognitive anchoring bias.

📖 **[User Guide](USER_GUIDE.md)** | 🧠 **[OKF Knowledge Bundle](.okf/index.md)** | 🏛️ **[Architecture Decisions](.okf/decisions/index.md)**

---

## ⚡ Highlights

* **Zero-Auth Simplicity**: No accounts, passwords, or signup required. Join or create rooms instantly via memorable 6-character codes (e.g. `SWB-42`, `ZBE-55`).
* **Server-Enforced Reveal Gate**: Votes are physically masked at the protocol level (`has_voted: bool`) until cards are formally revealed, preventing inspection via browser DevTools.
* **3D Felt Poker Arena**: Realistic central felt poker table with 3D flip card animations, consensus indicators, and outlier spread detection.
* **Non-Voting Facilitator Support**: Scrum Masters and PMs can lead estimation rounds with full facilitator controls without being forced to vote or altering team quorum.
* **Seamless Session Recovery**: Participants automatically reclaim their seat and voting state on page refresh through client-side `localStorage` caching.

---

## 🚀 Quick Start

### Option A: Standalone Mode (Single Web Server)

```bash
# 1. Build the React client bundle
cd client && npm run build && cd ..

# 2. Start the Rust server
cargo run --bin server
```
Open **`http://localhost:3000`** in your browser.

### Option B: Development Mode (Vite Hot-Reload)

```bash
# Terminal 1: Backend WebSocket & REST server
cargo run --bin server

# Terminal 2: Frontend with Vite hot-reloading
cd client && npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Test Suites

```bash
# Backend Rust tests (unit, actor state machine, reveal gate, and WebSocket integration)
cargo test

# Frontend React tests (components, hooks, and session storage)
cd client && npm test
```

---

## 📂 Project Structure

```
├── server/               # Rust (Tokio / Axum) server
│   ├── src/
│   │   ├── actor/        # In-memory RoomActor state machine & RoomRegistry
│   │   ├── domain/       # Models, 6-char Room Code generator & Reveal Gate projections
│   │   ├── ws/           # Axum WebSocket connection & broadcast dispatchers
│   │   ├── routes.rs     # REST endpoints & static frontend asset serving
│   │   └── main.rs       # Server entrypoint
│   └── tests/            # Automated unit and integration test suites
│
├── client/               # React 18 + TypeScript + Tailwind CSS client
│   ├── src/
│   │   ├── components/   # Felt Poker Arena, 3D Flip Cards, Deck Selector, Facilitator Bar
│   │   ├── hooks/        # useRoomSocket hook with zero-auth session recovery
│   │   ├── views/        # LobbyView (Home) & RoomView (Live Poker Arena)
│   │   └── utils/        # localStorage session management
│   └── src/__tests__/    # Vitest component and hook test suites
│
├── .okf/                 # Open Knowledge Format (v0.2) knowledge bundle
│   ├── architecture/     # Tokio actor model & multi-room registry concepts
│   ├── domain/           # Estimation phases, roles, room codes & consensus engine
│   ├── security/         # Server reveal gate & zero-auth session recovery
│   ├── protocol/         # Tagged JSON RPC WebSocket schemas
│   └── decisions/        # Architectural Decision Records (ADRs)
│
├── USER_GUIDE.md         # Comprehensive user & facilitator guide
└── README.md             # Project overview & quick start
```
