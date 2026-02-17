# Security, Compliance & Zero Trust – Study Plan

A 2–3 week study plan aligned to the **Security, Compliance & Zero Trust** section of the Microsoft Senior Consultant (Apps) role. Aim: speak confidently in interviews; hands-on depth can follow after selection.

---

## 1. How to Use This Plan

| Aspect | Detail |
|--------|--------|
| **Who it’s for** | Experienced developer preparing for Senior Consultant interviews |
| **Time** | 2–3 weeks at ~1–1.5 hours per day (or equivalent blocks) |
| **Goal** | Explain concepts, trade-offs, and tooling clearly; not deep implementation yet |
| **Outcome** | Confident discussion of security-by-design, Zero Trust, IAM, threat modeling, compliance, DevSecOps, and key Microsoft security tools |

---

## 2. Topic Map: JD Bullets to Study Areas

| JD bullet | Study areas |
|-----------|-------------|
| Security-by-design, encryption, AuthN/AuthZ | Security-by-design principles; encryption at rest and in transit; OAuth 2.0, OIDC, RBAC/ABAC; Azure AD/Entra ID basics |
| Zero Trust, IAM, secure-by-default, threat modeling, compliance, DevSecOps | Zero Trust pillars and principles; IAM (identity, access, PIM); secure defaults; STRIDE and threat modeling; compliance (SOC 2, ISO 27001, GDPR); DevSecOps culture and pipeline |
| Least-privilege, assume-breach, micro-segmentation, monitoring, SAST/DAST, secure CI/CD | Least-privilege and JIT access; assume-breach mindset; network and identity micro-segmentation; continuous monitoring; SAST vs DAST; securing pipelines (secrets, signing, gates) |
| Defender for Cloud, Threat Modeling Tool, Sentinel, Splunk | What each does, when to mention them, main capabilities (CSPM, threat detection, SIEM, logging) |

---

## 3. Weekly Breakdown

### Week 1 – Foundations and Zero Trust

**Security-by-design**

- Build security in from design and requirements, not as an afterthought.
- Know: defense in depth, least privilege, fail secure, and keeping the attack surface small.

**Encryption**

- **At rest:** AES; key management (e.g. Azure Key Vault, HSM); what “encryption at rest” means for storage and DBs.
- **In transit:** TLS 1.2+; certificate validation; why both matter for compliance and Zero Trust.

**Authentication (AuthN) and Authorization (AuthZ)**

- **AuthN:** “Who are you?” – identity verification (passwords, MFA, FIDO2, certificates).
- **AuthZ:** “What can you do?” – access decisions (roles, permissions, policies).
- **OAuth 2.0:** Authorization framework (authorization code, client credentials, PKCE for SPAs).
- **OpenID Connect (OIDC):** Identity layer on top of OAuth (ID tokens, user info).
- **RBAC vs ABAC:** Role-Based (who you are) vs Attribute-Based (attributes + conditions); Azure RBAC and ABAC conditions.
- **Azure AD / Microsoft Entra ID:** Identity provider for Azure/M365; app registration, scopes, consent.

**Zero Trust**

- Core idea: “Never trust, always verify” – no implicit trust by location or network.
- Identity as the primary control plane; verify explicitly for every access.
- Key pillars (Microsoft model): Identity, Endpoints, Applications, Data, Infrastructure, Network, Visibility & automation.
- Principles: Verify explicitly, least-privilege access, assume breach.

**IAM and secure-by-default**

- Identity lifecycle (provisioning, deprovisioning), access reviews, PIM (Privileged Identity Management) for just-in-time elevation.
- Secure-by-default: safe defaults for new resources (e.g. private endpoints, encryption on, minimal public exposure).

**References for Week 1**

