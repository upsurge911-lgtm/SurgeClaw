# SurgeClaw Security & Sentinel 🛡️

SurgeClaw is built on the principle of **Zero-Footprint Governance.** We layer administrative safety over OpenClaw's logic.

---

## 1. SurgeClaw Sentinel (v1.1.0+)
Sentinel is our professional governance suite designed for regulated environments. It moves SurgeClaw from a "shell wrapper" to an **Administrative Command Center**.

### A. Compliance Audit Ledger
Every management action is recorded to a secure, tamper-proof JSONL log (`~/.surgeclaw/audit.log`).
- **Timestamped**: Every `onboard`, `swarm start`, or `configure` action is dated.
- **User-Attributed**: Records the OS username of the executor.
- **SOC 2 / HIPAA Ready**: Provides the "Whoauthorized this agent?" paper trail required by enterprise auditors.

### B. Strict Mode (UNIX Vault)
When an agent is onboarded in **Enterprise Mode**, SurgeClaw enforces OS-level isolation:
- **UNIX 700 Permissions**: The agent's folder is locked so only the owner can enter.
- **UNIX 600 Permissions**: Configuration files (like `openclaw.json`) are locked against cross-user reading.
- **Absolute Isolation**: Even on a shared server, Agent A cannot read Agent B's secrets or history.

---

## 2. Onboarding Flow (Regulated)

![Diagram](../assets/SECURITY_diagram_1.svg)

---

## 3. Departmental Isolation
The primary security benefit of SurgeClaw is **Failure Isolation**.
- **Production Safety:** Keep your "Core" agent stable and untouched.
- **Innovation Sandbox:** Spin up "Testing" or "Scout" agents to experiment with new local models or experimental plugins.
- **Zero Bleed:** If a plugin crashes an experimental agent, your primary business workflows remain online.

---

## 4. Hardware Safety
SurgeClaw enforces a **150-Port Spacing Rule** (v1.0.4+). This ensures that internal browser tools (CDP, Relay, Canvas) from different agents never attempt to bind to the same network resource, preventing "Cross-Agent Signal Leakage."

---

## 5. Security Disclosure
If you find a security vulnerability, please contact [security@advantage.tech](mailto:security@advantage.tech). We utilize a "Landlord" security model and treat environment isolation as a critical priority.
