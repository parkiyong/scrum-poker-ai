# 🃏 Scrum Poker AI

A real-time, zero-auth Planning Poker estimation platform featuring a high-performance **Rust (Tokio / Axum)** backend, **React + TypeScript + Tailwind CSS** frontend, and a **server-enforced reveal gate**.

📖 **[Read the Full User Guide](docs/USER_GUIDE.md)** for detailed workflows, role guides, and architecture explanations.

---

## ⚡ Quick Start

### 1. Build and Run Standalone (Single Server)
```bash
# Build the frontend client
cd client && npm run build && cd ..

# Start the Rust server
cargo run --bin server
```
Open **`http://localhost:3000`** in your browser.

### 2. Development Mode
```bash
# Terminal 1: Backend
cargo run --bin server

# Terminal 2: Frontend (Vite)
cd client && npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Run Tests

```bash
# Rust test suite (unit, state machine, and WebSocket integration tests)
cargo test

# Client test suite (components, hooks, and session storage tests)
cd client && npm test
```

---

## 📂 Project Structure

```
├── server/               # Rust (Tokio / Axum) WebSocket & REST server
│   ├── src/
│   │   ├── actor/        # In-memory RoomActor & RoomRegistry
│   │   ├── domain/       # Models, 6-char Room Code generator & Reveal Gate projections
│   │   ├── ws/           # Axum WebSocket connection & broadcast handlers
│   │   ├── routes.rs     # REST endpoints & static frontend asset serving
│   │   └── main.rs       # Server entrypoint
│   └── tests/            # Automated unit and integration test suites
│
├── client/               # React 18 + TypeScript + Tailwind CSS client
│   ├── src/
│   │   ├── components/   # Felt Poker Table Arena, 3D Flip Cards, Deck Selector, Facilitator Bar
│   │   ├── hooks/        # useRoomSocket hook with zero-auth session recovery
│   │   ├── views/        # LobbyView (Home) & RoomView (Live Poker Arena)
│   │   └── utils/        # localStorage session management
│   └── src/__tests__/    # Vitest component and hook test suites
│
└── docs/
    └── USER_GUIDE.md     # Complete User Guide
```
