# Design Patterns – Quick Revision (Node.js Backend)

Most-used patterns in Node.js backend apps, with snippets for interview revision. Aligns with **MVC, CQRS, Saga**, resiliency, and microservices (per Microsoft Senior Consultant focus).

---

## 1. Singleton

**When:** One shared instance (DB connection, config, logger).  
**Why:** Avoid duplicate connections and ensure single source of truth.

```javascript
// Node.js modules are singletons by default when required
// Explicit singleton:
class Database {
  static instance = null;
  static getInstance() {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}
const db = Database.getInstance();
```

---

## 2. Factory

**When:** Create objects without specifying exact class; hide construction logic.  
**Why:** Decouple creation from usage; support multiple implementations (e.g. different storage backends).

```javascript
function createLogger(type) {
  const loggers = {
    console: () => ({ log: (msg) => console.log(msg) }),
    file: () => ({ log: (msg) => fs.appendFileSync('app.log', msg) }),
  };
  return (loggers[type] || loggers.console)();
}
const logger = createLogger('console');
```

---

## 3. Repository

**When:** Abstract data access behind a domain-focused API.  
**Why:** Keeps business logic independent of DB/datasource; easier testing and swapping storage.

```javascript
class UserRepository {
  constructor(db) { this.db = db; }
  async findById(id) { return this.db.query('SELECT * FROM users WHERE id = ?', [id]); }
  async save(user) { return this.db.query('INSERT INTO users SET ?', user); }
}
// Service uses repository, not raw DB
class UserService {
  constructor(repo) { this.repo = repo; }
  async get(id) { return this.repo.findById(id); }
}
```

---

## 4. Strategy

**When:** Interchangeable algorithms/behaviours (validation, pricing, auth).  
**Why:** Open/closed principle; add new strategies without changing callers.

```javascript
const strategies = {
  jwt: (req) => req.headers.authorization?.startsWith('Bearer '),
  apiKey: (req) => !!req.headers['x-api-key'],
};
function authenticate(req, strategyName = 'jwt') {
  const strategy = strategies[strategyName];
  return strategy ? strategy(req) : false;
}
```

---

## 5. Middleware

**When:** Cross-cutting pipeline (auth, logging, body parsing, error handling).  
**Why:** Reusable, composable request/response processing (Express, Koa).

```javascript
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}
function auth(req, res, next) {
  if (!req.headers.authorization) return res.status(401).send('Unauthorized');
  next();
}
app.use(logger);
app.use('/api', auth);
```

---

## 6. Observer / Event-Driven

**When:** Loose coupling; multiple subscribers react to one event (order placed → email, audit, analytics).  
**Why:** Scalability, async processing, microservices-friendly.

```javascript
const EventEmitter = require('events');
const bus = new EventEmitter();
bus.on('order.created', (order) => emailService.sendConfirmation(order));
bus.on('order.created', (order) => auditService.log(order));
bus.emit('order.created', { id: 1, total: 99.99 });
```

---

## 7. Decorator / Wrapper

**When:** Add behaviour around existing logic (caching, retries, logging) without changing the core.  
**Why:** Single responsibility; composable enhancements.

```javascript
function withRetry(fn, max = 3) {
  return async function (...args) {
    for (let i = 0; i < max; i++) {
      try { return await fn.apply(this, args); }
      catch (e) { if (i === max - 1) throw e; }
    }
  };
}
const fetchUser = withRetry(async (id) => api.get(`/users/${id}`));
```

---

## 8. Dependency Injection (DI)

**When:** Pass dependencies (DB, repo, logger) into constructors/functions.  
**Why:** Testability (mock deps), flexibility, explicit contracts.

```javascript
function createOrderService({ orderRepo, eventBus, logger }) {
  return {
    async placeOrder(data) {
      const order = await orderRepo.save(data);
      eventBus.emit('order.placed', order);
      logger.info('Order placed', order.id);
      return order;
    },
  };
}
const orderService = createOrderService({ orderRepo, eventBus, logger });
```

---

## 9. Circuit Breaker

