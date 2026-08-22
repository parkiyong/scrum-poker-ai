# 1. Build client SPA
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build server binary
FROM rust:1-slim AS server-builder
WORKDIR /app
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
COPY Cargo.toml Cargo.lock* ./
COPY server/ ./server/
RUN cargo build --release --bin server

# 3. Final lightweight runtime image
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=server-builder /app/target/release/server /app/server
COPY --from=client-builder /app/client/dist /app/client/dist

ENV PORT=3000
EXPOSE 3000

CMD ["/app/server"]
