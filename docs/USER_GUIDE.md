# Scrum Poker AI — User Guide

A real-time, zero-auth Planning Poker web application designed for agile teams, featuring a high-performance **Rust (Tokio/Axum)** backend, **React + TypeScript + Tailwind CSS** frontend, and a **server-enforced reveal gate** that eliminates anchoring bias.

---

## Table of Contents

1. [Key Features](#1-key-features)
2. [Quick Start & Setup](#2-quick-start--setup)
3. [Room Lifecycle & Room Codes](#3-room-lifecycle--room-codes)
4. [Roles & Participation Modes](#4-roles--participation-modes)
5. [The Estimation Flow](#5-the-estimation-flow)
6. [Session Recovery & Multi-Tab Behavior](#6-session-recovery--multi-tab-behavior)
7. [Architecture Overview](#7-architecture-overview)

---

## 1. Key Features

* **⚡ Zero-Auth Simplicity**: No account creation, passwords, or OAuth credentials required. Facilitators and team members join in seconds using memorable 6-character room codes (e.g. `SWB-42`, `ZBE-55`).
* **🛡️ Server-Enforced Reveal Gate**: Peer votes are strictly masked at the protocol level during voting (`has_voted: bool`). Actual card numbers are impossible to inspect or leak over WebSockets until the Facilitator triggers card reveal.
* **🃏 3D Card Flip Animations**: Realistic felt poker arena with 3D card flipping animations for vote reveals, consensus highlights, and outlier spread detection.
* **👑 Non-Voting Facilitator Support**: Scrum Masters and Product Managers can create and lead rooms with full control without being forced into an estimating role or skewing team quorum.
* **🔄 Seamless Session Recovery**: Reconnecting participants automatically reclaim their seat and voting state on page refresh via cached `localStorage` UUIDs.

---

## 2. Quick Start & Setup

### Prerequisites
* **Rust**: `1.80+` (Cargo)
* **Node.js**: `v20+` and `npm`

### Running Standalone (Production Mode)

The Rust Axum backend serves both the WebSocket API and the pre-built React frontend as a single web server:

```bash
# 1. Build the frontend client
cd client && npm run build && cd ..

# 2. Run the server
cargo run --bin server
```
Open **`http://localhost:3000`** in your browser.

### Running in Development Mode

```bash
# Terminal 1: Backend API & WebSocket server
cargo run --bin server

# Terminal 2: Frontend with Vite hot-reloading
cd client && npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 3. Room Lifecycle & Room Codes

### Unified 6-Character Room Codes
Every room is identified by an uppercase 6-character code (e.g., `SWB-42`, `FOX-19`, `ZBE-55`):
* **URL Format**: `http://localhost:3000/r/SWB-42`
* **Case-Insensitive Routing**: Typing `swb-42`, `SWB-42`, or `Swb-42` resolves to the same room.

### Creating a Room
1. Visit the home lobby (`http://localhost:3000`).
2. Click **⚡ Create Room Instantly** to auto-generate a new room code, or expand **+ Custom room code override** to specify your own (e.g. `SPRINT-42`).

### Sharing a Room
Click the **🔗 Share (SWB-42)** button in the top navigation header to copy the direct URL to your clipboard.

---

## 4. Roles & Participation Modes

| Role | Permissions & Behavior |
| :--- | :--- |
| **👑 Facilitator** | Owns room state transitions: starts voting rounds, reveals cards, triggers re-votes, and finalizes estimates. If the Facilitator disconnects, authority automatically promotes to the next senior connected Estimator. |
| **✋ Estimator** | Selects cards from the bottom Fibonacci deck (`0`, `1`, `2`, `3`, `5`, `8`, `13`, `21`, `?`), counts toward voting quorum, and factors into consensus calculations. |
| **👁️ Observer** | Non-voting participant (e.g. Stakeholders, Guests, or Scrum Masters). The card selector deck is hidden, the table card displays `Observer`, and the user is excluded from quorum calculations. |

> **Note**: A Facilitator can participate as either an **Estimator** (voting Facilitator) or an **Observer** (non-voting Facilitator).

### Switching Roles or Nicknames
Click your user badge in the top-right corner anytime during a session to update your nickname, avatar color, or toggle between **Estimator** and **Observer**.

---

## 5. The Estimation Flow

```
[1. Idle / Setup] ──► [2. Voting (Private)] ──► [3. Reveal (3D Flip)] ──► [4. Finalize / Re-Vote]
```

1. **Start Voting**: The Facilitator clicks **▶ Start Voting**. The room transitions to `Voting`, and the center table hub displays the active count of estimators who have cast their votes.
2. **Casting Votes**: Estimators pick a Fibonacci card from the bottom dock.
   * Your chosen card is highlighted.
   * Peer participants only see a checkmark (**✓ Voted**) with the number masked.
   * Clicking an already-selected card retracts your vote.
3. **Reveal Cards**: The Facilitator clicks **👁 Reveal Cards**.
   * All cards flip face-up with 3D animations.
   * The center hub calculates agreement percentages and spread statistics (e.g., `✓ Consensus (100%)` or `⚡ HighOutlier • Spread: 5 ↔ 13 pts`).
4. **Re-Vote or Finalize**:
   * If discussion uncovers new edge cases, the Facilitator clicks **↺ Re-Vote Round** to increment the round and reset cards face-down.
   * Once alignment is reached, the Facilitator clicks **✓ Finalize Estimate**.

---

## 6. Session Recovery & Multi-Tab Behavior

* **Origin-Scoped Session**: Browser tabs in the same browser profile share `localStorage`. Opening a second tab to the same room will reconnect as the same participant rather than creating a duplicate.
* **Testing Multiple Users Locally**: To test multi-user scenarios on a single machine:
  * **User 1**: Open a standard browser window (`http://localhost:3000/r/SWB-42`).
  * **User 2**: Open an **Incognito / Private Window** (`Ctrl+Shift+N` / `Cmd+Shift+N`) to `http://localhost:3000/r/SWB-42`.
  * **User 3**: Open a secondary browser (e.g. Firefox or Safari) or your mobile phone on the same local network.

---

## 7. Architecture Overview

* **Backend**: Rust 2021 edition using Tokio asynchronous tasks, Axum HTTP / WebSocket router, and Serde JSON RPC messaging.
* **Actor State Machine**: In-memory `RoomActor` state machine executing state changes over asynchronous Tokio channels (`mpsc`, `broadcast`, `oneshot`).
* **Frontend**: React 18 SPA built with TypeScript, Tailwind CSS, and Vite.
* **Reveal Gate Security**: State-dependent serializer projections (`RoomStateProjection`) that prevent unrevealed card values from traversing the network.
