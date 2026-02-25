# Common System Design Architectures

Interview-focused system design notes: high-level diagrams, components, data flows, **back-of-the-envelope numbers**, and trade-offs. Use these to rehearse whiteboard designs and capacity discussions.

---

## Designs

| # | System | Style | Link |
|---|--------|--------|------|
| 1 | **URL Shortener** | Read-heavy, KV, cache | [01-url-shortener.md](01-url-shortener.md) |
| 2 | **Chat / Messaging** | Real-time, WebSocket, queues | [02-chat-messaging.md](02-chat-messaging.md) |
| 3 | **Rate Limiter** | Resilience, API protection | [03-rate-limiter.md](03-rate-limiter.md) |
| 4 | **News Feed** | Feed, fan-out read/write | [04-news-feed.md](04-news-feed.md) |
| 5 | **Notification Service** | Multi-channel, async | [05-notification-service.md](05-notification-service.md) |
| 6 | **Distributed File Storage** | Blob, metadata, CDN | [06-distributed-file-storage.md](06-distributed-file-storage.md) |

---

## How to Use for Interviews

1. **Study order** – Start with [01-url-shortener](01-url-shortener.md) for back-of-the-envelope practice, then [02-chat-messaging](02-chat-messaging.md) for real-time, then branch by topic (rate limiting, feed, notifications, storage).
2. **Practice flow** – For each design: state problem → requirements → draw high-level diagram → components → data flow → run back-of-the-envelope numbers → trade-offs.
3. **Back-of-the-envelope** – Do the math aloud; state assumptions (DAU, read:write, retention) and round to 2–3 significant figures.
4. **Diagrams** – Rehearse drawing the diagram from memory (API, cache, DB, queues) in under 2–3 minutes.

Aligns with **Phase 1** in [ROADMAP.md](../ROADMAP.md): load balancing, caching, DB scaling, message queues, and designing 2–3 systems end-to-end.