- [Microsoft Zero Trust Guidance Center](https://learn.microsoft.com/en-us/security/zero-trust/)
- [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [Microsoft identity platform – OAuth 2.0 and OIDC](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols)
- [What is Azure RBAC?](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)

---

### Week 2 – Threat Modeling, Compliance, and DevSecOps

**Threat modeling**

- Purpose: Find and fix design-level security issues early (shift-left).
- Core questions: What are we building? What can go wrong? What are we doing about it? How do we know we did enough?
- **STRIDE:** Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege – use as a checklist for threats.
- Data flow diagrams (DFDs), trust boundaries, and assets to scope the model.
- **Microsoft Threat Modeling Tool:** STRIDE-based, diagram-driven; use in design phase; generates threats and mitigations.

**Compliance (high-level for consultants)**

- **SOC 2:** Service org controls (security, availability, processing integrity, confidentiality, privacy); Type I (design) vs Type II (operational effectiveness); relevant for SaaS and cloud.
- **ISO 27001:** ISMS standard; risk-based controls; often required in enterprise and government.
- **GDPR:** EU data protection; lawful basis, rights of individuals, breach notification, DPO; relevant when handling EU data.
- Why it matters: Customers ask “Are you compliant?”; consultants need to map controls and recommend approaches.

**DevSecOps**

- Security integrated into DevOps (culture, automation, shared ownership).
- Shift-left: security in design, code, and pipeline, not only in production.
- **Secure CI/CD:** No secrets in code/repos; use secret managers and pipeline identity. Sign artifacts (e.g. containers, packages). Security gates (e.g. SAST/DAST/SCA) that can block or require approval. SBOM (Software Bill of Materials) for supply chain.
- **SAST (Static Application Security Testing):** Scan source/code for vulnerabilities and misconfigurations; fast feedback; can have false positives.
- **DAST (Dynamic Application Security Testing):** Scan running app (e.g. web front/API) for runtime issues; finds different bug class; typically later in pipeline or pre-release.
- Assume-breach and least-privilege in pipelines: limit pipeline permissions; isolate build environments; treat pipeline as a high-value target.

**References for Week 2**

- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)
- [Microsoft compliance offerings (SOC 2, ISO 27001, etc.)](https://learn.microsoft.com/en-us/compliance/regulatory/offering-home)
- [OWASP DevSecOps Guideline](https://devguide.owasp.org/en/09-operations/01-devsecops/)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks)

---

### Week 3 – Operations and Tools (Interview-Ready)

**Least-privilege and assume-breach**

- **Least-privilege:** Grant only the access needed for the task; time-bound and scope-bound where possible.
- **JIT (Just-In-Time) access:** Elevate only when needed, for limited time; PIM in Entra ID is an example.
- **Assume-breach:** Design as if the perimeter is already compromised; focus on detection, containment, and limiting blast radius (segmentation, strong AuthZ, monitoring).

**Micro-segmentation**

- **Network:** Segment workloads (e.g. NSGs, firewalls, zero-trust network) so compromise in one segment doesn’t spread.
- **Identity:** Segment by identity and access (e.g. app identity vs human identity; different roles per environment).

**Continuous monitoring**

- Ongoing visibility: logs, metrics, alerts, anomaly detection.
- Security monitoring: sign-in risks, sensitive actions, misconfigurations, threats.
- Ties to SIEM (e.g. Sentinel), XDR, and CSPM (e.g. Defender for Cloud).

**Tool familiarity (what to say in an interview)**

| Tool | What it is | Key points to mention |
|------|------------|------------------------|
| **Microsoft Defender for Cloud** | Cloud-native security (CSPM + CWPP); multicloud (Azure, AWS, GCP). | Secure score, compliance dashboard, workload protection (VMs, containers, DB, storage, etc.), DevSecOps integration. |
| **Microsoft Threat Modeling Tool** | Desktop app for STRIDE-based threat modeling. | Use in design phase; diagram → auto-generated threats; part of SDL; free. |
| **Microsoft Sentinel** | Cloud SIEM and SOAR. | Ingest logs from many sources; KQL; detection rules; automation/playbooks; UEBA; threat intelligence. |
| **Splunk** | Log aggregation, search, and analytics; often used as SIEM. | Index and search logs; dashboards and alerts; common in enterprises; can feed Sentinel or work alongside. |

**References for Week 3**

- [Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction)
- [Microsoft Sentinel overview (SIEM)](https://learn.microsoft.com/en-us/azure/sentinel/overview)
- [Microsoft Threat Modeling Tool – Getting started](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-getting-started)

---

## 4. References (Curated Links)

### Zero Trust and architecture

- [Microsoft Zero Trust Guidance Center](https://learn.microsoft.com/en-us/security/zero-trust/)
- [NIST SP 800-207 – Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)

### Authentication and authorization

- [Microsoft identity platform – OAuth 2.0 and OIDC](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols)
- [Azure RBAC documentation](https://learn.microsoft.com/en-us/azure/role-based-access-control/)

### Threat modeling

- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process)
- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)

### Compliance

- [Microsoft compliance offerings](https://learn.microsoft.com/en-us/compliance/regulatory/offering-home)
- [SOC 2 Type 2](https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2)
- [ISO/IEC 27001 – Azure](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-iso-27001)

### DevSecOps and secure pipelines

- [OWASP DevSecOps Guideline](https://devguide.owasp.org/en/09-operations/01-devsecops/)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks)

### Microsoft security and monitoring tools

- [Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction)
- [Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/overview)
- [Microsoft Threat Modeling Tool](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)

---

## 5. Self-Check and Interview Readiness

### “I can explain …” checklist

- [ ] Security-by-design: what it means and 2–3 concrete principles (e.g. least privilege, encryption, small attack surface).
- [ ] Difference between AuthN and AuthZ; how OAuth 2.0 and OIDC fit in (high level).
- [ ] Zero Trust in 2–3 sentences (never trust / always verify; identity as control plane; assume breach).
- [ ] At least three Zero Trust pillars (e.g. Identity, Data, Network) and why they matter.
- [ ] What threat modeling is, when to do it, and what STRIDE stands for.
- [ ] How the Microsoft Threat Modeling Tool is used (diagram → STRIDE threats → mitigations).
- [ ] SOC 2 and ISO 27001 at a high level and why customers care.
- [ ] DevSecOps: shift-left, secure CI/CD (secrets, gates, SAST/DAST), and why pipelines are a target.
- [ ] SAST vs DAST: what each does and where they sit in the pipeline.
- [ ] Least-privilege and assume-breach in one sentence each.
- [ ] Micro-segmentation (network and identity) in simple terms.
- [ ] What Defender for Cloud, Sentinel, and the Threat Modeling Tool are and when you’d mention each.

### Practice questions

1. **“How would you explain Zero Trust to a customer who still relies on a strong perimeter?”**  
   Focus on: no implicit trust by location; verify every access; identity and device as the new perimeter; assume breach and limit blast radius.

2. **“How do you integrate security into a CI/CD pipeline?”**  
   Focus on: no secrets in code; SAST/DAST/SCA as gates; signed artifacts; least-privilege for pipeline identities; threat modeling and secure design.

3. **“We need to meet SOC 2 / ISO 27001. How would you approach it?”**  
   Focus on: understand which controls and evidence they need; map existing controls (identity, encryption, logging, access review); use cloud provider compliance (e.g. Microsoft’s attestations) and gap remediation; continuous compliance (e.g. Defender for Cloud, policy as code).

---

*End of study plan. Adjust pace to your schedule; prioritize topics that align with your experience and the role.*
