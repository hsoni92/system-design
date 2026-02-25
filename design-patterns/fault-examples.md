# Fault Examples: When Patterns Are Broken

Real-world examples of design patterns gone wrong, why they fail, and what teams typically see in orgs. Use alongside `concepts.md` for interview prep and code reviews.

---

## 1. Singleton – Faults

### 1.1 Global mutable state (“convenience” singleton)

```javascript
// BAD: Singleton holding mutable global state
class AppState {
  static instance = null;
  static getInstance() {
    if (!AppState.instance) AppState.instance = new AppState();
    return AppState.instance;
  }
  constructor() {
    this.currentUser = null;  // shared, mutable
    this.featureFlags = {};
  }
}
// Anywhere in the app:
AppState.getInstance().currentUser = req.user;  // race conditions in async
```

**Why it’s broken:** Shared mutable state across requests → race conditions, flaky tests, “works on my machine” when tests don’t share the same process. Common when a team “just needs one place” for config or user without thinking about concurrency or test isolation.

### 1.2 Singleton for things that shouldn’t be singletons

```javascript
// BAD: DB connection as singleton with no pool / lifecycle
class Database {
  static instance = null;
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.connect();  // one connection for entire app
    }
    return Database.instance;
  }
}
```

**Why it’s broken:** Single connection doesn’t scale; no clear lifecycle (when to close); hard to test (can’t swap DB per test). Often seen in legacy codebases or when “we only had one DB” and the pattern was never revisited.

### 1.3 “Fake” singleton (new instance every time)

```javascript
// BAD: Returns new instance but named getInstance – misleading
class Logger {
  static getInstance() {
    return new Logger();  // new instance every call
  }
}
```

**Why it’s broken:** Name promises one instance; callers get many. Leads to duplicate file handles, duplicate connections, or inconsistent behaviour. Typical result of copy-paste or misunderstanding the pattern.

---

## 2. Factory – Faults

### 2.1 Factory that does too much (god factory)

```javascript
// BAD: Factory with business logic and side effects
function createOrderProcessor(type) {
  if (type === 'premium') {
    notifySlack('Premium order');
    return new PremiumProcessor(db, redis, emailService, analytics);
  }
  return new StandardProcessor(db);
}
```

**Why it’s broken:** Creation is mixed with notifications and branching. Hard to test, change, or add new types. Common when “we need one more type” is solved by piling logic into the factory instead of separate strategies or builders.

### 2.2 No validation of factory input

```javascript
// BAD: Unknown type returns undefined or wrong default
function createLogger(type) {
  const loggers = { console: ConsoleLogger, file: FileLogger };
  return new (loggers[type] || loggers.console)();  // typo = silent wrong impl
}
createLogger('consol');  // gets ConsoleLogger, no error
```

**Why it’s broken:** Typos and invalid types fail silently; production can use the wrong implementation. Often seen when factories are added without validation or logging of unknown types.

### 2.3 Factory returning different shapes

```javascript
// BAD: Callers must know each implementation’s API
function createStorage(type) {
  if (type === 's3') return { upload: (k, v) => s3.put(k, v) };
  if (type === 'file') return { write: (path, data) => fs.writeFile(path, data) };
}
// Caller: storage.upload vs storage.write – no common contract
```

**Why it’s broken:** No single interface; callers branch on type or break when a new backend is added. Happens when each team adds “their” backend without agreeing on a shared abstraction.

---

## 3. Repository – Faults

### 3.1 Leaky abstraction (SQL in callers / repo exposing DB)

```javascript
// BAD: Repository exposes SQL and DB details
class UserRepository {
  findActiveWithOrdersJoined() {
    return this.db.raw(`
      SELECT u.*, o.id as order_id FROM users u
      LEFT JOIN orders o ON u.id = o.user_id WHERE u.deleted_at IS NULL
    `);
  }
}
// Service now depends on "active" = deleted_at, and join shape
```

**Why it’s broken:** Domain layer gets coupled to schema and SQL. Refactors (e.g. soft delete, table split) force changes in many places. Common when “we just need this query” is implemented in the repo without a domain-oriented API.

### 3.2 Repository doing business logic

```javascript
// BAD: Repo decides business rules
class OrderRepository {
  async save(order) {
    if (order.total > 10000) {
      await this.notifyFraudTeam(order);
      order.status = 'pending_review';
    }
    return this.db.insert('orders', order);
  }
}
```

