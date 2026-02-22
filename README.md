# How to Deploy OpenClaw into Your Business? (SurgeClaw Enterprise) 🦞⚡

[![npm version](https://img.shields.io/npm/v/advantage-surgeclaw.svg?style=flat-square)](https://www.npmjs.com/package/advantage-surgeclaw)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

**One Machine. Infinite OpenClaws.**  
SurgeClaw is a professional process manager and governance layer for OpenClaw swarms.  
It enables you to deploy, isolate, and audit multiple OpenClaws on a single machine with zero configuration debt.

![SurgeClaw Sentinel Demo](assets/Demo_HQ.gif)

---

> **📖 Read our Official Guide:** [How to Deploy OpenClaw for Enterprise & Business](docs/HOW_TO_DEPLOY_OPENCLAW_FOR_ENTERPRISE.md)

## ⚡ Quick Start

### 1. Install
```bash
npm install -g advantage-surgeclaw
```

### 2. Launch
```bash
# Onboard your first OpenClaw
surgeclaw onboard

# Activate the swarm
surgeclaw swarm start
```

---

## 🛡️ SurgeClaw Sentinel (v1.1.0)
SurgeClaw Sentinel transforms a group of OpenClaw instances into a **Regulated AI Department**. It layers enterprise-grade security over native OpenClaw logic:

*   **Audit Ledger**: Every management action is recorded to a secure, tamper-proof log for SOC 2 and UAE AI Act compliance.
*   **Strict Mode**: Enforces UNIX 600 (User-Only) permissions at the OS level for instance configuration and memory.
*   **Personal/Enterprise Toggle**: Switch between a low-friction developer mode and a high-governance environment with one choice.

---

## 🏛️ Architecture: The "Landlord" Model
SurgeClaw acts as the **Administrative Command Center**. We do not rewrite OpenClaw's "soul"; we orchestrate its environment. It provides the building (the machine), the utilities (the ports), and the security (the permissions), but it never interacts with the **Tenant** directly.

![The Landlord Model](assets/ARCHITECTURE_diagram_1.svg)

> **Deep Dive:** [Read the full Architecture Document](docs/ARCHITECTURE.md) to learn about our Three-Layer Isolation and Sub-shell Pattern.

---

## 💼 Use Cases

*   **The Solo Founder**: Run a full C-suite (CEO, CMO, CTO) on a single Mac Mini with absolute data isolation.
*   **The AI Agency**: Deploy isolated, client-specific environments with zero port collisions or credential leaks.
*   **The Enterprise Tower**: Meet regional compliance (UAE PDPL, GDPR) by hosting all AI processing on sovereign local hardware.

---

## 🛠️ Management Commands

| Command | Action |
| :--- | :--- |
| `surgeclaw onboard` | Interactive wizard with Sentinel security choices. |
| `surgeclaw swarm start` | Instant, background deployment of all registered OpenClaws. |
| `surgeclaw configure [name]` | Step into an OpenClaw's isolated sub-shell (The Office). |
| `surgeclaw status` | Real-time heartbeat and health check for the entire swarm. |

*Full documentation available in* [docs/CLI_REFERENCE.md](docs/CLI_REFERENCE.md).

---

## 📜 Identity & Philosophy
*   **Thin Wrapper**: We inherit every OpenClaw update natively. No maintenance debt.
*   **Identity**: Built for the sovereign developer. Made with 🦞 in Dubai.

**Advantage Technologies Inc. | 2026**