**When:** Protect against cascading failures when calling external/remote services.  
**Why:** Resiliency; fail fast and recover (aligned with “resiliency” in JD).

```javascript
function circuitBreaker(fn, threshold = 3) {
  let failures = 0;
  let state = 'closed';
  return async function (...args) {
    if (state === 'open') throw new Error('Circuit open');
    try {
      const result = await fn.apply(this, args);
      failures = 0;
      return result;
    } catch (e) {
      if (++failures >= threshold) state = 'open';
      throw e;
    }
  };
}
const safeCall = circuitBreaker(externalApi.get, 3);
```

---

## 10. CQRS (Command Query Responsibility Segregation)

**When:** Separate read and write models; different scaling/optimisation for queries vs commands.  
**Why:** Scalability, clear boundaries; often used with Event Sourcing.

```javascript
// Command: change state
async function createOrderCommand(payload) {
  const order = await orderRepo.create(payload);
  await eventBus.publish('OrderCreated', order);
  return order.id;
}
// Query: read only, no side effects
async function getOrderQuery(id) {
  return readModel.getOrder(id); // e.g. denormalised view / cache
}
// API layer
app.post('/orders', (req, res) => createOrderCommand(req.body).then(id => res.json({ id })));
app.get('/orders/:id', (req, res) => getOrderQuery(req.params.id).then(data => res.json(data)));
```

---

## 11. Saga (Distributed Transactions)

**When:** Multi-step workflow across services where each step can compensate on failure.  
**Why:** Eventual consistency in microservices without distributed locks.

```javascript
// Orchestration style: central coordinator runs steps and compensations
async function placeOrderSaga(data) {
  const steps = [];
  try {
    const payment = await paymentService.charge(data.payment);
    steps.push(() => paymentService.refund(payment.id));
    const order = await orderService.create(data.order);
    steps.push(() => orderService.cancel(order.id));
    await inventoryService.reserve(data.items);
    return order;
  } catch (e) {
    for (const compensate of steps.reverse()) await compensate();
    throw e;
  }
}
```

---

## 12. MVC (Model–View–Controller) in API context

**When:** Structure API: Model = data/domain, Controller = HTTP handlers, “View” = JSON response.  
**Why:** Separation of concerns; familiar and aligns with “MVC” in JD.

```javascript
// Model: domain + data access
const userModel = { findById: (id) => db.query('SELECT * FROM users WHERE id = ?', [id]) };
// Controller: handle request, delegate to model, shape response
async function getUserController(req, res) {
  const user = await userModel.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}
app.get('/users/:id', getUserController);
```

---

## Quick reference

| Pattern        | Use case                          | One-liner |
|----------------|-----------------------------------|-----------|
| Singleton      | Single shared instance            | One instance (DB, config) |
| Factory        | Create without knowing concrete   | `createX(type)` returns impl |
| Repository     | Abstract data access              | Service talks to repo, not DB |
| Strategy       | Swappable algorithm               | Auth/validation/pricing variants |
| Middleware     | Request pipeline                  | auth, log, parse, error |
| Observer       | Event-driven, many subscribers    | `emit` / `on` |
| Decorator      | Wrap with extra behaviour         | retry, cache, log |
| DI             | Inject dependencies               | Pass deps into constructor/fn |
| Circuit Breaker| Resilient external calls          | Open after N failures |
| CQRS           | Separate read/write               | Commands vs queries |
| Saga           | Cross-service workflow + compensate | Steps + rollback |
| MVC            | Structure API                     | Model, Controller, response |

---

## Anti-patterns to avoid (good to mention in interview)

- **God object / fat service** – one class doing everything → split by responsibility.
- **Tight coupling** – direct DB/calls in business logic → use Repository + DI.
- **No circuit breaker** – calling external APIs without failure handling → use Circuit Breaker + retries.
- **Synchronous chain across services** – long request chains → prefer events/async (Observer, Saga).
- **Leaky abstraction** – repository exposing SQL or storage details → keep API domain-focused.

Use this for quick revision; combine with your Microsoft Senior Consultant prep (Azure, security, scalability) when discussing real projects.