**Why it’s broken:** Persistence layer shouldn’t own approval rules or notifications. Hard to test and change; breaks single responsibility. Often introduced when “it’s just one check” is added where the data is saved.

### 3.3 No repository (direct DB in services)

```javascript
// BAD: Service talks to DB directly
class UserService {
  async getUser(id) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
  async updateEmail(id, email) {
    await this.db.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);
  }
}
```

**Why it’s broken:** No single place for data access; swapping DB or changing schema touches every service. Typical in fast-moving teams or when “we only have one DB so we don’t need a repo”.

---

## 4. Strategy – Faults

### 4.1 Strategy selection via long if/else or switch

```javascript
// BAD: Adding a strategy = editing this central switch
function getPrice(order, customerType) {
  switch (customerType) {
    case 'retail': return order.total * 1.0;
    case 'wholesale': return order.total * 0.9;
    case 'vip': return order.total * 0.8;
    default: return order.total;
  }
}
```

**Why it’s broken:** Violates open/closed: every new type forces changes here and more branching. Becomes a “pricing god function”. Very common in orgs where pricing or rules are added over time without a strategy map.

### 4.2 Strategy with hidden shared state

```javascript
// BAD: Strategy mutates shared state
const strategies = {
  jwt: (req) => { config.lastAuth = 'jwt'; return validateJwt(req); },
  apiKey: (req) => { config.lastAuth = 'apiKey'; return validateApiKey(req); },
};
```

**Why it’s broken:** Side effects and shared state make order of execution and tests unpredictable. Often introduced for “debugging” or “metrics” without a clear boundary.

### 4.3 Wrong strategy chosen at runtime

```javascript
// BAD: Strategy key from untrusted input, no validation
function authenticate(req, strategyName) {
  const strategy = strategies[strategyName];  // strategyName from query param?
  return strategy(req);  // undefined if typo → crash
}
```

**Why it’s broken:** Security and stability depend on strategy name; typos or injection can pick wrong strategy or throw. Seen when strategy selection is wired to config or request without validation.

---

## 5. Middleware – Faults

### 5.1 Order-dependent side effects

```javascript
// BAD: Behaviour depends on registration order
app.use((req, res, next) => { req.start = Date.now(); next(); });
app.use(auth);  // if auth fails, start is still set
app.use((req, res, next) => { res.set('X-Request-Time', Date.now() - req.start); next(); });
// If auth runs after the timer middleware, behaviour changes
```

**Why it’s broken:** Subtle bugs when someone reorders middleware (e.g. for “performance” or new auth). Common in large Express apps where no one documents order requirements.

### 5.2 Middleware that doesn’t call next()

```javascript
// BAD: Forgetting next() in a branch
function auth(req, res, next) {
  if (req.headers.authorization) {
    req.user = parseJwt(req.headers.authorization);
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
  // next() never called – request hangs for some clients
}
```

**Why it’s broken:** Request hangs; timeouts and confusing behaviour. Classic mistake when adding a new branch (e.g. API key path) and not calling `next()` in every path.

### 5.3 Heavy work in middleware on every request

```javascript
// BAD: DB / external call in middleware for every request
function enrichUser(req, res, next) {
  User.findById(req.user.id).then(user => {
    req.user = user;
    next();
  });
}
```

**Why it’s broken:** Adds latency and load to every request; one slow DB affects everyone. Often done to “always have full user” without considering caching or doing it only where needed.

---

## 6. Observer / Event-Driven – Faults

### 6.1 Synchronous chain disguised as “events”

```javascript
// BAD: Emit and expect immediate sync handling
bus.emit('order.created', order);
const updated = getOrder(order.id);  // assumes listener already ran and wrote to DB
```

**Why it’s broken:** Assumes listeners run synchronously and in order; breaks when listeners become async or are moved to another process. Common when moving from in-process to queue-based handlers without updating callers.

### 6.2 No error handling for listeners

```javascript
// BAD: One failing listener can break others or the emitter
bus.on('order.created', (order) => { throw new Error('Email failed'); });
bus.on('order.created', (order) => auditService.log(order));  // may never run
bus.emit('order.created', order);
```

**Why it’s broken:** One subscriber’s failure can prevent others from running or bring down the process. Typical when events are added incrementally without a policy for errors and retries.

### 6.3 Unbounded fan-out and no idempotency

