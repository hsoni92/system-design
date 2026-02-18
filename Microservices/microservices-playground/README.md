# Microservices Playground

A minimal Node.js microservices codebase to see **bounded contexts**, **database-per-service** (in-memory here), and **sync service-to-service** calls in practice.

## Layout

```
microservices-playground/
├── gateway/           # Single entry: routes /users → user-service, /orders → order-service
├── user-service/      # Owns user data (bounded context: User)
├── order-service/     # Owns order data; validates user via user-service (no shared DB)
└── package.json       # Run all with npm start
```

## Run

```bash
npm install
npm start
```

Then:

- **Create a user:** `curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Alice"}'
- **Create an order (needs valid userId):** `curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"userId":"1","product":"Widget","quantity":2}'
- **List users:** `curl http://localhost:3000/users`
- **List orders:** `curl http://localhost:3000/orders`

Ports: Gateway `3000`, User service `3001`, Order service `3002`. The gateway proxies; clients only talk to `3000`.

## What this shows

| Concept | Where in code |
|--------|----------------|
| API Gateway | `gateway/index.js` — single entry, routes by path |
| Bounded context / DB per service | Each service has its own in-memory store; no cross-service DB access |
| Sync service-to-service | Order service calls User service (HTTP) to validate `userId` before creating order |
| Owner writes | Only User service writes users; only Order service writes orders |

No message broker or async events here — kept simple. Add Redis/Rabbit and an event when an order is placed to extend.
