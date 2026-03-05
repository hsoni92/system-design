# 3. Project Planning – Interview Prep

Covers breaking down work (WBS), scheduling (Gantt, critical path), budgeting, procurement (SoW), risk management (identification, mitigation, ROAM), and communication plans. Core for “How do you plan a project?” and “How do you handle risk?”

**Reference:** [CURRICULUM.md](CURRICULUM.md) – Course 3, Modules 1–5.

---

## Key terms

| Term | Definition |
|------|------------|
| **Work Breakdown Structure (WBS)** | Hierarchical decomposition of project scope into deliverables and work packages; no overlap; 100% of scope. |
| **Milestone** | A point in time marking a major deliverable or decision; no duration. |
| **Task** | Work with duration, assignable to someone. |
| **Gantt chart** | Bar chart showing tasks, start/end, duration, and dependencies over time. |
| **Critical path** | Longest sequence of dependent tasks; determines minimum project duration; delays here delay the project. |
| **Critical Path Method (CPM)** | Identify critical path; focus schedule and risk management on those activities. |
| **Kanban board** | Visual board (e.g. To Do, In Progress, Done) to limit WIP and show flow. |
| **Statement of Work (SoW)** | Document describing work to be done, deliverables, acceptance criteria, and terms; used for procurement or internal agreements. |
| **Risk** | Uncertain event that could positively or negatively affect project objectives. |
| **Risk mitigation** | **Avoid** (eliminate cause), **Mitigate** (reduce impact/probability), **Transfer** (e.g. insurance, contract), **Accept** (acknowledge; monitor or contingency). |
| **ROAM** | Risks: **R**esolved, **O**wned (someone owns mitigation), **A**ccepted, **M**itigated. Used in reviews to track risk status. |
| **Risk management plan** | How you identify, analyze, respond to, and monitor risks; roles; frequency of reviews. |
| **Communication plan** | Who gets what information, when, how, and why; keeps stakeholders aligned. |
| **Planning fallacy** | Tendency to underestimate time and cost; countered by historical data, three-point estimates, and buffer. |

---

## Worked examples

### WBS (3 levels) – Partner API launch

| Level 0 | Level 1 | Level 2 |
|---------|---------|---------|
| **1.0 Partner API launch** | 1.1 Design & spec | 1.1.1 API design review<br>1.1.2 Security requirements<br>1.1.3 Documentation outline |
| | 1.2 Build & test | 1.2.1 Implementation<br>1.2.2 Unit/integration tests<br>1.2.3 Security review |
| | 1.3 Rollout | 1.3.1 Pilot partners<br>1.3.2 GA release<br>1.3.3 Handoff to support |

Rule: each child covers 100% of the parent; no overlap between siblings.

### Risk matrix and mitigation (4 strategies)

| Risk | Probability | Impact | Mitigation strategy | Action |
|------|-------------|--------|----------------------|--------|
| Key developer leaves | Low | High | **Mitigate** | Cross-train; document; retention check-ins. |
| Third-party API downtime | Medium | Medium | **Transfer** | SLA in contract; fallback or credits. |
| Scope expansion from stakeholder | High | High | **Avoid** | Lock scope in charter; change control. |
| Minor delay in docs | High | Low | **Accept** | Monitor; small buffer in schedule. |

### ROAM in a planning/review context

- **Resolved** – Risk no longer applies (e.g. dependency delivered).
- **Owned** – Named owner is responsible for mitigation and updates.
- **Accepted** – We accept the risk; may have contingency or just monitor.
- **Mitigated** – We have a plan to reduce probability or impact; we track it.

In status meetings: “All items are ROAM’d: two owned by Eng, one accepted with contingency budget.”

### Communication plan (template)

| Audience | What | When | How | Owner |
|----------|------|------|-----|--------|
| Sponsor | Status, risks, decisions needed | Weekly | Email summary + call if needed | PM |
| Dev team | Tasks, blockers, priorities | Daily | Standup / async update | PM / Tech lead |
| Stakeholders | Milestones, go-live | Per milestone | Email + deck | PM |
| Support | Handoff, runbooks | Pre-launch | Doc + session | PM |

---

## Interview Q&A

**How do you build a project plan?**  
“I start with the charter and scope, then create a WBS so all deliverables are broken into work packages. I sequence tasks and dependencies, estimate duration and effort, and build a schedule—often a Gantt. I identify the critical path and focus on those activities for timing and risk. I add a risk and communication plan so we know how we’ll handle uncertainty and keep people informed.”

**What is the critical path and why does it matter?**  
“The critical path is the longest chain of dependent tasks—it sets the minimum project duration. Any delay on the critical path delays the project. I use it to prioritize monitoring and buffer, and to explain to stakeholders where schedule risk really is.”

**How do you handle project risks?**  
“I identify risks (brainstorming, past projects, stakeholders), then assess probability and impact. For each significant risk I choose a strategy: avoid, mitigate, transfer, or accept, and assign an owner. I track them in a risk register and review regularly—often using ROAM so we know what’s resolved, owned, accepted, or mitigated.”

**What’s in a communication plan?**  
“It defines who needs what information, how often, and through which channel—e.g. sponsor gets a weekly status, team gets daily standups, stakeholders get milestone updates. It prevents overload and ensures the right people get the right information to make decisions.”

**How do you avoid the planning fallacy?**  
“I use historical data and three-point estimates (optimistic, likely, pessimistic) instead of single-point guesses. I add buffer for known risks and unknowns, and I re-estimate as we learn. I also separate estimation from commitment so we don’t anchor on wishful dates.”

**What is a SoW used for?**  
“A Statement of Work describes the work to be done, deliverables, acceptance criteria, and terms. It’s used for procurement or internal agreements so both sides are aligned on scope and expectations.”

---

## “How would you…” / Behavioral prompts

1. **How would you respond when a key risk materializes mid-project?**  
   Focus on: assessing impact on scope/schedule/cost, updating the plan and stakeholders, activating mitigation or contingency, and documenting for lessons learned.

2. **A stakeholder wants status updates every day. How do you handle it?**  
   Focus on: aligning on a communication plan (what they need and why), offering a cadence that fits (e.g. weekly summary + ad hoc for issues), and documenting it so expectations are clear.

3. **Tell me about a time the critical path slipped. What did you do?**  
   Use STAR: situation (which task, why it slipped), task (protect delivery or re-baseline), action (reprioritize, add resource, reduce scope, escalate), result (outcome and what you’d do differently).