```javascript
// BAD: Many subscribers, no idempotency, no ordering
bus.on('order.updated', (o) => inventoryService.sync(o));
bus.on('order.updated', (o) => analytics.track(o));
bus.on('order.updated', (o) => cache.invalidate(o));
// Same event emitted twice (retry, bug) → duplicate inventory sync, double count
```

**Why it’s broken:** Duplicate or out-of-order events cause double updates and wrong metrics. Common when event-driven is adopted without idempotency keys and clear ownership of “who handles duplicates”.

---

## 7. Decorator / Wrapper – Faults

### 7.1 Decorator that changes function contract

```javascript
// BAD: withRetry changes return type on failure
function withRetry(fn, max = 3) {
  return async function (...args) {
    for (let i = 0; i < max; i++) {
      try { return await fn(...args); }
      catch (e) { if (i === max - 1) return null; }  // now returns null instead of throwing
    }
  };
}
```

**Why it’s broken:** Callers expect either a result or an exception; swallowing and returning `null` hides failures and causes NPEs or wrong business behaviour. Often introduced to “avoid breaking the UI” without fixing error handling.

### 7.2 Wrong decorator order

```javascript
// BAD: Cache then retry = retry uses cached failure
const fetchUser = withRetry(withCache(api.getUser));
// First call fails 3 times → cache stores error → later calls get cached error
```

**Why it’s broken:** Caching failures or retrying cached responses leads to stale errors. Order should usually be “retry then cache” for external calls. Seen when layers are composed without thinking about order.

### 7.3 Decorator with hidden global state

```javascript
// BAD: Shared counter across all uses of withRetry
let totalRetries = 0;
function withRetry(fn, max = 3) {
  return async function (...args) {
    for (let i = 0; i < max; i++) {
      try { return await fn(...args); }
      catch (e) { totalRetries++; if (i === max - 1) throw e; }
    }
  };
}
```

**Why it’s broken:** Shared mutable state again; affects tests and multiple callers. Usually added for “metrics” without passing a metrics client or using a proper telemetry API.

---

## 8. Dependency Injection – Faults

### 8.1 Implicit dependencies (require inside function)

```javascript
// BAD: Hidden dependency, can't mock in tests
function createOrder(data) {
  const db = require('./db');  // or global
  const email = require('./emailService');
  return db.insert('orders', data).then(() => email.send(data));
}
```

**Why it’s broken:** Tests can’t inject DB or email; integration tests become the only option. Very common in legacy code or when “we’ll add tests later”.

### 8.2 Constructor does real I/O

```javascript
// BAD: DI container constructs and runs DB connect
class OrderService {
  constructor() {
    this.db = new Database();
    this.db.connect();  // real connection in ctor
  }
}
```

**Why it’s broken:** Hard to test (real DB); slow startup; failures in constructor are awkward to handle. Dependencies should be passed in or created by a composition root, not opened in the constructor.

### 8.3 Optional dependencies with silent fallback

```javascript
// BAD: “Optional” logger – failures hidden
function createService({ logger }) {
  return {
    log(msg) {
      if (logger) logger.info(msg);
      // else silent – no way to know logging was requested but missing
    },
  };
}
```

**Why it’s broken:** Misconfiguration (forgot to pass logger) is silent; debugging gets harder. Prefer required deps or an explicit no-op logger rather than “if (logger)”.

---

## 9. Circuit Breaker – Faults

### 9.1 No circuit breaker (direct external calls)

