# Security, Compliance & Zero Trust – Study Plan

A 2–3 week study plan aligned to the **Security, Compliance & Zero Trust** section of the Microsoft Senior Consultant (Apps) role. Aim: speak confidently in interviews; hands-on depth can follow after selection. This document is self-contained: narratives, examples, and study content are included so you can learn from it without reading elsewhere.

---

## 1. How to Use This Plan

| Aspect | Detail |
|--------|--------|
| **Who it's for** | Experienced developer preparing for Senior Consultant interviews |
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

**Narrative – Why security-by-design matters**

Traditional approaches bolt security on after build (pen tests before release, firewall at the edge). Security-by-design means threat modeling during design, secure defaults in frameworks, and treating identity and data protection as first-class requirements. When you design an API, you decide auth (OAuth/OIDC), how secrets are stored (never in code), and how you segment components so a breach in one does not compromise everything. Consultants are expected to advocate for this so that "we'll fix it later" never becomes the norm.

**Encryption**

- **At rest:** AES; key management (e.g. Azure Key Vault, HSM); what "encryption at rest" means for storage and DBs.
- **In transit:** TLS 1.2+; certificate validation; why both matter for compliance and Zero Trust.

**Narrative – Encryption at rest vs in transit**

- **At rest:** Data on disk (DB, blob, VM disk) is encrypted so stolen drives or DB dumps are useless without the key. Azure Storage and SQL use AES-256; keys can be platform-managed or customer-managed (e.g. Key Vault). Compliance (SOC 2, ISO 27001) and Zero Trust both expect "encrypt sensitive data at rest."
- **In transit:** Data moving over the wire (client–server, service–service) must use TLS so eavesdroppers cannot read or alter it. TLS 1.2+ and certificate validation (no self-signed in production unless explicitly managed) are baseline. Missing either rest or transit leaves a gap (e.g. encrypted DB but plaintext on the wire).

**Code – Never put secrets in code; use Key Vault (conceptual)**

```csharp
// BAD: secret in config or code
var connectionString = "Server=...;Password=MySecret123";

// GOOD: resolve at runtime from Key Vault (or env / managed identity)
var keyVaultUri = new Uri(Environment.GetEnvironmentVariable("KEY_VAULT_URI"));
var credential = new DefaultAzureCredential();
var client = new SecretClient(keyVaultUri, credential);
KeyVaultSecret secret = await client.GetSecretAsync("DbConnectionString");
var connectionString = secret.Value;
```

Managed identity (no client secret in the app) is preferred for Azure-hosted apps: the platform injects credentials so the app can call Key Vault without storing any secret.

**Authentication (AuthN) and Authorization (AuthZ)**

- **AuthN:** "Who are you?" – identity verification (passwords, MFA, FIDO2, certificates).
- **AuthZ:** "What can you do?" – access decisions (roles, permissions, policies).
- **OAuth 2.0:** Authorization framework (authorization code, client credentials, PKCE for SPAs).
- **OpenID Connect (OIDC):** Identity layer on top of OAuth (ID tokens, user info).
- **RBAC vs ABAC:** Role-Based (who you are) vs Attribute-Based (attributes + conditions); Azure RBAC and ABAC conditions.
- **Azure AD / Microsoft Entra ID:** Identity provider for Azure/M365; app registration, scopes, consent.

**Narrative – OAuth 2.0 and OIDC in plain language**

- **OAuth 2.0** solves "let a third-party app act on my behalf without giving it my password." A user signs in at the identity provider (e.g. Entra ID); the app gets an **access token** to call APIs (e.g. Microsoft Graph) on behalf of that user. The app never sees the password. Flows you should know: **Authorization Code** (web apps; user in browser, server gets code then exchanges for tokens), **Client Credentials** (service-to-service; no user, app identity only), **PKCE** (Authorization Code + code_verifier for SPAs and mobile so the authorization code cannot be stolen and exchanged by an attacker).
- **OIDC** sits on top of OAuth: in addition to an access token, the app gets an **ID token** (JWT) with user claims (name, email, sub). So OAuth = "can this app call the API?" and OIDC = "who is the user?" – together they give you both authorization and authentication for modern apps.

