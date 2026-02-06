# SurgeClaw 🦞⚡

### High-Performance Orchestration for Multi-Instance OpenClaw Swarms.

![The Legendary King Lobster Mascot](https://github.com/upsurge911-lgtm/SurgeClaw/raw/main/assets/king_lobster_surge_mascot.png)

> [!NOTE]
> **SurgeClaw is a thin orchestration layer designed to magnify the native capabilities of OpenClaw.** It enables you to run multiple independent agents on a single machine with zero port collisions and absolute process isolation.

---

## 🏛️ The Philosophy
In the agentic era, scaling your business shouldn't mean scaling your risk. SurgeClaw allows you to departmentalize your AI workflows by running specialized, isolated OpenClaw instances for every role—from Marketing to Pen-Testing.

- **Non-Intrusive:** We don't fork OpenClaw. We don't change its internal logic. We simply automate the native isolation features.
- **Zero Lock-in:** All configurations are standard JSON. If SurgeClaw is removed, your agents continue to function natively.
- **Resource Aware:** Designed for high-density environments like the Mac Mini, ensuring safe port management and directory isolation.

## 🛡️ Why SurgeClaw?

### 1. Departmental Integrity
Running one agent is experimental. Running an organization requires isolation. Your "Master" agent (holding payment details and core secrets) should never be used to test unstable alpha-features. SurgeClaw lets you spin up a dedicated "Testing" or "HR" agent in 10 seconds.

### 2. Failure Isolation
If a specialized agent crashes during heavy experimentation, your primary business workflows remain untouched. "Fail-fast" is finally safe.

### 3. Cost & Context Optimization
Direct specific agents to use job-optimized local models or quantized LLMs, while reserving high-end APIs for your "Master" instance. SurgeClaw makes managing these environment-specific overrides instantaneous.

### 4. GUI Native Support
SurgeClaw aligns its directory structure with the OpenClaw Control UI. Every agent you onboard via CLI will automatically appear in your native Control UI dropdown, allowing you to manage granular permissions (Screen Recording, Accessibility) for each individual specialist.

## ⚙️ Under the Hood: Technical Primitives
SurgeClaw uses a "Three-Layer Isolation" strategy to ensure your agents never bleed into each other or your host system:
- **Digital Cloaking:** We override the `HOME` and `OPENCLAW_HOME` environment variables for every child process, forcing the agent to treat its own cabinet as the root of the universe.
- **Path Confinement:** Every command is executed from a unique `cwd` (Current Working Directory) within the agent's instance folder.
- **Port Spacing:** SurgeClaw enforces a mandatory 20-port block spacing (starting at 18789) to prevent WebSocket gateway collisions.
- **Swarm Management:** Instead of using the native `--install-daemon` (which can conflict in multi-agent setups), SurgeClaw acts as the process orchestrator for your swarm, ensuring each agent stays in its lane.

## 📦 Installation
```bash
npm install -g @surgeclaw/cli
```
*(Requires OpenClaw to be installed via your preferred method: npm, pnpm, or nix)*

## 🛠️ Getting Started

> [!WARNING]
> **Avoid Native Daemon for Swarms:** Do not run `openclaw onboard --install-daemon` inside your SurgeClaw agents. This replaces the OS-level service for your *entire* machine and will cause collisions between agents. SurgeClaw acts as your centralized swarm manager.

### 1. Initialize Your Departments
Initialize your CEO/Daily Driver first, then spin up OpenClaw agents:
```bash
# Set up your KingLobster (CEO / Daily Driver)
surgeclaw onboard --name KingLobster --role "CEO"

# Register the Marketing lead
surgeclaw onboard --name Marketing --role "Content Specialist"

# Register high-bandwidth Lead Gen
surgeclaw onboard --name Lead-Gen --role "Outreach Factory"
```

### 2. Configure the "Soul"
Call native OpenClaw setup commands directly through the SurgeClaw router:
```bash
surgeclaw Marketing setup
surgeclaw Security setup
```

### 2. Launch the Swarm
Deploy your entire organization to the background in one command:
```bash
# Wake up the entire swarm (CEO, Marketing, Lead-Gen)
surgeclaw swarm start

# Or control a specific agent
surgeclaw start KingLobster
surgeclaw stop KingLobster
```

### 3. Step Into the Office
Step inside an agent's environment and use native `openclaw` commands directly:
```bash
surgeclaw configure Marketing
```

---

## 🛡️ Reliability & Security
SurgeClaw implements a **Hard Environment Barrier**. It will never access or modify your default `~/.openclaw` directory unless you explicitly authorize a migration. Your core agents remain in a "Private Vault" while the swarm handles the heavy lifting.

**Scale your organization. Protect your King.** 🦞⚡🦾

---
*SurgeClaw is a community-driven expansion for the OpenClaw ecosystem. We are not officially affiliated with the OpenClaw core team; we just build tools that make their work go further.*
