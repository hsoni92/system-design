# 6. Capstone – Real-World Application – Interview Prep

Covers applying the full PM cycle in one flow: initiating (charter, stakeholders), planning (WBS, schedule, quality), execution (quality, retro), and closing (reports, handoff). Use this for “Walk me through a project” and end-to-end behavioral questions.

**Reference:** [CURRICULUM.md](CURRICULUM.md) – Course 6, Modules 1–4.

---

## Key terms

| Term | Definition |
|------|------------|
| **Capstone** | Culminating project that applies the full life cycle; in the certificate, the *Project Plant Pals* scenario from charter through closeout. |
| **Project charter** | Authorizing document: goals, scope, stakeholders, high-level risks; sponsor sign-off. |
| **Closeout report** | Summary of what was delivered, what met/didn’t meet goals, lessons learned, and recommendations. |
| **Executive summary** | Short (e.g. 1 page) overview for leadership: purpose, key results, status, and next steps or recommendations. |
| **Lessons learned** | Documented takeaways (what went well, what didn’t, what to do differently); input for future projects and retros. |

---

## End-to-end flow: one “walk me through” structure

Use this when they say **“Walk me through a project you led”** or **“Describe a project from start to finish.”**

### 1. Initiating

- **What:** Defined the project with the sponsor: business case, goals (SMART or OKR-style), high-level scope (in/out).
- **Artifacts:** Project charter with goals, scope, key stakeholders, high-level risks; stakeholder analysis (e.g. power/interest); sponsor sign-off.
- **One line:** “We got alignment on why we were doing it, what success looked like, and who had a stake in it.”

### 2. Planning

- **What:** Broke scope into deliverables and work (WBS), sequenced tasks, estimated and built a schedule (e.g. Gantt), identified critical path, defined budget and risks, and decided how we’d communicate.
- **Artifacts:** WBS, schedule/milestones, risk register and mitigation, communication plan.
- **One line:** “We had a clear plan: what to build, when, who needed to know what, and how we’d handle risks.”

### 3. Executing

- **What:** Ran the work: tracked progress, ran ROAM on risks/issues, managed quality (e.g. UAT, checklists), ran retros, and kept stakeholders updated per the communication plan.
- **One line:** “We executed against the plan, dealt with issues as they came up, and kept quality and communication on track.”

### 4. Closing

- **What:** Handed off deliverables, captured lessons learned, wrote closeout and executive summary, released resources, and celebrated.
- **Artifacts:** Closeout report, executive summary, lessons learned, handoff to support or next phase.
- **One line:** “We closed it formally: handoff, lessons learned, and a clear summary for leadership.”

---

## Mini case: Partner API launch (tech example)

**Initiating:** Sponsor wanted a partner API to grow ecosystem. Charter had: goal (launch API with 99.9% uptime, &lt;200 ms p95), scope (auth, core endpoints, docs, pilot), key stakeholders (Eng, Product, Partners, Support), and top risks (vendor dependency, scope creep). Stakeholder grid and RACI aligned who did what. Charter approved.

**Planning:** WBS: design/spec, build/test, security, docs, pilot, GA. Schedule and critical path identified; risk register with mitigation (e.g. vendor delay → sandbox fallback). Communication plan: weekly sponsor update, biweekly stakeholders, daily team sync.

**Executing:** Built and tested; ran ROAM in status; UAT with two pilot partners; one vendor delay—used sandbox per plan. Retro: better dependency tracking next time.

**Closing:** Handoff to support with runbooks; closeout report (delivered on time, 2 pilots live); executive summary for leadership; lessons learned doc.

---

## Interview Q&A

**Walk me through a project you led from start to finish.**  
Use the four-phase structure above. Keep each phase to 2–3 sentences; add one concrete detail (e.g. “We had a risk the vendor would slip, so we had a sandbox fallback and used it when they did”). End with outcome and one lesson.

**What do you include in a closeout report?**  
“Summary of what was delivered vs goals, what went well and what didn’t, lessons learned, and recommendations for future projects. I keep it factual and useful for the next team or sponsor.”

**How do you run a project retrospective?**  
“We look at what went well, what didn’t, and what we’ll do differently. I keep it safe and focused on process and collaboration, not blame. We pick 1–2 concrete improvements for the next iteration and assign owners.”

**How do you escalate and still connect to goals?**  
“When I escalate, I tie the issue to impact on goals—e.g. ‘This delay pushes pilot by 2 weeks, which affects our Q2 commitment.’ I give options and a recommendation so the sponsor can decide in context of the same goals we set in the charter.”

---

## “How would you…” / Behavioral prompts

1. **Tell me about a project that didn’t go as planned. What did you do?**  
   Use STAR: situation (what went wrong—scope, timeline, dependency), task (protect outcome or re-baseline), action (communication, change control, escalation, replan), result (what shipped, what you learned, what you’d do differently). Show ownership and learning, not blame.

2. **How do you balance stakeholder expectations when you have to deliver bad news?**  
   Focus on: early and clear communication, linking to shared goals from initiation, offering options (scope, date, resource), and recommending one so they can decide. Emphasize transparency and partnership, not surprise.

3. **Describe how you’ve used lessons learned from one project on another.**  
   Give a short example: what you captured (e.g. “dependency tracking”), how you stored it (retro notes, closeout), and how you applied it next time (e.g. “we added a dependency checklist in planning”). Shows closure and continuous improvement.