```javascript
// BAD: Every request hits failing service
async function getRecommendations(userId) {
  return await axios.get(`https://recommendation-service/users/${userId}/recommendations`);
}
// When recommendation-service is down, every request waits and threads pile up
```

**Why it’s broken:** Cascading failures: timeouts and connection exhaustion. Very common before the first major outage; then teams add a breaker after the incident.

### 9.2 Circuit that never closes

```javascript
// BAD: No half-open or reset
function circuitBreaker(fn, threshold = 3) {
  let failures = 0;
  let state = 'open';
  // ... on threshold state = 'open'
  // missing: timeout to try again (half-open) and reset failures
}
```

**Why it’s broken:** Once open, the circuit stays open forever; recovery requires restart. Often the first version of a homemade breaker without reading standard behaviour (closed → open → half-open → closed).

### 9.3 One circuit for all operations

```javascript
// BAD: Single circuit for entire downstream service
const breaker = circuitBreaker(httpClient.get);
// getUsers, getOrders, getRecommendations all share one breaker
// Recommendation endpoint is slow → opens circuit → users and orders also fail
```

**Why it’s broken:** One bad endpoint takes down all calls to that service. Better to have per-operation or per-critical-path circuits. Common when “we have one HTTP client” and one breaker is added without scoping.

---

## 10. CQRS – Faults

### 10.1 Reading from write model immediately after write

```javascript
// BAD: Expect read model updated synchronously
const id = await createOrderCommand(req.body);
const order = await getOrderQuery(id);  // read model not updated yet
res.json(order);  // 404 or stale
```

**Why it’s broken:** Read model is eventually consistent; immediate read can miss the update. Typical mistake when moving to CQRS without accepting async read-side updates and returning the command result or a poll/event for “when it’s ready”.

### 10.2 Command doing reads that affect the outcome

```javascript
// BAD: Command logic depends on query model
async function createOrderCommand(payload) {
  const existing = await readModel.getOrderByUser(payload.userId);  // read in command
  if (existing.length >= 10) throw new Error('Limit reached');
  return writeModel.createOrder(payload);
}
```

**Why it’s broken:** Read model can be stale; two concurrent commands can both pass the “limit” check. Commands should use the write model or transactional reads for consistency. Seen when “we already have this query” is reused in the command path.

### 10.3 No clear boundary between command and query

```javascript
// BAD: Same handler does read and write
app.get('/orders/:id', async (req, res) => {
  const order = await orderRepo.findById(req.params.id);
  order.viewCount = (order.viewCount || 0) + 1;
  await orderRepo.save(order);  // write in a “query” endpoint
  res.json(order);
});
```

**Why it’s broken:** GET is not idempotent; caching and scaling of reads get polluted by writes. Common when “we need to track views” is implemented in the read path instead of a separate command or async event.

---

## 11. Saga – Faults

### 11.1 Compensations that can’t be retried

```javascript
// BAD: Compensation has no idempotency
steps.push(() => paymentService.refund(payment.id));
// If refund fails and saga retries, refund might be called twice
```

**Why it’s broken:** Retries and partial failures can double-refund or double-compensate. Compensations need to be idempotent (e.g. by id or idempotency key). Often overlooked when first introducing sagas.

### 11.2 No timeout or long-held resources

```javascript
// BAD: Saga step can block forever
const inventory = await inventoryService.reserve(data.items);  // no timeout
steps.push(() => inventoryService.release(inventory.id));
// If reserve never returns, connection and resources are held
```

**Why it’s broken:** One stuck call can hold resources and block other sagas. Need timeouts and clear failure handling so compensations can run. Common when integrating with slow or unreliable services.

### 11.3 Synchronous saga across services

```javascript
// BAD: All steps in one request
async function placeOrderSaga(data) {
  await paymentService.charge(data.payment);
  await orderService.create(data.order);
  await inventoryService.reserve(data.items);
  await emailService.sendConfirmation(data.order);
  return order;
}
// One HTTP request holds connections to 4 services; one timeout fails the whole thing
```

**Why it’s broken:** Long request chains, no resilience to partial failure, and no clear ownership of the “transaction”. Prefer choreography or orchestration with async steps and compensations. Very common in “monolith first” designs before moving to events/sagas.

---

## 12. MVC (API) – Faults

### 12.1 Business logic in the controller

```javascript
// BAD: Controller contains domain rules
async function createOrderController(req, res) {
  const order = req.body;
  if (order.total > 10000) order.requiresApproval = true;
  if (req.user.tier === 'premium') order.discount = 0.1;
  const saved = await orderModel.insert(order);
  await notificationService.notify(saved);
  res.json(saved);
}
```

**Why it’s broken:** Controllers become huge and untestable; rules can’t be reused from jobs or other entry points. Typical when “we’ll refactor later” and logic keeps growing in the handler.

### 12.2 Model as pure data with no behaviour

```javascript
// BAD: Anemic model – logic scattered in controllers/services
const userModel = {
  findById: (id) => db.query('SELECT * FROM users WHERE id = ?', [id]),
};
// Elsewhere: if (user.balance < amount) ...  // validation duplicated everywhere
```

**Why it’s broken:** Invariants and rules are duplicated or forgotten. Richer domain models (or at least a clear service layer) keep rules in one place. Common in CRUD-heavy codebases.

### 12.3 No separation (everything in one file)

```javascript
// BAD: Route handler does DB, validation, email
app.post('/orders', async (req, res) => {
  const conn = await pool.getConnection();
  const [r] = await conn.query('INSERT INTO orders SET ?', [req.body]);
  await conn.query('INSERT INTO order_events SET ?', [{ order_id: r.insertId, type: 'created' }]);
  await sendEmail(req.body.email, 'Order confirmed');
  res.json({ id: r.insertId });
});
```

**Why it’s broken:** No testability, no reuse, no clear place to fix bugs or add features. Often the result of “get it working first” without a minimal structure (e.g. controller → service → repo).

---

## Cross-cutting faults (org and team level)

### Shared mutable state

- **Example:** Global config object updated at runtime; module-level cache that never invalidates.
- **Why:** Race conditions, non-deterministic tests, “it worked in dev” (single worker) vs production (many workers).
- **Common in:** Legacy apps, feature flags or config “for convenience”, and when state is not passed explicitly.

### No error handling / generic catch

- **Example:** `try { await call(); } catch (e) { console.log(e); }` or returning `null` on any error.
- **Why:** Failures are hidden; retries and monitoring don’t see real errors; debugging is guesswork.
- **Common in:** Tight deadlines, “we’ll add proper handling later”, and copy-pasted blocks.

### Magic strings and numbers

- **Example:** `if (status === 'ACT')`, `sleep(5000)`, `limit 100` with no named constants or config.
- **Why:** Typos, inconsistent values across services, and unclear meaning. Changing behaviour requires risky search-replace.
- **Common in:** Quick fixes, lack of shared constants or config, and cross-team duplication.

### Copy-paste and “temporary” code

- **Example:** Same validation or DB call duplicated in 10 controllers; “TODO: refactor” that never happens.
- **Why:** Bug fixes and behaviour changes must be applied in many places; high risk of missing one.
- **Common in:** Pressure to ship, no time for refactor, and “it’s only used in two places” that later become many.

### Tight coupling to one vendor or library

- **Example:** Direct AWS SDK or ORM calls throughout business logic; no abstraction layer.
- **Why:** Migrating or upgrading becomes a big-bang change; tests need real or heavy mocks.
- **Common in:** “We’ll never switch” and “we don’t have time for an abstraction”.

### No tests around critical paths

- **Example:** Payment or order flow has no unit or integration tests; “we test in staging”.
- **Why:** Regressions and refactors are risky; deployments are stressful; root cause of bugs is hard to find.
- **Common in:** Legacy code, “no time for tests”, and unclear ownership of flows.

### Inconsistent patterns across the codebase

- **Example:** Some services use repositories, others hit DB directly; some use events, others sync HTTP.
- **Why:** New joiners and reviewers can’t rely on one mental model; refactors are inconsistent.
- **Common in:** Multiple teams, acquired codebases, and “every team chooses their own approach”.

### Leaky abstractions and “just one query”

- **Example:** Repository exposes `rawQuery(sql)`; service receives DB rows and uses column names.
- **Why:** DB schema changes break callers; abstraction doesn’t protect the domain.
- **Common in:** Shortcuts for reporting or “complex query”, and no agreed API for data access.

---

## Quick reference: fault → pattern to apply

| Fault | Pattern / fix |
|-------|----------------|
| Global mutable singleton | DI + pass state or use request-scoped deps |
| Factory with wrong/default type | Validate type; fail fast or explicit default |
| Repo exposes SQL / does business logic | Domain-focused repo API; move rules to service/domain |
| Strategy via giant switch | Strategy map; open/closed |
| Middleware order / missing next() | Document order; ensure every path calls next() |
| Sync assumption on events | Design for async; return command result or poll |
| Listener errors break others | Per-listener try/catch; dead-letter; retries |
| Decorator changes contract | Preserve throw vs return; document contract |
| Hidden deps, no DI | Inject all deps; composition root |
| No circuit breaker | Wrap external calls with breaker + timeout |
| Read right after write in CQRS | Eventually consistent read; return write result or event |
| Saga compensations not idempotent | Idempotency keys; idempotent compensations |
| Logic in controller / anemic model | Controller thin; service/domain holds rules |
| God object / fat service | Split by responsibility; Repository + DI |

Use this with `concepts.md` to discuss both correct patterns and typical failures in interviews and design reviews.