**Flow (conceptual) – Authorization Code + PKCE (e.g. SPA calling your API)**

1. App redirects user to Entra ID with `response_type=code`, `client_id`, `redirect_uri`, `code_challenge` (PKCE).
2. User signs in (and MFA if required); Entra ID redirects back with `code`.
3. App (backend or SPA) exchanges `code` + `code_verifier` for tokens: **access_token** (call API), **id_token** (user identity), **refresh_token** (get new access token).
4. App sends `Authorization: Bearer <access_token>` to your API; API validates the token (signature, audience, expiry) and uses claims for AuthZ.

**Code – API validating a bearer token (pseudocode pattern)**

```csharp
// In your API (e.g. ASP.NET Core): validate JWT from Entra ID
// Token is validated for: signature (Entra keys), audience (your API app ID), expiry.
// Then read claims (e.g. "roles", "oid") to authorize:
// if (User.IsInRole("Admin")) { ... } or custom policy (e.g. require scope "API.Read")
// AuthN = token valid and identity known; AuthZ = claims/roles/scopes allow this action.
```

**Zero Trust**

- Core idea: "Never trust, always verify" – no implicit trust by location or network.
- Identity as the primary control plane; verify explicitly for every access.
- Key pillars (Microsoft model): Identity, Endpoints, Applications, Data, Infrastructure, Network, Visibility & automation.
- Principles: Verify explicitly, least-privilege access, assume breach.

**Narrative – Zero Trust in one paragraph**

The old model: "inside the corporate network = trusted." Zero Trust says network location does not imply trust (remote, cloud, BYOD). Every access must be **verified explicitly** (strong auth, device health, context). Grant **least privilege** (only what is needed). **Assume breach**: segment and monitor so one compromised asset does not take the whole estate. Identity (and device) becomes the control plane: we do not trust the network, we trust the verified identity and the policy that says "this identity can do X on resource Y."

**IAM and secure-by-default**

- Identity lifecycle (provisioning, deprovisioning), access reviews, PIM (Privileged Identity Management) for just-in-time elevation.
- Secure-by-default: safe defaults for new resources (e.g. private endpoints, encryption on, minimal public exposure).

**Narrative – Least-privilege and PIM**

Standing admin access means anyone with "Owner" can do anything, anytime; if that account is phished, the blast radius is huge. **PIM** (Privileged Identity Management) in Entra ID keeps users in a low-privilege role by default; they **activate** a role (e.g. "Global Admin") for a short window (e.g. 2 hours) when they need it. That is JIT (just-in-time) access. Combined with MFA and approval for sensitive roles, you shrink the attack surface. Secure-by-default means new storage accounts, SQL, and AKS come with encryption on, private endpoints preferred, and no unnecessary public IPs so you do not have to "remember" to harden.

**Code – Azure RBAC: scope and role assignment (Azure CLI)**

```bash
# Assign "Contributor" to a user at resource-group scope (least privilege for that RG only)
az role assignment create \
  --assignee "user@contoso.com" \
  --role "Contributor" \
  --resource-group "my-app-rg"

# Scope levels (from broad to narrow): management group -> subscription -> resource group -> resource
# Prefer assigning at resource group or resource, not entire subscription
```

RBAC = who (user/group/identity) + role (set of actions) + scope (where). ABAC adds conditions (e.g. "allow read only if resource tag Env=Prod and user has tag Team=Backend").

**References for Week 1**

