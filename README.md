<div align="center">
  <img src="assets/king_lobster_mascot.png" width="300" alt="SurgeClaw Mascot" />

  # SurgeClaw 🦞⚡
  **One Machine. Infinite OpenClaws.**

  SurgeClaw is a professional process manager and governance layer for OpenClaw swarms.  
  It enables you to deploy, isolate, and audit multiple OpenClaws on a single machine with zero configuration debt.

  [![Release](https://img.shields.io/badge/release-v1.1.1-yellow.svg?style=flat-square)](https://github.com/upsurge911-lgtm/SurgeClaw/releases)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://github.com/upsurge911-lgtm/SurgeClaw/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
  <br />
  [![SOC2](https://img.shields.io/badge/Compliance-SOC2_Ready-blueviolet.svg?style=flat-square)](docs/SECURITY.md)
  [![UAE AI Act](https://img.shields.io/badge/Compliance-UAE_AI_Act-00732f.svg?style=flat-square)](docs/SECURITY.md)
  [![Made in Dubai](https://img.shields.io/badge/Made_in-Dubai_🦞-red.svg?style=flat-square)](https://upsurge.ae)
  [![npm downloads](https://img.shields.io/npm/dm/advantage-surgeclaw.svg?style=flat-square)](https://www.npmjs.com/package/advantage-surgeclaw)
</div>

---

## What is SurgeClaw?
SurgeClaw is the **Thin Orchestration Layer** designed for the modern AI department. Instead of managing fragmented configurations, SurgeClaw allows you to run, monitor, and audit multiple independent OpenClaw "souls" on a single server with enterprise-grade isolation and compliance.

### Key Features
*   **Enterprise-Grade Multi-Tenancy** — Deploy and scale multiple isolated OpenClaw instances on a single machine with zero data cross-pollination.
*   **Three-Layer Sentinel Isolation** — Advanced protection through environmental cloaking, mandatory 150-port spacing, and absolute path confinement.
*   **Sovereign Compliance** — Built-in audit ledgers and strict security modes designed for SOC 2, UAE PDPL, and the UAE AI Act.
*   **Thin Orchestration Layer** — Magnifies OpenClaw's capabilities without modifying its core logic, ensuring seamless compatibility with future updates.
*   **The "Landlord" Model** — Maintains absolute data sovereignty by isolating ephemeral "Tenant" instances from your primary "King" environment.
*   **Instant Swarm Management** — Command your entire AI department with a single heartbeat status check and unified start/stop operations.

---

![SurgeClaw Sentinel Demo](assets/Demo_HQ.gif)

---

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

## 🏛️ Architecture: The "Landlord" Model
SurgeClaw acts as the **Administrative Command Center**. We do not rewrite OpenClaw's "soul"; we orchestrate its environment. It provides the building (the machine), the utilities (the ports), and the security (the permissions), but it never interacts with the **Tenant** directly.

> **Deep Dive:** [Read the full Architecture Document](docs/ARCHITECTURE.md) to learn about our Three-Layer Isolation and Sub-shell Pattern.

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
