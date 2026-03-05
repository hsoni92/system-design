# 4. Project Execution – Interview Prep

Covers running the project: tracking, ROAM, escalation, change communication, quality (PDCA, UAT), data-informed decisions, team dynamics (Tuckman), leadership and influence, and effective communication (meetings, email). Common interview focus: “How do you run execution?” and “How do you handle conflict or escalation?”

**Reference:** [CURRICULUM.md](CURRICULUM.md) – Course 4, Modules 1–5.

---

## Key terms

| Term | Definition |
|------|------------|
| **Project execution** | Doing the work: coordinating people, tracking progress, managing quality and changes, and communicating. |
| **ROAM (in execution)** | In status/reviews: Resolved, Owned, Accepted, Mitigated—so every risk or issue has a clear status and owner. |
| **Escalation** | Raising a blocker or decision to someone with authority when the team can’t resolve it; should be timely and include context and options. |
| **Change control** | Process to evaluate, approve, and communicate scope/schedule/cost changes so they’re deliberate, not ad hoc. |
| **PDCA** | Plan–Do–Check–Act: cycle for quality and process improvement (plan change, do it, check results, act on learning). |
| **Quality assurance (QA)** | Processes to ensure work meets standards; preventive. |
| **Quality control (QC)** | Checking deliverables against requirements; finding defects. |
| **UAT (User Acceptance Testing)** | End users validate that the solution meets their needs before go-live. |
| **Retrospective** | Session to reflect on what went well, what didn’t, and what to improve next iteration. |
| **Tuckman stages** | Forming (orientation), Storming (conflict), Norming (norms), Performing (productivity), Adjourning (wrap-up). |
| **Status report** | Regular update on progress, milestones, risks, issues, and next steps; audience and cadence from communication plan. |
| **Inclusive meeting** | Agenda, right attendees, clear outcomes, and practices so everyone can contribute (e.g. async input, time limits). |

---

## Worked examples

### ROAM in execution (status meeting)

| Item | ROAM | Owner | Next step |
|------|------|--------|-----------|
| Vendor delay on API keys | **M**itigated | PM | Contingency: use sandbox until keys arrive; ETA Friday. |
| Scope question from Legal | **O**wned | PM | Clarify with Legal by Wed; update scope doc. |
| Minor UX tweak request | **A**ccepted | Product | Logged for next release; no change to this sprint. |
| Dependency on Team B | **R**esolved | — | Delivered yesterday; we’re unblocked. |

### PDCA (quality improvement example)

- **Plan:** Reduce production defects by improving code review checklist and adding a pre-merge test gate.
- **Do:** Roll out checklist and gate for 2 sprints.
- **Check:** Compare defect rate and escape rate before/after.
- **Act:** If improved, standardize; if not, adjust checklist or gate and repeat.

### Tuckman – what to do as PM

| Stage | PM focus |
|-------|----------|
| **Forming** | Clear goals, roles, and norms; psychological safety. |
| **Storming** | Facilitate conflict; align on priorities and decision rights; don’t avoid disagreement. |
| **Norming** | Lock in working agreements; reinforce collaboration. |
| **Performing** | Remove blockers; keep focus on outcomes; avoid unnecessary process. |
| **Adjourning** | Closure, recognition, lessons learned, handoffs. |

### Status report (snippet)

**Project:** Partner API launch | **Week of:** [date]  
**Summary:** On track. Design complete; build 70% done. One risk on vendor keys—mitigation in place.

| Area | Status | Notes |
|------|--------|--------|
| Scope | Green | No change. |
| Schedule | Green | Milestone: pilot start [date]. |
| Budget | Green | Within plan. |
| Risks | 1 mitigated | Vendor keys—using sandbox until Fri. |
| Blockers | None | — |
| Next | Pilot prep, docs review | — |

### Escalation (email example)

**Subject:** [Project name] – Escalation: [one-line issue]

- **Issue:** [What’s wrong and impact, e.g. “Vendor delay of 2 weeks blocks pilot start.”]
- **Options:** (1) Start pilot with sandbox; (2) Slip pilot 2 weeks; (3) [Other.]
- **Recommendation:** Option 1; reason: [e.g. “Keeps date; sandbox is sufficient for pilot.”]
- **Decision needed by:** [Date.]

---

## Interview Q&A

**How do you run project execution?**  
“I track progress against the plan—schedule, scope, quality—and run regular status with the team and stakeholders. I use ROAM so risks and issues have a clear status and owner. I manage changes through a change process and escalate when we need a decision or resource we don’t have. I focus on removing blockers and keeping communication aligned with the communication plan.”

**How do you handle escalation?**  
“I escalate when the team or I can’t resolve something that affects scope, schedule, or quality. I make it easy for the decision-maker: brief context, impact, 2–3 options with pros/cons, and a clear recommendation and deadline. I document the decision and follow up.”

**What’s the difference between quality assurance and quality control?**  
“QA is preventive—processes and standards so we build quality in (e.g. reviews, checklists). QC is checking outputs—testing, UAT, inspections—to find and fix issues. I use both: QA to reduce defects, QC to catch what remains before release.”

**How do you deal with team conflict or storming?**  
“I treat it as normal (Tuckman’s Storming). I facilitate: clarify goals and priorities, make decision rights explicit, and give space to disagree on ideas while keeping respect. I align on how we’ll work together and escalate only if it becomes blocking or behavioral.”

**How do you make sure meetings are effective?**  
“I send an agenda and goal in advance, invite only who’s needed, and time-box. I use inclusive practices—e.g. async input, round-robins—so quieter people contribute. I end with clear next steps and owners and publish notes.”

---

## “How would you…” / Behavioral prompts

1. **How would you deliver bad news to a sponsor (e.g. we’re going to miss the date)?**  
   Focus on: early warning, clear cause and impact, options (slip, scope reduce, add resource), recommendation, and what you need from them (decision, support).

2. **Tell me about a time you had to escalate. What happened?**  
   Use STAR: situation (blocker or decision beyond your authority), task (unblock or get decision), action (whom you escalated to, how you framed it, options given), result (decision, outcome, what you’d do the same or differently).

3. **How would you improve quality on a project that’s had a lot of defects?**  
   Focus on: PDCA—identify causes (e.g. requirements, testing, handoffs), plan a change (e.g. checklist, UAT, gate), run it, measure, then act on the results and iterate.
