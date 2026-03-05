# 5. Agile Project Management – Interview Prep

Covers Agile mindset, Scrum (roles, events, artifacts), user stories, estimation (T-shirt, story points), velocity and burndown, value roadmaps, and scaling. Frequently tested in PM and technical interviews.

**Reference:** [CURRICULUM.md](CURRICULUM.md) – Course 5, Modules 1–4.

---

## Key terms

| Term | Definition |
|------|------------|
| **Agile** | Iterative, incremental delivery; emphasis on collaboration, feedback, and adapting to change. |
| **Agile Manifesto** | Four values: individuals and interactions, working software, customer collaboration, responding to change—over the opposites. Twelve principles support this. |
| **Scrum** | A lightweight Agile framework: 3 roles, 5 events, 3 artifacts; time-boxed iterations (sprints). |
| **Sprint** | Fixed-length iteration (often 2 weeks); plan → build → review → retro; produce a potentially shippable increment. |
| **Product Owner (PO)** | Owns the product backlog; maximizes value; orders and clarifies items; accepts work. |
| **Scrum Master (SM)** | Facilitates Scrum; removes impediments; protects the team from disruption; coach, not project manager. |
| **Development Team** | Cross-functional group that does the work; self-organizing; collectively accountable for the increment. |
| **Product Backlog** | Ordered list of all work (features, fixes, etc.); refined and reprioritized by PO. |
| **Sprint Backlog** | Items selected for the current sprint plus the plan to deliver them. |
| **Increment** | Sum of completed backlog items plus all previous increments; must be “done” (meets definition of done). |
| **User story** | Short format: “As a [role], I want [action] so that [value]”; placeholder for conversation and acceptance criteria. |
| **Acceptance criteria** | Conditions that must be met for the story to be “done”; testable. |
| **Story points** | Relative measure of effort/complexity/uncertainty; used for capacity and velocity, not hours. |
| **Velocity** | Amount of work (e.g. story points) a team completes per sprint; used for forecasting. |
| **Burndown chart** | Shows remaining work (e.g. points or tasks) over time in a sprint; ideal line vs actual. |
| **Definition of Done** | Shared checklist that defines when a story or increment is complete (e.g. coded, tested, documented). |
| **VUCA** | Volatility, Uncertainty, Complexity, Ambiguity—context where Agile helps. |

---

## Worked examples

### Scrum at a glance

| | What |
|---|------|
| **3 pillars** | Transparency (visible work and progress), Inspection (frequent checks), Adaptation (adjust based on learning). |
| **5 values** | Courage, Focus, Commitment, Respect, Openness. |
| **3 roles** | Product Owner, Scrum Master, Development Team. |
| **5 events** | Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective. |
| **3 artifacts** | Product Backlog, Sprint Backlog, Increment. |

### User story + acceptance criteria + story points

**Story:**  
“As a **partner developer**, I want **to authenticate with API keys via a dedicated endpoint** so that **I can integrate securely without storing user passwords**.”

**Acceptance criteria:**
- API accepts key + secret in header or body; returns short-lived token.
- Invalid key returns 401 with clear error message.
- Rate limit applies per key; documented in API docs.
- Keys can be rotated without breaking existing flows (grace period).

**Story points:** 5 (relative to team’s scale)—integration with auth system, docs, and edge cases; more than a “3” but not a spike or epic.

### Velocity and burndown (one-liner for interviews)

- **Velocity:** Average story points completed per sprint; use for “how much can we do next sprint?” and rough release forecasting. Don’t use it as a target; it’s a result.
- **Burndown:** Chart of remaining work (vertical) vs time (horizontal) in a sprint. Ideal line slopes from total work to zero; actual line shows if the team is on track to finish.

### T-shirt sizing (when not using points)

- XS / S / M / L / XL for relative size.
- Quick for early backlog; often mapped to story points later (e.g. S=1, M=2, L=5) for velocity.

---

## Interview Q&A

**What is Agile and when do you use it?**  
“Agile is iterative, incremental delivery with frequent feedback and adaptation. I use it when requirements are uncertain or changing, when we need to learn fast, or when the customer wants to see working output often. I use Waterfall or hybrid when scope and compliance are fixed up front.”

**Explain Scrum roles.**  
“The Product Owner owns the backlog and prioritizes for value. The Scrum Master helps the team follow Scrum and removes impediments; they’re a facilitator, not the team’s manager. The Development Team is cross-functional and self-organizing and delivers the increment. There’s no ‘project manager’ in pure Scrum—the team shares delivery accountability.”

**What are the main Scrum events?**  
“Sprint is the container—a time-boxed iteration. Sprint Planning sets the sprint goal and what’s in the sprint backlog. Daily Scrum is a short sync on progress and blockers. Sprint Review shows the increment to stakeholders and gets feedback. Sprint Retrospective is for the team to improve process and collaboration.”

**How do you write a good user story?**  
“I use ‘As a [role], I want [action] so that [value].’ I keep one outcome per story and add acceptance criteria that are testable. I treat the story as a placeholder for conversation with the PO and the team, not a full spec.”

**What are story points and why use them instead of hours?**  
“Story points are a relative measure of effort, complexity, and uncertainty. They’re faster to estimate and don’t tie to hours, which avoids false precision and focuses on relative size. Velocity (points per sprint) helps with capacity and forecasting without committing to hours per point.”

**What’s the difference between Product Backlog and Sprint Backlog?**  
“The Product Backlog is the full ordered list of work for the product; the PO owns and refines it. The Sprint Backlog is the subset the team committed to for the current sprint plus the plan to deliver it. Only the team changes the sprint backlog during the sprint.”

**How do you handle a team that consistently misses its sprint commitment?**  
“I’d look at why: too much pulled in, unclear scope, blockers, or estimation. I’d use retro to discuss and adjust—e.g. pull less next sprint, refine better, or improve definition of done. I’d avoid using velocity as a stick; it’s for the team to plan, not for external pressure.”

---

## “How would you…” / Behavioral prompts

1. **How would you introduce Agile to a team that’s only done Waterfall?**  
   Focus on: starting with one pilot (e.g. one sprint), explaining the “why” (feedback, change), clarifying roles (PO vs SM vs team), and running a retro so they see the benefit of inspect-and-adapt.

2. **Tell me about a time a sprint went off the rails. What did you do?**  
   Use STAR: situation (scope creep, key person out, dependency), task (still deliver or reset expectations), action (re-scope with PO, communicate to stakeholders, retro), result (what shipped, what you changed for next sprint).

3. **How would you explain velocity to a stakeholder who wants a fixed release date?**  
   Focus on: velocity as a range based on past sprints, using it to forecast “likely by X, confident by Y,” and tying scope to date (fixed date → variable scope) so we can adjust scope to hit the date.