- [Microsoft Zero Trust Guidance Center](https://learn.microsoft.com/en-us/security/zero-trust/)
- [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [Microsoft identity platform – OAuth 2.0 and OIDC](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols)
- [What is Azure RBAC?](https://learn.microsoft.com/en-us/azure/role-based-access-control/)

---

### Week 2 – Threat Modeling, Compliance, and DevSecOps

**Threat modeling**

- Purpose: Find and fix design-level security issues early (shift-left).
- Core questions: What are we building? What can go wrong? What are we doing about it? How do we know we did enough?
- **STRIDE:** Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege – use as a checklist for threats.
- Data flow diagrams (DFDs), trust boundaries, and assets to scope the model.
- **Microsoft Threat Modeling Tool:** STRIDE-based, diagram-driven; use in design phase; generates threats and mitigations.

**Narrative – What threat modeling is and when to do it**

Threat modeling is a structured way to think like an attacker during design. You draw a simple diagram of your system (users, services, data stores, trust boundaries), then systematically ask "what can go wrong?" for each element and flow. Doing this early (shift-left) is cheaper than finding design flaws in production. The output is a list of threats with mitigations and acceptance of residual risk. It should be updated when the system changes significantly.

**STRIDE – One-sentence definitions**

| Letter | Threat | One-line meaning |
|--------|--------|------------------|
| **S** | Spoofing | Attacker pretends to be someone/something else (e.g. fake identity, forged token). |
| **T** | Tampering | Attacker modifies data in transit or at rest (e.g. alter request, change DB). |
| **R** | Repudiation | Attacker does something and denies it; you have no proof (need logging, non-repudiation). |
| **I** | Information disclosure | Attacker sees data they should not (e.g. leak via API, logs, error messages). |
| **D** | Denial of service | Attacker makes the system unavailable (e.g. overload, crash, lock out). |
| **E** | Elevation of privilege | Attacker gains higher access than intended (e.g. escalate from user to admin). |

**Study content – STRIDE applied to a simple flow**

Imagine: **User (browser) -> Web API -> Database.**

- **Spoofing:** Could someone call the API without being the real user? Mitigation: strong AuthN (OAuth/OIDC, MFA), validate tokens.
- **Tampering:** Could requests or responses be modified? Mitigation: HTTPS, signing, integrity checks.
- **Repudiation:** Could a user deny an action? Mitigation: audit logs (who did what, when).
- **Information disclosure:** Could the API or DB leak data? Mitigation: least privilege, no sensitive data in errors, encrypt PII.
- **Denial of service:** Could the API or DB be overwhelmed? Mitigation: rate limiting, quotas, scaling.
- **Elevation of privilege:** Could a normal user get admin? Mitigation: RBAC, validate roles on every request, no default-admin accounts.

The Microsoft Threat Modeling Tool lets you draw this flow, mark trust boundaries (e.g. between browser and API, API and DB), and it generates STRIDE threats per element so you can assign mitigations.

**Compliance (high-level for consultants)**

- **SOC 2:** Service org controls (security, availability, processing integrity, confidentiality, privacy); Type I (design) vs Type II (operational effectiveness); relevant for SaaS and cloud.
- **ISO 27001:** ISMS standard; risk-based controls; often required in enterprise and government.
- **GDPR:** EU data protection; lawful basis, rights of individuals, breach notification, DPO; relevant when handling EU data.
- Why it matters: Customers ask "Are you compliant?"; consultants need to map controls and recommend approaches.

**Narrative – What SOC 2, ISO 27001, and GDPR mean in practice**

- **SOC 2** is a report from an auditor that your organization's controls (for security, availability, etc.) are in place. Type I = "we have the controls designed"; Type II = "we ran them over a period and they worked." Customers often require a SOC 2 report before trusting you with their data. As a consultant you help design controls (access review, encryption, logging) and evidence (policies, screenshots, logs) that support the audit.
- **ISO 27001** is a standard for an Information Security Management System (ISMS): you identify risks, choose controls from an annex or your own set, and get certified by an external body. It is risk-based and broad (physical security, HR, change management). Many enterprises and governments require it. You help map technical controls (identity, encryption, backup) to ISO domains and close gaps.
- **GDPR** (EU) governs personal data: lawful basis for processing, data subject rights (access, erasure, portability), breach notification within 72 hours, and often a Data Protection Officer. If the solution processes EU residents' data, you need to consider consent, retention, and how to support those rights technically (e.g. export/delete APIs).

**DevSecOps**

- Security integrated into DevOps (culture, automation, shared ownership).
- Shift-left: security in design, code, and pipeline, not only in production.
- **Secure CI/CD:** No secrets in code/repos; use secret managers and pipeline identity. Sign artifacts (e.g. containers, packages). Security gates (e.g. SAST/DAST/SCA) that can block or require approval. SBOM (Software Bill of Materials) for supply chain.
- **SAST (Static Application Security Testing):** Scan source/code for vulnerabilities and misconfigurations; fast feedback; can have false positives.
- **DAST (Dynamic Application Security Testing):** Scan running app (e.g. web front/API) for runtime issues; finds different bug class; typically later in pipeline or pre-release.
- Assume-breach and least-privilege in pipelines: limit pipeline permissions; isolate build environments; treat pipeline as a high-value target.

**Narrative – SAST vs DAST**

- **SAST** looks at source code (or binaries) without running the app. It finds issues like SQL injection patterns, hardcoded secrets, insecure config. It runs early in the pipeline (on commit or PR). Pros: fast, no deploy needed. Cons: false positives, may miss runtime-only issues.
- **DAST** runs against a live or staged app (e.g. crawls URLs, sends malicious inputs). It finds issues that only appear at runtime (e.g. broken auth, XSS in rendered output). It usually runs after deploy to a test environment. Pros: real attacks. Cons: slower, needs a running app, may not cover all code paths.

Use both: SAST for quick feedback, DAST for confidence before release.

**Code – Secure CI/CD pipeline (conceptual YAML – Azure DevOps / GitHub Actions style)**

```yaml
# Conceptual: security steps in a pipeline
steps:
  - script: echo "No secrets in repo – use Azure Key Vault / GitHub Secrets / pipeline variables"
  - task: SecretScan  # or use GitHub CodeQL secret scanning, TruffleHog, etc.
  - task: SAST        # e.g. Semgrep, SonarQube, CodeQL
    # fail the build or require approval if high/critical found
  - task: SCA        # dependency scan (npm audit, OWASP Dependency-Check, Snyk)
  - script: docker build -t myapp .
  - task: ContainerScan  # scan image for CVEs
  - script: docker push ...
  # Optional: sign image (notation, cosign) so only signed images deploy
  - task: DeployToStaging
  - task: DAST       # run against staging
  # Gate: only promote if DAST passes and no critical open
```

**Study content – Why pipelines are a target**

Attackers target CI/CD because a single compromise can inject malicious code into builds, steal secrets, or deploy backdoors. So: no long-lived secrets in pipeline config (use OIDC/federated creds where possible), minimal permissions for the pipeline identity, and isolate build agents. Assume breach: if the pipeline is compromised, segment so it cannot reach production secrets or change production without additional checks.

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

**Narrative – Assume-breach in practice**

Assume-breach means you assume an attacker is already inside (or will get in). So you focus on: (1) **Detection** – logging, alerts, UEBA, so you see anomalous behavior; (2) **Containment** – micro-segmentation and least privilege so one compromised host or account cannot move laterally; (3) **Limiting blast radius** – critical data and admin actions behind extra controls (e.g. PIM, break-glass only). You do not rely on "the firewall will keep them out."

**Micro-segmentation**

- **Network:** Segment workloads (e.g. NSGs, firewalls, zero-trust network) so compromise in one segment does not spread.
- **Identity:** Segment by identity and access (e.g. app identity vs human identity; different roles per environment).

**Narrative – Micro-segmentation in simple terms**

Instead of one flat network where any compromised VM can talk to any other, you split the network into segments (e.g. web tier, app tier, data tier). Rules (NSGs, firewalls) allow only necessary traffic (e.g. web -> app on port 443, app -> DB on 1433). So if the web tier is compromised, the attacker cannot directly reach the DB. Identity micro-segmentation means different identities for different tiers or environments (e.g. prod app identity cannot access dev); roles are scoped so one compromise does not grant broad access.

**Code – Azure NSG rule (conceptual): allow only app tier to DB**

```json
{
  "direction": "Inbound",
  "sourceAddressPrefix": "10.0.2.0/24",
  "sourcePortRange": "*",
  "destinationAddressPrefix": "10.0.3.4",
  "destinationPortRange": "1433",
  "protocol": "Tcp",
  "access": "Allow",
  "priority": 100
}
```

Interpretation: only traffic from the app subnet (10.0.2.0/24) to the DB (10.0.3.4) on port 1433 is allowed. Everything else is denied by default (or by lower-priority rules). This is network micro-segmentation at the rule level.

**Continuous monitoring**

- Ongoing visibility: logs, metrics, alerts, anomaly detection.
- Security monitoring: sign-in risks, sensitive actions, misconfigurations, threats.
- Ties to SIEM (e.g. Sentinel), XDR, and CSPM (e.g. Defender for Cloud).

**Study content – What a SIEM does**

A SIEM (Security Information and Event Management) ingests logs from many sources (identity, network, endpoints, cloud), normalizes them, and runs detection rules (e.g. "many failed logins from one IP," "privilege escalation," "impossible travel"). It supports investigation (search, pivot) and often automation (playbooks: when alert X fires, run script Y or create ticket). Sentinel is Microsoft's cloud SIEM; Splunk is a common log platform that can act as a SIEM. You mention them when discussing "how do we detect and respond to threats?"

**Tool familiarity (what to say in an interview)**

| Tool | What it is | Key points to mention |
|------|------------|------------------------|
| **Microsoft Defender for Cloud** | Cloud-native security (CSPM + CWPP); multicloud (Azure, AWS, GCP). | Secure score, compliance dashboard, workload protection (VMs, containers, DB, storage, etc.), DevSecOps integration. |
| **Microsoft Threat Modeling Tool** | Desktop app for STRIDE-based threat modeling. | Use in design phase; diagram -> auto-generated threats; part of SDL; free. |
| **Microsoft Sentinel** | Cloud SIEM and SOAR. | Ingest logs from many sources; KQL; detection rules; automation/playbooks; UEBA; threat intelligence. |
| **Splunk** | Log aggregation, search, and analytics; often used as SIEM. | Index and search logs; dashboards and alerts; common in enterprises; can feed Sentinel or work alongside. |

**Code – KQL (Sentinel) one-liner for interview context**

Sentinel uses KQL (Kusto Query Language) for hunting and detection. Example: "show sign-ins where risk level is high and location is new for this user."

```kql
SigninLogs
| where RiskLevelDuringSignIn == "high"
| where Location != "Unknown"
| project TimeGenerated, UserPrincipalName, IPAddress, Location, RiskLevelDuringSignIn
```

You do not need to write KQL in the interview; knowing that Sentinel uses KQL and that you write queries over log tables (SigninLogs, AzureActivity, etc.) is enough to sound confident.

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

### "I can explain …" checklist

- [ ] Security-by-design: what it means and 2–3 concrete principles (e.g. least privilege, encryption, small attack surface).
- [ ] Difference between AuthN and AuthZ; how OAuth 2.0 and OIDC fit in (high level).
- [ ] Zero Trust in 2–3 sentences (never trust / always verify; identity as control plane; assume breach).
- [ ] At least three Zero Trust pillars (e.g. Identity, Data, Network) and why they matter.
- [ ] What threat modeling is, when to do it, and what STRIDE stands for.
- [ ] How the Microsoft Threat Modeling Tool is used (diagram -> STRIDE threats -> mitigations).
- [ ] SOC 2 and ISO 27001 at a high level and why customers care.
- [ ] DevSecOps: shift-left, secure CI/CD (secrets, gates, SAST/DAST), and why pipelines are a target.
- [ ] SAST vs DAST: what each does and where they sit in the pipeline.
- [ ] Least-privilege and assume-breach in one sentence each.
- [ ] Micro-segmentation (network and identity) in simple terms.
- [ ] What Defender for Cloud, Sentinel, and the Threat Modeling Tool are and when you would mention each.

### Practice questions

1. **"How would you explain Zero Trust to a customer who still relies on a strong perimeter?"**  
   Focus on: no implicit trust by location; verify every access; identity and device as the new perimeter; assume breach and limit blast radius.

2. **"How do you integrate security into a CI/CD pipeline?"**  
   Focus on: no secrets in code; SAST/DAST/SCA as gates; signed artifacts; least-privilege for pipeline identities; threat modeling and secure design.

3. **"We need to meet SOC 2 / ISO 27001. How would you approach it?"**  
   Focus on: understand which controls and evidence they need; map existing controls (identity, encryption, logging, access review); use cloud provider compliance (e.g. Microsoft's attestations) and gap remediation; continuous compliance (e.g. Defender for Cloud, policy as code).

---

*End of study plan. This document is designed to be 100% self-contained for understanding; use the references for deeper dives. Adjust pace to your schedule; prioritize topics that align with your experience and the role.*
