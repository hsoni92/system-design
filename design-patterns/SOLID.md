# SOLID Principles – Simple Node.js Examples

Five principles for maintainable, testable object-oriented design. Examples use plain Node.js (no framework).

---

## 1. Single Responsibility Principle (SRP)

**When:** A class/module does more than one thing.  
**Why:** One reason to change; easier testing and reuse.

**Bad:** One module handles validation, persistence, and email.

```javascript
// ❌ Too many responsibilities
class UserService {
  validate(user) { /* ... */ }
  save(user) { /* db write */ }
  sendWelcomeEmail(user) { /* email */ }
}
```

**Good:** Split by responsibility.

```javascript
// ✅ One job each
class UserValidator {
  validate(user) {
    if (!user.email) throw new Error('Email required');
    return true;
  }
}

class UserRepository {
  constructor(db) { this.db = db; }
  save(user) { return this.db.insert('users', user); }
}

class EmailService {
  sendWelcome(user) { /* send email */ }
}

// Orchestrator only coordinates
class UserService {
  constructor(validator, repo, emailService) {
    this.validator = validator;
    this.repo = repo;
    this.emailService = emailService;
  }
  async register(user) {
    this.validator.validate(user);
    await this.repo.save(user);
    await this.emailService.sendWelcome(user);
  }
}
```

---

## 2. Open/Closed Principle (OCP)

**When:** Adding new behaviour forces editing existing code.  
**Why:** Extend via new code, not by modifying old code; fewer regressions.

**Bad:** Changing a central function for every new type.

```javascript
// ❌ Closed for extension – must edit for each type
function area(shape) {
  if (shape.type === 'circle') return Math.PI * shape.radius ** 2;
  if (shape.type === 'rectangle') return shape.width * shape.height;
  throw new Error('Unknown shape');
}
```

**Good:** Open for extension via new implementations; closed for modification.

```javascript
// ✅ New shapes = new classes, no change to existing code
class Shape {
  area() { throw new Error('Implement area()'); }
}

class Circle extends Shape {
  constructor(radius) { super(); this.radius = radius; }
  area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
  constructor(width, height) { super(); this.width = width; this.height = height; }
  area() { return this.width * this.height; }
}

function totalArea(shapes) {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}
```

---

## 3. Liskov Substitution Principle (LSP)

**When:** Subtypes break expectations of the base type.  
**Why:** Subtypes must be usable wherever the base type is used, without surprises.

**Bad:** Subtype changes contract (e.g. throws or returns different shape).

```javascript
// ❌ Rectangle subtype breaks substitution
class Rectangle {
  setDimensions(w, h) { this.width = w; this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setDimensions(side) { this.width = this.height = side; } // Different signature/behavior
}
// Code that expects Rectangle.setDimensions(w, h) breaks with Square
```

**Good:** Subtypes honour the same contract.

```javascript
// ✅ Subtypes substitutable for base type
class Shape {
  area() { throw new Error('Implement area()'); }
}

class Rectangle extends Shape {
  constructor(width, height) { super(); this.width = width; this.height = height; }
  area() { return this.width * this.height; }
}

class Square extends Shape {
  constructor(side) { super(); this.side = side; }
  area() { return this.side ** 2; }
}

// Any Shape can be used the same way
function printArea(shape) {
  console.log(shape.area());
}
```

---

## 4. Interface Segregation Principle (ISP)

**When:** Clients depend on a fat interface with methods they don’t use.  
**Why:** Small, focused interfaces; no forced dependencies on unused methods.

**Bad:** One big interface; callers must depend on everything.

```javascript
// ❌ One fat interface
class Worker {
  work() {}
  eat() {}
  sleep() {}
}
// Robot only needs work(), but is forced to implement eat/sleep
class Robot extends Worker {
  work() { console.log('Assembling'); }
  eat() { throw new Error('Robots do not eat'); }
  sleep() { throw new Error('Robots do not sleep'); }
}
```

**Good:** Segregate into small interfaces; implement only what you need.

```javascript
// ✅ Small interfaces
const Workable = { work() {} };
const Eatable = { eat() {} };

class Human {
  work() { console.log('Coding'); }
  eat() { console.log('Lunch'); }
}

class Robot {
  work() { console.log('Assembling'); }
}

// Client depends only on what it uses
function doWork(worker) {
  if (typeof worker.work === 'function') worker.work();
}
```

---

## 5. Dependency Inversion Principle (DIP)

**When:** High-level code imports and uses low-level modules directly.  
**Why:** Both should depend on abstractions; easier testing and swapping implementations.

**Bad:** High-level service depends on concrete DB.

```javascript
// ❌ Direct dependency on concrete implementation
const mysql = require('mysql');
class OrderService {
  constructor() {
    this.db = mysql.createConnection({ /* ... */ });
  }
  async getOrder(id) {
    return this.db.query('SELECT * FROM orders WHERE id = ?', [id]);
  }
}
```

**Good:** Depend on an abstraction (interface); inject implementation.

```javascript
// ✅ Depend on abstraction; inject implementation
class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }
  async getOrder(id) {
    return this.orderRepository.findById(id);
  }
}

// Abstractions (contracts)
class OrderRepository {
  findById(id) { throw new Error('Implement findById'); }
}

// Concrete implementations
class MySqlOrderRepository extends OrderRepository {
  constructor(db) { super(); this.db = db; }
  async findById(id) {
    return this.db.query('SELECT * FROM orders WHERE id = ?', [id]);
  }
}

class InMemoryOrderRepository extends OrderRepository {
  constructor(orders = new Map()) { super(); this.orders = orders; }
  async findById(id) { return this.orders.get(id); }
}

// Wiring
const repo = new InMemoryOrderRepository(new Map([['1', { id: '1', total: 99 }]]));
const service = new OrderService(repo);
```

---

## Quick reference

| Principle | In one line |
|-----------|-------------|
| **S**RP | One class, one reason to change |
| **O**CP | Extend with new code, don’t edit old code |
| **L**SP | Subtypes must be substitutable for base type |
| **I**SP | Many small interfaces, not one big one |
| **D**IP | Depend on abstractions, not concretions |
